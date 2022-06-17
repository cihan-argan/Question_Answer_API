const express = require('express');
const router = express.Router();
const question = require('./questions');
const auth = require('./auth');
const user = require('./user');
const admin = require('./admin'); //admini dahil ettik
// /api yazıldığında direkt bu file a gelecek

// /api/questions
router.use('/questions', question);
// /api/auth
router.use('/auth', auth);
router.use('/users', user);
router.use('/admin', admin); //admini kullandık

module.exports = router;
