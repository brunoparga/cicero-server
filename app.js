const app = require('./server');
const routes = require('./routes');

const sequelize = require('./db');
const User = require('./models/User');
const Word = require('./models/Word');

app.use(routes);

User.belongsToMany(Word, { through: 'user-words' });
Word.belongsToMany(User, { through: 'user-words' });

sequelize
  .sync()
  .then(app.listen(process.env.PORT || 3001));
