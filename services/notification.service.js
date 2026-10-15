const {
    NOTIFICATION_URL,
    NOTIFICATION_AUTH_TOKEN,
    NOTIFICATION_CHANNELS,
    NOTIFICATION_EMAIL_TO,
} = require('../config/notification.config');

const sendNotification = async ({ title, message }) => {
    if (!NOTIFICATION_AUTH_TOKEN) {
        console.warn('NOTIFICATION_AUTH_TOKEN not set, skipping notification');
        return null;
    }

    const response = await fetch(NOTIFICATION_URL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'auth-token': NOTIFICATION_AUTH_TOKEN,
        },
        body: JSON.stringify({
            title,
            message,
            channel: NOTIFICATION_CHANNELS,
            to: NOTIFICATION_EMAIL_TO,
        }),
    });

    if (!response.ok) {
        throw new Error(`Notification API failed (${response.status}): ${await response.text()}`);
    }

    return response.json();
};

const notify = async (title, message) => {
    try {
        await sendNotification({ title, message });
    } catch (error) {
        console.error('Failed to send notification:', error.message);
    }
};

module.exports = {
    notify,
};
