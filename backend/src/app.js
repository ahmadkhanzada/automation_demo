const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth');
const itemsRoutes = require('./items');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/', authRoutes);
app.use('/', itemsRoutes);

module.exports = app;
