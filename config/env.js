const path = require('path');

// load the project's .env regardless of the directory node is started from
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });
