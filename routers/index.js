const express = require('express');
const question = require('./questions');
const auth = require('./auth');
// /api yazıldığında direkt bu file a gelecek
const router = express.Router();

// /api/questions
router.use('/questions', question);
// /api/auth
router.use('/auth', auth);

module.exports = router;
