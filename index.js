let app;
try {
    app = require('../server/server.js');
} catch (e) {
    try {
        app = require('../server.js');
    } catch (err) {
        console.error('Failed to load server app:', err);
    }
}

module.exports = app;
