const express = require('express');
const { getAccessToRoute, getAnswerOwnerAccess } = require('../middlewares/authorization/auth');
const { checkQuestionAndAnswerExist } = require('../middlewares/database/databaseErrorHandler');

const { addNewAnswerToQuestion, getAllAnswersByQuestion, getSingleAnswer,editAnswer } = require('../controllers/answer');
const router = express.Router({ mergeParams: true });

//Requestler
router.post('/', getAccessToRoute, addNewAnswerToQuestion);
router.get('/', getAllAnswersByQuestion);
router.get('/:answer_id', checkQuestionAndAnswerExist, getSingleAnswer);
router.put('/:answer_id/edit', [ checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess ], editAnswer);//edit işlemi put req

module.exports = router;
