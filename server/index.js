const express = require('express');
// Request-related packages
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
// Response-related packages
const helmet = require('helmet');
const compression = require('compression');

const app = express();
app.use(cors({
  origin: process.env.FRONT_END_URL,
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
}));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

module.exports = app;
