"use strict";

const express = require("express");

const userRouter = new express.Router();

const { signin, signup } = require("../controllers/users");

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);

module.exports = userRouter;
