//Routers>Question.js
// /api/questions/
const express = require('express');
const router = express.Router();
const { getAllQuetions,askNewQuestion, } = require('../controllers/question');
const { getAccessToRoute } = require('../middlewares/authorization/auth');
// /api/questions a gittiğimizde bu public bir işlem olacağı için getAccessToRoute olmayacak
router.get('/',getAllQuetions);

router.post('/ask', getAccessToRoute, askNewQuestion);

//kullanabilmek için
module.exports = router;
