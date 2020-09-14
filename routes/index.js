const router = require('express').Router();

const userRouter = require('./users');
const wordRouter = require('./words');

router.use(userRouter);
router.use(wordRouter);

module.exports = router;
