const API_BASE_URL =
    'https://www.cashify.in/api/omni01/product/catalogue/tsk/list/search/results';
const PAGE_SIZE = 20;
const PAGE_DELAY_MS = 3000;
const MAX_PAGES = 20;

const API_HEADERS = {
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json',
    origin: 'https://www.cashify.in',
    referer: 'https://www.cashify.in/',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36',
};

const SEARCH_FILTERS = {
    product_type: [{ name: 'product_type', value: 'Laptop' }],
    availability: [{ name: 'availability', value: 'In Stock' }],
    brand: [
        { name: 'brand', value: 'HP' },
        { name: 'brand', value: 'Samsung' },
        { name: 'brand', value: 'Lenovo' },
        { name: 'brand', value: 'Asus' },
        { name: 'brand', value: 'Vivo' },
        { name: 'brand', value: 'Dell' },
        { name: 'brand', value: 'Xiaomi' },
        { name: 'brand', value: 'Realme' },
        { name: 'brand', value: 'Infinix' },
        { name: 'brand', value: 'Acer' },
        { name: 'brand', value: 'AVITA' },
        { name: 'brand', value: 'Redmi' },
    ],
    ram: [
        { value: '16 GB', count: 53 },
        { value: '12 GB', count: 13 },
    ],
};

const SORT_FIELD = { sale_price: 'asc' };

// listings whose title contains any of these (case-insensitive) are skipped, e.g. ['Touch Screen', 'i3']
const IGNORED_TITLE_KEYWORDS = ['Core i5', 'Core i3', '7th Gen', '8th Gen', '9th Gen', 'touch'];

// listings are kept only if the field contains at least one of its keywords (case-insensitive); empty = no check
const REQUIRED_KEYWORDS = {
    ram: ['16 GB', '32 GB'],
    storage: ['512 GB SSD', '256 GB SSD'],
};

module.exports = {
    API_BASE_URL,
    PAGE_SIZE,
    PAGE_DELAY_MS,
    MAX_PAGES,
    API_HEADERS,
    SEARCH_FILTERS,
    SORT_FIELD,
    IGNORED_TITLE_KEYWORDS,
    REQUIRED_KEYWORDS,
};
