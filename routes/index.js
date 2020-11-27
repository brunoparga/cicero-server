"use strict";

const express = require("express");

const userRouter = require("./users");
const wordRouter = require("./words");

const router = new express.Router();

router.use(userRouter);
router.use(wordRouter);

module.exports = router;
