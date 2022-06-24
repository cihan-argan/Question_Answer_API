const User = require('../../models/User');
const Question = require('../../models/Question');
const Answer = require('../../models/Answer');
const CustomError = require('../../helpers/error/CustomErrors');
const asyncErrorWrapper = require('express-async-handler');

const checkUserExist = asyncErrorWrapper(async (req, res, next) => {
	// /api/users/id şeklindeki route erişmeden önce ben bu middleware in çalışmasını istiyorum userexist mi değilmi kontrolünden sonra user controller çalışsın istiyorum.
	const { id } = req.params;
	const user = await User.findById(id);
	console.log(user);
	if (!user) {
		return next(new CustomError('There is no such user with that id ', 400)); //bu id ye sahip kullanıcı yok
	}
	next();
});
const checkQuestionExist = asyncErrorWrapper(async (req, res, next) => {
	//Ben burda Questiona göre sorgulama yapacağım için Question dahil etmemiz gerekecek.
	const question_id = req.params.id || req.params.question_id; //Hem id yi hemde question_id yi göderilirse alacak.
	/*Sana id gönderilmişse bu id miz gönderilmiş id olacak ancak id değilde question_id şeklinde  gönderilmişsede onu al dicem. */
	const question = await Question.findById(question_id); //Question ımız id ye göre bize döncek.
	//id ye göre bu question yok ise

	if (!question) {
		return next(new CustomError('There is no such question with that id', 400));
	}
	//eğer question var ise devam edecekç
	next();
});
const checkQuestionAndAnswerExist = asyncErrorWrapper(async (req, res, next) => {
	//Buraya hem question_id gelcek hemde answer_id gelecek Bizim bu question_idve answer idye göre sorgumuzu atmamız lazım eğer burda boş dönerse yani herhangi bir answer dönmezse bizim hatamızı fırlatmamız gerekiyor.QuestionExist mantığının aynısı aslında
	const question_id = req.params.question_id; //req.params içindeki question idyi alacağım
	const answer_id = req.params.answer_id; //idyi alıyorum
	const answer = await Answer.findOne({
		//// bu findOne tek bir answer dönmemizi sağlayacak.bunun içine bilgilerimizi gireceğiz.
		_id: answer_id, //id alanı answer id ye eşit olması lazım
		question: question_id // question alanıda question idye eşit olması lazım. diyerek findOne kullandık bu bilgiler sağlanmazsa boş gelecek .
	});
	if (!answer) {
		//eğer answer yoksa hata fırlatıyoruz
		return next(new CustomError('There is no answer with that id associated with question id', 400));
	}
	next();
});
module.exports = {
	checkUserExist, ///nerde kullanacağız routers içindeki herhangi bir yerde User  var mı yok mu diye control ettireceğimiz zaman kullanabiliriz.
	checkQuestionExist, // nerde kullanacağız routers içindeki herhangi bir yerde question var mı yok mu diye control ettireceğimiz zaman kullanabiliriz.
	checkQuestionAndAnswerExist
};
