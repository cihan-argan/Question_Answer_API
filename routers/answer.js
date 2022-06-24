const express = require('express');
const { getAccessToRoute } = require('../middlewares/authorization/auth');
const {checkQuestionAndAnswerExist}= require("../middlewares/database/databaseErrorHandler");

const { addNewAnswerToQuestion, getAllAnswersByQuestion,getSingleAnswer } = require('../controllers/answer');
const router = express.Router({ mergeParams: true });

//Requestler
router.post('/', getAccessToRoute, addNewAnswerToQuestion);
router.get('/', getAllAnswersByQuestion);
router.get('/:answer_id',checkQuestionAndAnswerExist,getSingleAnswer);

module.exports = router;
