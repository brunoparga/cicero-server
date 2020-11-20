const app = require('./server');
const routes = require('./routes');
const { sequelize } = require('./models');

app.use(routes);

sequelize
  .sync()
  .then(app.listen(process.env.PORT || 3001));
