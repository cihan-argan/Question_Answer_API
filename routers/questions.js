//Routers>Question.js
// /api/questions/
const express = require('express');
const router = express.Router();
const { getAllQuetions, askNewQuestion, getSingleQuestion,editQuestion,deleteQuestion } = require('../controllers/question');
const { getAccessToRoute,getQuestionOwnerAccess} = require('../middlewares/authorization/auth');

const { checkQuestionExist } = require('../middlewares/database/databaseErrorHandler');

// /api/questions a gittiğimizde bu public bir işlem olacağı için getAccessToRoute olmayacak
router.get('/', getAllQuetions); //Tüm soruları getir
router.get('/:id', checkQuestionExist, getSingleQuestion); //tek bir soruyu getirmek için
router.post('/ask', getAccessToRoute, askNewQuestion);//Soru ekleme 
router.put("/:id/edit",[getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],editQuestion);
/*put request işlemi yapılacak edit işlemi yapılacağı için 
1-getAccessToRoute ile kullanıcının giriş yapıp yapmadığını kontrol edicez ilk o çalışacak
2-checkQuestionExist ile girilen id de soru mevcut mu ona bakıcaz 
3-getQuestionOwnerAccess ile ilgili kullanıcı ilgili soruya mı ulaşmaya çalışıyor o kontrolü yapıcaz.
4-controller/question.js içinde çalıaşacak editQuestion fonksiyonunu yazıcaz. */
router.delete("/:id/delete",[getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],deleteQuestion);


//kullanabilmek için
module.exports = router;
