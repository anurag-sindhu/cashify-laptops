const { getPool } = require('../db/connection');

const COLUMNS = [
    ['product_id', 'productId'],
    ['title', 'title'],
    ['brand', 'brand'],
    ['link', 'link'],
    ['mrp', 'mrp'],
    ['price', 'price'],
    ['sale_price', 'salePrice'],
    ['effective_price', 'effectivePrice'],
    ['ram', 'ram'],
    ['storage', 'storage'],
    ['availability', 'availability'],
    ['available_quantity', 'availableQuantity'],
    ['source', 'source'],
];

const COLUMN_NAMES = COLUMNS.map(([column]) => column).join(', ');

const toRow = (product) => COLUMNS.map(([, field]) => product[field] ?? null);

const toPrice = (value) => (value === null || value === undefined ? null : Number(value));

// productId -> effective price
const loadProductPrices = async () => {
    const [rows] = await getPool().query('SELECT product_id, effective_price FROM laptops');
    return new Map(rows.map((row) => [row.product_id, toPrice(row.effective_price)]));
};

const insertProduct = async (product) => {
    const [result] = await getPool().query(`INSERT IGNORE INTO laptops (${COLUMN_NAMES}) VALUES ?`, [
        [toRow(product)],
    ]);
    return result.affectedRows > 0;
};

const upsertProducts = async (products) => {
    if (!products.length) {
        return;
    }
    const updates = COLUMNS.filter(([column]) => column !== 'product_id')
        .map(([column]) => `${column} = VALUES(${column})`)
        .join(', ');
    await getPool().query(`INSERT INTO laptops (${COLUMN_NAMES}) VALUES ? ON DUPLICATE KEY UPDATE ${updates}`, [
        products.map(toRow),
    ]);
};

module.exports = {
    loadProductPrices,
    insertProduct,
    upsertProducts,
};
