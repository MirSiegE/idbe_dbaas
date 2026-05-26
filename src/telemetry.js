const pool = require('./db');

async function getTelemetry(call, callback) {
    console.log(`\n GetTelemetry called`);
    try {
        const connResult = await pool.query(`
            SELECT state, COUNT(*) ::int AS total FROM pg_stat_activity GROUP BY state`);

        const connections = connResult.rows.map(r => ({
            state: r.state || 'unknown',
            total: r.total
        }));
        
        const walResult = await pool.query(`
            SELECT wal_records, wal_fpi, wal_bytes FROM pg_stat_wal`);
        const wal = walResult.rows[0] || {};
        
        const dbResult = await pool.query(`
            SELECT blks_read, blks_hit, xact_commit, xact_rollback FROM pg_stat_database 
            WHERE datname = current_database()`);
        const db = dbResult.rows[0] || {};

        let topQueries = [];
        try {
            const qResult = await pool.query(`
                SELECT query, calls::int, ROUND(mean_exec_time::numeric, 2) AS mean_exec_time,
                ROUND(total_exec_time::numeric, 2) AS total_exec_time
                FROM pg_stat_statements ORDER BY calls DESC LIMIT 10`);
            topQueries = qResult.rows;
            } catch {
                topQueries = [{
                    query: 'pg_stat_statements extension not enabled. Add to postgresql.conf: shared_preload_libraries = pg_stat_statements',
                    calls: 0,
                    mean_exec_time: 0,
                    total_exec_time: 0
                }];
            }

        console.log(`Telemetry collected - ${connections.length} connection states, ${topQueries.length} queries\n`);

        callback(null, {
            status: 'success',
            connections: connections,
            wal_records: parseInt(wal.wal_records) || 0,
            wal_bytes: parseInt(wal.wal_bytes) || 0,
            wal_fpi: parseInt(wal.wal_fpi) || 0,
            blks_hit: parseInt(db.blks_hit) || 0,
            blks_read: parseInt(db.blks_read) || 0,
            xact_commit: parseInt(db.xact_commit) || 0,
            xact_rollback: parseInt(db.xact_rollback) || 0,
            top_queries: topQueries
        });
    } catch (err) {
        console.error(`GetTelemetry failed:`, err.message);
        callback(null, {
            status: 'error',
            connections: [],
            top_queries: [],
        });
    }
}
// GET TENANT STATS