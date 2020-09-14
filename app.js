const app = require('./server');
const Word = require('./models/word');

app.get('/words', async (_, res) => {
  const words = await Word.fetch();
  res.json(words);
});

app.listen(process.env.PORT || 3001);
