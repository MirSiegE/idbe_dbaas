const pool = require('./db');

async function createTenantSchema(call, callback) {
  const {
    tenant_id, schema_name, user_name,
    company, node, storage, ram, conn_limit
  } = call.request;

  console.log(`\n📥 CreateTenantSchema called`);
  console.log(`   tenant_id:   ${tenant_id}`);
  console.log(`   schema_name: ${schema_name}`);
  console.log(`   user:        ${user_name} @ ${company}`);

  const client = await pool.connect();
  const roleName = `${schema_name}_role`;

  try {
    await client.query('BEGIN');

    // PHASE 3A: Create schema
    console.log(`   → CREATE SCHEMA ${schema_name}`);
    await client.query(
      `CREATE SCHEMA IF NOT EXISTS ${schema_name}`
    );

    // PHASE 3B: Create tables
    console.log(`   → Creating tables`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${schema_name}.projects (
        project_id   SERIAL PRIMARY KEY,
        project_name TEXT      NOT NULL,
        created_at   TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS ${schema_name}.telemetry (
        id           SERIAL PRIMARY KEY,
        metric_name  TEXT,
        metric_value TEXT,
        recorded_at  TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS ${schema_name}.audit_logs (
        id           SERIAL PRIMARY KEY,
        action       TEXT,
        performed_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // PHASE 3C: Create RBAC role
    console.log(`   → CREATE ROLE ${roleName}`);
    const roleCheck = await client.query(
      `SELECT 1 FROM pg_roles WHERE rolname = $1`,
      [roleName]
    );

    if (roleCheck.rowCount === 0) {
      await client.query(`CREATE ROLE ${roleName}`);
    }

    await client.query(
      `GRANT USAGE ON SCHEMA ${schema_name} TO ${roleName}`
    );

    await client.query(
      `GRANT SELECT ON ALL TABLES IN SCHEMA ${schema_name} TO ${roleName}`
    );

    // PHASE 3D: Connection limit
    const limit = conn_limit || 10;
    console.log(`   → CONNECTION LIMIT ${limit}`);
    await client.query(
      `ALTER ROLE ${roleName} CONNECTION LIMIT ${limit}`
    );

    // Audit log
    await client.query(
      `INSERT INTO ${schema_name}.audit_logs (action) VALUES ($1)`,
      [`Schema ${schema_name} created for ${user_name} at ${company} on ${node}`]
    );

    await client.query('COMMIT');

    console.log(`✅ Schema ${schema_name} created successfully\n`);

    callback(null, {
      status:      'success',
      schema_name: schema_name,
      message:     `Schema ${schema_name} created with tables, RBAC role ${roleName}, connection limit ${limit}`
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`❌ CreateTenantSchema failed:`, err.message);
    callback(null, {
      status:      'error',
      schema_name: schema_name,
      message:     `Failed to create schema ${schema_name}: ${err.message}`
    });
  } finally {
    client.release();
  }
}

async function deleteTenantSchema(call, callback) {
  const { tenant_id, schema_name } = call.request;

  console.log(`\n📥 DeleteTenantSchema called`);
  console.log(`   tenant_id:   ${tenant_id}`);
  console.log(`   schema_name: ${schema_name}`);

  const roleName = `${schema_name}_role`;
  const client   = await pool.connect();

  try {
    await client.query('BEGIN');

    // PHASE 1: Drain active connections
    console.log(`   → Draining connections`);
    const sessions = await client.query(
      `SELECT pid FROM pg_stat_activity
       WHERE usename = $1 AND pid <> pg_backend_pid()`,
      [roleName]
    );
    for (const row of sessions.rows) {
      await client.query(
        `SELECT pg_terminate_backend($1)`, [row.pid]
      );
    }

    // PHASE 4A: Revoke permissions
    console.log(`   → Revoking permissions`);
    await client.query(
      `REVOKE ALL ON SCHEMA ${schema_name} FROM ${roleName}`
    ).catch(() => {});

    await client.query(
      `REVOKE ALL ON ALL TABLES IN SCHEMA ${schema_name} FROM ${roleName}`
    ).catch(() => {});

    // PHASE 4B: Drop role
    const roleCheck = await client.query(
      `SELECT 1 FROM pg_roles WHERE rolname = $1`, [roleName]
    );
    if (roleCheck.rowCount > 0) {
      console.log(`   → DROP ROLE ${roleName}`);
      await client.query(`DROP ROLE ${roleName}`);
    }

    // PHASE 4C: Drop schema
    console.log(`   → DROP SCHEMA ${schema_name} CASCADE`);
    await client.query(
      `DROP SCHEMA IF EXISTS ${schema_name} CASCADE`
    );

    await client.query('COMMIT');

    console.log(`✅ Schema ${schema_name} terminated\n`);

    callback(null, {
      status:      'TERMINATED',
      schema_name: schema_name,
      message:     `Schema ${schema_name} and role ${roleName} fully removed`
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`❌ DeleteTenantSchema failed:`, err.message);
    callback(null, {
      status:      'error',
      schema_name: schema_name,
      message:     err.message
    });
  } finally {
    client.release();
  }
}

module.exports = { createTenantSchema, deleteTenantSchema };