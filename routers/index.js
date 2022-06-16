const express = require('express');
const question = require('./questions');
const auth = require('./auth');
const user =require("./user");
// /api yazıldığında direkt bu file a gelecek
const router = express.Router();

// /api/questions
router.use('/questions', question);
// /api/auth
router.use('/auth', auth);
router.use("/users",user);


module.exports = router;
