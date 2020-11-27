"use strict";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");

const config = require("../config");

const app = express();

app.use(
  cors({
    origin: config.FRONT_END_URL,
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

module.exports = app;
