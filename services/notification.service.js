const {
    NOTIFICATION_URL,
    NOTIFICATION_AUTH_TOKEN,
    NOTIFICATION_CHANNELS,
    NOTIFICATION_EMAIL_TO,
} = require('../config/notification.config');

const postNotification = async (body) => {
    const response = await fetch(NOTIFICATION_URL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'auth-token': NOTIFICATION_AUTH_TOKEN,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Notification API failed (${response.status}): ${await response.text()}`);
    }
};

// one email request per recipient so they don't see each other; other channels share a single request
const notify = async (title, message) => {
    if (!NOTIFICATION_AUTH_TOKEN) {
        console.warn('NOTIFICATION_AUTH_TOKEN not set, skipping notification');
        return;
    }

    const requests = NOTIFICATION_CHANNELS.includes('email')
        ? NOTIFICATION_EMAIL_TO.map((to) => ({ channel: ['email'], to }))
        : [];
    const otherChannels = NOTIFICATION_CHANNELS.filter((channel) => channel !== 'email');
    if (otherChannels.length) {
        requests.push({ channel: otherChannels });
    }

    const results = await Promise.allSettled(requests.map((request) => postNotification({ title, message, ...request })));
    results
        .filter(({ status }) => status === 'rejected')
        .forEach(({ reason }) => console.error('Failed to send notification:', reason.message));
};

module.exports = {
    notify,
};
