const app = require('./server');
const routes = require('./routes');

app.use(routes)

app.listen(process.env.PORT || 3001);
