const mysql = require('mysql2/promise');
const { DB_CONFIG } = require('../config/db.config');

let pool;

const getPool = () => {
    if (!pool) {
        pool = mysql.createPool({ ...DB_CONFIG, connectionLimit: 5 });
    }
    return pool;
};

const closePool = async () => {
    if (pool) {
        await pool.end();
        pool = null;
    }
};

module.exports = {
    getPool,
    closePool,
};
