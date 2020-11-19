const wordRouter = require('express').Router();
const { getWordsReview, postWords } = require('../controllers/words');

wordRouter.get('/words/review', getWordsReview);
wordRouter.post('/words', postWords);

module.exports = wordRouter;
