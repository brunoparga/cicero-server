require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
app.use(cors({ origin: process.env.FRONT_END_URL }));
app.use(helmet());
app.use(compression());

module.exports = app;
