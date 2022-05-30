//Routers>Question.js
const express = require('express');
const { getAllQuestions}=require('../controllers/question');
// /api/questions
const router = express.Router();

router.get("/", getAllQuestions);

//kullanabilmek için
module.exports = router;
