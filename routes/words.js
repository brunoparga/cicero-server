const wordRouter = require('express').Router();
const { getWordsLearn, getWordsReview, postWords } = require('../controllers/words');
const isAuth = require('../middleware/isAuth');

wordRouter.use('/words', isAuth);
wordRouter.get('/words/learn', getWordsLearn);
wordRouter.get('/words/review', getWordsReview);
wordRouter.post('/words', postWords);

module.exports = wordRouter;
