"use strict";

const app = require("./server");
const config = require("./config");
const routes = require("./routes");
const { sequelize } = require("./models");

app.use(routes);

const developmentPort = 3001;

sequelize
  .sync()
  .then(app.listen(config.PORT || developmentPort))
  .catch(() => {
    "Don't catch errors for now.";
  });
