const { runScraper } = require('./scraper/productScraper');

const INTERVAL_MS = 15 * 60 * 1000;

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error.message);
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ms left in the 1AM-7AM sleep window, 0 outside it
const sleepWindowMs = (now = new Date()) =>
    now.getHours() >= 1 && now.getHours() < 7 ? new Date(now).setHours(7, 0, 0, 0) - now : 0;

const runLoop = async () => {
    if (sleepWindowMs()) {
        console.log(`Sleep mode until 7AM... ${new Date().toISOString()}`);
        await delay(sleepWindowMs());
    }

    try {
        const { newProducts, priceDrops } = await runScraper();
        console.log(`Cashify Laptops: ${newProducts.length} new, ${priceDrops.length} price drops`);
    } catch (error) {
        console.error('Failed to scrape Cashify laptops:', error.message);
    }

    console.log(
        `Sleeping ${INTERVAL_MS / 60000} minutes before next run... ${new Date().toISOString()}\n`,
    );
    await delay(INTERVAL_MS);
    await runLoop();
};

runLoop();
