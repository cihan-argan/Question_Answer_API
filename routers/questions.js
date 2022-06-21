//Routers>Question.js
// /api/questions/
const express = require('express');
const router = express.Router();
const { getAllQuetions, askNewQuestion, getSingleQuestion } = require('../controllers/question');
const { getAccessToRoute } = require('../middlewares/authorization/auth');
const { checkQuestionExist } = require('../middlewares/database/databaseErrorHandler');

// /api/questions a gittiğimizde bu public bir işlem olacağı için getAccessToRoute olmayacak
router.get('/', getAllQuetions); //Tüm soruları getir
router.get('/:id', checkQuestionExist, getSingleQuestion); //tek bir soruyu getirmek için

router.post('/ask', getAccessToRoute, askNewQuestion);

//kullanabilmek için
module.exports = router;
