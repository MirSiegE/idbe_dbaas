const path = require('path');
const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');
require('dotenv').config();

const { createTenantSchema, deleteTenantSchema } = require('./schema');
const { getTelemetry, getTenantStats } = require('./telemetry');

const PROTO_PATH =path.join(__dirname, '..', 'proto', 'db_manager.proto');

const packageDef = loader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const loadedPackage = grpc.loadPackageDefinition(packageDef);
console.log('Loaded package keys:', Object.keys(loadedPackage));
console.log('dbmanager keys:', Object.keys(loadedPackage.dbmanager));
const proto = loadedPackage.dbmanager;

if (!proto || !proto.Dbmanager) {
    console.error('Could not find DbManager in proto. Keys found:' + Object.keys(loadedPackage));
    process.exit(1);
}

const server = new grpc.Server();
server.addService(proto.Dbmanager.service, {
    CreateTenantSchema: createTenantSchema,
    DeleteTenantSchema: deleteTenantSchema,
    GetTelemetry: getTelemetry,
    GetTenantStats: getTenantStats
});

const PORT = process.env.GRPC_PORT || 50051;
const ADDRESS = `0.0.0.0:${PORT}`;

const pool = require('./db');
pool.query('SELECT 1')
.then(() => console.log('PostgreSQL connected'))
.catch(err => console.error('PostgreSQL connection failed:', err.message));

server.bindAsync(
    ADDRESS,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.error(`Failed to start gRPC server:`, err.message);
            process.exit(1);
        }
        console.log('_____________________________________');
        console.log('DB Manager gRPC Server started');
        console.log(` Address : ${ADDRESS}`);
        console.log(`Port : ${port}`);
        console.log('_____________________________________');
        console.log(' RPCs available:');
        console.log(' - CreateTenantSchema');
        console.log(' - DeleteTenantSchema');
        console.log(' - GetTelemetry');
        console.log(' - GetTenantStats');
        console.log('_____________________________________');
    }
);