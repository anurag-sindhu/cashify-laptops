const path = require('path');
const { migrate } = require('./migrate');
const { upsertProducts } = require('../services/product.service');
const { closePool } = require('../db/connection');

const SEED_FILE = path.join(__dirname, '..', 'db', 'seed', 'laptops.json');

const seed = async () => {
    await migrate();

    const products = Object.values(require(SEED_FILE));
    await upsertProducts(products);
    console.log(`Seeded ${products.length} laptops`);
};

seed()
    .catch((error) => {
        console.error('Seeding failed:', error.message);
        process.exitCode = 1;
    })
    .finally(closePool);
