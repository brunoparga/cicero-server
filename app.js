const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors({ origin: 'http://localhost:3002' }));

app.get('/words', async (_, res) => {
  const words = await fetch('http://localhost:3000/words').then((res) => res.json())
  console.log(words)
  res.json(words)
});

app.listen(3001);