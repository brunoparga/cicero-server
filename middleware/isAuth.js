"use strict";

const jwt = require("jsonwebtoken");

const config = require("../config");

module.exports = (request, response, next) => {
  const token = request.get("Authorization").split(" ")[1] || "";

  let decodedToken;

  if (token) {
    decodedToken = jwt.verify(token, config.TOKEN_SIGNING_SECRET);
  }

  const newRequest = request;

  newRequest.userId = decodedToken.id;
  next();
};
