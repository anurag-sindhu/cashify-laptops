const { loadProductPrices, insertProduct, upsertProducts } = require('../services/product.service');
const { notify } = require('../services/notification.service');
const { formatProduct } = require('../utils/productFormatter');
const {
    API_BASE_URL,
    PAGE_SIZE,
    PAGE_DELAY_MS,
    MAX_PAGES,
    API_HEADERS,
    SEARCH_FILTERS,
    SORT_FIELD,
} = require('../config/scraper.config');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildRequestBody = (offset) => ({
    qry: null,
    ps: PAGE_SIZE,
    os: offset,
    sf: SORT_FIELD,
    fr: SEARCH_FILTERS,
    st: 'k',
});

const fetchListings = async (offset) => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify(buildRequestBody(offset)),
    });

    if (!response.ok) {
        throw new Error(`Cashify API failed (${response.status})`);
    }

    return response.json();
};

const handleNewProduct = async (product, { newProducts }) => {
    if (!(await insertProduct(product))) {
        return;
    }
    const message = `[new] ${product.title} | ${product.brand} | Rs.${product.effectivePrice} | ${product.ram} | ${product.storage} | ${product.link}`;
    console.log(message);
    await notify(`Cashify new laptop: ${product.title}`, message);
    newProducts.push(product);
};

const handleKnownProduct = async (product, oldPrice, { priceDrops }) => {
    const newPrice = product.effectivePrice;
    if (newPrice === oldPrice) {
        return;
    }

    await upsertProducts([product]);

    if (newPrice != null && oldPrice != null && newPrice < oldPrice) {
        const message = `[price drop] ${product.title} | Rs.${oldPrice} -> Rs.${newPrice} | ${product.link}`;
        console.log(message);
        await notify(`Cashify price drop: ${product.title}`, message);
        priceDrops.push({ product, oldPrice });
    }
};

const processListing = async (listing, context) => {
    const { storedPrices } = context;
    const product = formatProduct(listing);
    if (!product) {
        console.warn('Product not formatted correctly:', listing.id);
        return;
    }

    if (storedPrices.has(product.productId)) {
        await handleKnownProduct(product, storedPrices.get(product.productId), context);
    } else {
        await handleNewProduct(product, context);
    }
    storedPrices.set(product.productId, product.effectivePrice ?? null);
};

const runScraper = async () => {
    const newProducts = [];
    const priceDrops = [];
    const context = {
        newProducts,
        priceDrops,
        storedPrices: await loadProductPrices(),
    };

    console.log(`Cashify Laptops API | Page size: ${PAGE_SIZE} | Max pages: ${MAX_PAGES}`);

    for (let page = 0; page < MAX_PAGES; page++) {
        const offset = page * PAGE_SIZE;
        await delay(PAGE_DELAY_MS);

        try {
            const data = await fetchListings(offset);
            const listings = data.results || [];

            if (!listings.length) {
                console.log('No more products found.');
                break;
            }

            for (const listing of listings) {
                await processListing(listing, context);
            }

            if (listings.length < PAGE_SIZE) {
                break;
            }
        } catch (error) {
            console.error(`Cashify page fetch failed: ${error.message}`);
            break;
        }
    }

    return { newProducts, priceDrops };
};

module.exports = {
    runScraper,
};
