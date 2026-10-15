const PRODUCT_FIELDS = ['productId', 'title', 'link', 'salePrice'];

const hasAllFields = (data, fields = PRODUCT_FIELDS) =>
    fields.every((field) => data[field] !== undefined && data[field] !== null && data[field] !== '');

const buildLink = (slug) => {
    if (!slug) {
        return null;
    }
    return `https://www.cashify.in${slug.startsWith('/') ? slug : `/${slug}`}`;
};

const formatProduct = (product) => {
    const formatted = {
        productId: String(product.id ?? ''),
        title: product.product_name?.trim(),
        brand: product.brand,
        link: buildLink(product.slug),
        mrp: product.mrp,
        price: product.price,
        salePrice: product.sale_price,
        effectivePrice: product.effective_price,
        ram: (product.ram || []).join(', '),
        storage: (product.storage || []).join(', '),
        availability: product.availability,
        availableQuantity: product.available_quantity,
        source: 'cashify',
    };

    if (!hasAllFields(formatted)) {
        return null;
    }

    return formatted;
};

module.exports = {
    formatProduct,
};
