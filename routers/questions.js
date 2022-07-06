//Routers>Question.js
// /api/questions/
const express = require('express');
//Answer Route Burda alıyoruz çünkü Question ile çok sıkı ilişkide olan bir yapı olduğu için
const answer = require('./answer');
const Question = require('../models/Question');

const router = express.Router();
const {
	getAllQuetions,
	askNewQuestion,
	getSingleQuestion,
	editQuestion,
	deleteQuestion,
	likeQuestion,
	undoLikeQuestion
} = require('../controllers/question');

const questionQueryMiddleware = require('../middlewares/query/questionQueryMiddleware');
const answerQueryMiddleware = require('../middlewares/query/answerQueryMiddleware');

const { getAccessToRoute, getQuestionOwnerAccess } = require('../middlewares/authorization/auth');
const { checkQuestionExist } = require('../middlewares/database/databaseErrorHandler');

// /api/questions a gittiğimizde bu public bir işlem olacağı için getAccessToRoute olmayacak
router.get(
	'/',
	questionQueryMiddleware(Question, {
		population: {
			path: 'user',
			select: 'name profile_image'
		}
	}),
	getAllQuetions
); //Tüm soruları getir
router.get(
	'/:id',
	checkQuestionExist,
	answerQueryMiddleware(Question, {
		//Eğer biz bir kactane alanı populate edeceksek array şeklinde kullanmalıyız.
		population: [
			{
				//1.populate alanı = questionın userını populate edeceğiz.
				path: 'user',
				select: 'name profile_image'
			},
			{
				//2.populate alanı : answers larıda populate edicez
				path: 'answers',
				select: 'content'
			}
		]
	}),
	getSingleQuestion
); //tek bir soruyu getirmek için
router.get('/:id/like', [ getAccessToRoute, checkQuestionExist ], likeQuestion);
router.get('/:id/undo_like', [ getAccessToRoute, checkQuestionExist ], undoLikeQuestion);

router.post('/ask', getAccessToRoute, askNewQuestion); //Soru ekleme
router.put('/:id/edit', [ getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess ], editQuestion);
/*put request işlemi yapılacak edit işlemi yapılacağı için 
1-getAccessToRoute ile kullanıcının giriş yapıp yapmadığını kontrol edicez ilk o çalışacak
2-checkQuestionExist ile girilen id de soru mevcut mu ona bakıcaz 
3-getQuestionOwnerAccess ile ilgili kullanıcı ilgili soruya mı ulaşmaya çalışıyor o kontrolü yapıcaz.
4-controller/question.js içinde çalıaşacak editQuestion fonksiyonunu yazıcaz. */
router.delete('/:id/delete', [ getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess ], deleteQuestion);

//Answer Route
router.use('/:question_id/answers', checkQuestionExist, answer);
// api/12354(quesiton_id) / answers gelirse bizim routers/answer.js içindeki yazdığımız get post requestler çalışabilecek.
//kullanabilmek için
module.exports = router;
