require('./env');

const NOTIFICATION_URL = process.env.NOTIFICATION_URL || 'http://localhost:3006/notifications';
const NOTIFICATION_AUTH_TOKEN = process.env.NOTIFICATION_AUTH_TOKEN;
const splitCsv = (value = '') =>
    value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

// comma separated: system, email, slack, whatsapp, sms
const NOTIFICATION_CHANNELS = splitCsv(process.env.NOTIFICATION_CHANNELS || 'system');
// comma separated email addresses
const NOTIFICATION_EMAIL_TO = splitCsv(process.env.NOTIFICATION_EMAIL_TO);

module.exports = {
    NOTIFICATION_URL,
    NOTIFICATION_AUTH_TOKEN,
    NOTIFICATION_CHANNELS,
    NOTIFICATION_EMAIL_TO,
};
