const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { DB_CONFIG } = require('../config/db.config');

const SCHEMA_FILE = path.join(__dirname, '..', 'db', 'schema.sql');

const migrate = async () => {
    const { database, ...serverConfig } = DB_CONFIG;
    const connection = await mysql.createConnection({ ...serverConfig, multipleStatements: true });

    try {
        await connection.query(
            `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
        );
        await connection.query(`USE \`${database}\``);
        await connection.query(fs.readFileSync(SCHEMA_FILE, 'utf8'));
        console.log(`Schema applied to database "${database}"`);
    } finally {
        await connection.end();
    }
};

if (require.main === module) {
    migrate().catch((error) => {
        console.error('Migration failed:', error.message);
        process.exit(1);
    });
}

module.exports = {
    migrate,
};
