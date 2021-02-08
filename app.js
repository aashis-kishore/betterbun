const express = require('express');

// Betterbun is born
const app = express();

// Test route, to be modified or removed.
app.get('/', (req, res) => res.send('Hello, Things look good'));

module.exports = app;
