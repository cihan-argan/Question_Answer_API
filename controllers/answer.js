const Question = require('../models/Question');
const Answer = require('../models/Answer');
const CustomError = require('../helpers/error/CustomErrors'); //CıstomError alınacak
const asyncErrorWrapper = require('express-async-handler'); //asyncErrorWrapper alınacak

const addNewAnswerToQuestion = asyncErrorWrapper(async (req, res, next) => {
	/* burda yapacağımız işlem iki adet birincisi Answer ımızı model olarak eklemek ikincisi ise oluşan answerımızın idsini question model içindeki answer alanına eklemek. Burda diğerlerinden farklı işlem yapılacak.  */
	const { question_id } = req.params; //question id aldık
	const user_id = req.user.id; //answers model içinde users alanıda mevcut.answer ı kim ekledi ise ..

	//post request olacağı için bizim bazı verilerimiz gelecek bu verileri diğer kısımlarda da yaptığımız gibi alacağız
	const information = req.body;

	const answer = await Answer.create({
		/* burda istersen
         content : information.content şeklinde atama yapabilirsin yada spread operatörü kullanabiliriz
        */
		...information, // content otomatik olarak eklenecek createdAt otomatik oluşacak, likes şuan verilmediği için olmicak user ve question kısmını altta atadık.
		question: question_id, // Question hangisi ise onun idsini ekledik
		user: user_id //user kimse onun idsini ekledik.
	});
	//yukarıda answer oluşacak fakat oluştuktan sonra answerin id sini ilgili questionın answers kısmına eklemem gerekecek Bunuda answer model içinde yapıcaz.pre hooks ile gerçekleştirebiliriz.
	return res.status(200).json({
		success: true,
		data: answer
	});
});
const getAllAnswersByQuestion = asyncErrorWrapper(async (req, res, next) => {
	//Mantığımız : question id yi alacağız bu question id ye göre buna ait tüm cevapları alacağız.
	const { question_id } = req.params;
	const question = await Question.findById(question_id).populate('answers'); // questionımızın answers kısmındaki idler dışında tüm veriler gelecek. Yani content createdAt vs vs .
	//Bu question içinde de bildiğimiz answers adında arrayimiz var bu answersları da bir değişkene alalım
	const answers = question.answers;

	return res.status(200).json({
		success: true,
		count: answers.length,
		data: answers
	});
});
const getSingleAnswer = asyncErrorWrapper(async (req, res, next) => {
	const { answer_id } = req.params;
	const answer = await Answer.findById(answer_id)
		.populate({
			path: 'question',
			select: 'title'
		})
		.populate({
			path: 'user',
			select: 'name profile_image email'
		});

	return res.status(200).json({
		success: true,
		data: answer
	});
});
const editAnswer = asyncErrorWrapper(async (req, res, next) => {
	//ilk başta answer id yi alıp answerımızı getirmemiz gerekecek
	const { answer_id } = req.params;
	//daha sonra yeni gelen contentimizide req.bodyden almamız gerekcek
	const { content } = req.body;

	//şimdi answerı alacağız güncelleme olacağı için let ile almam gerekekcek
	let answer = await Answer.findById(answer_id);
	answer.content = content;

	await answer.save();

	return res.status(200).json({
		success: true,
		data: answer
	});
});
const deleteAnswer = asyncErrorWrapper(async (req, res, next) => {
	//delete işlemi gerçekleştiren fonksiyon.Biz questionlarda hem diziden hemde collectiondan kaldırma işlemini post hooks ile yapmıştık Bknz:models/user.js  burda soruları user model içindeki question arrayinden kaldırmıştık farklı bir yöntem öğreneceğiz.Tüm işlemlerimiz burda gerçekleştireceğiz.
	//ilk olarak answer_id yi aldık bize birde question id gelecek onuda alıyoruz.
	const { answer_id } = req.params;
	const { question_id } = req.params;
	await Answer.findByIdAndRemove(answer_id); //Bunu kaldırdık
	const question = await Question.findById(question_id); //sorumuzu idye göre bulduk
	question.answers.splice(question.answers.indexOf(answer_id), 1);
	question.answerCount = question.answers.length;
	await question.save();
	return res.status(200).json({
		success: true,
		message: 'Answer deleted successfully..'
	});
});
const likeAnswer = asyncErrorWrapper(async (req, res, next) => {
	//Like Answer da ilk başta answer_id mizi alacağız.
	const { answer_id } = req.params;
	//Daha sonra bu id ile answerımızı bulucaz
	const answer = await Answer.findById(answer_id);
	//daha sonra answerın likes ının içinde eğer zaten like atmaya çalışan userın idsi varsa hata yollicaz bunu includes ile kontrol edicez
	if (answer.likes.includes(req.user.id)) {
		return next(new CustomError('You already liked this answer ', 400));
	}
	//Eğer o like atmaya çalışan kullanıcı daha önce like atmamış ise o kullanıcıyı answer modelinin likes arrayine ekleyeceğiz.
	answer.likes.push(req.user.id);
	answer.likeCount = answer.likes.length;
	//tekrardan answerımızı kayıt edicez.
	await answer.save();
	return res.status(200).json({
		success: true,
		data: answer
	});
});
const undoLikeAnswer = asyncErrorWrapper(async (req, res, next) => {
	//undolike Answer içinde aynı şekilde answer idmizi alıcaz.
	const { answer_id } = req.params;
	const answer = await Answer.findById(answer_id);
	//Like ını kaldırmaya çalışan kullanıcı ilgili cevapta like ı yoksa likeını kaldıramayacak bunun için kontrolümüzü yapıyoruz içermiyorsa  dislike atamazsın hatası vereceğiz.
	if (!answer.likes.includes(req.user.id)) {
		return next(new CustomError('You can not undo like operation for this answer', 400));
	}
	//eğer bu adım bu soruda bir likeı varsa bu ife girmeyecek ve bizim bu adamın likes dizisindeki idsinin bulunduğu indexi bulmamız gerekecek.
	const index = await answer.likes.indexOf(req.params.answer_id);
	answer.likes.splice(index, 1);
	answer.likeCount = answer.likes.length;

	await answer.save();
	return res.status(200).json({
		success: true,
		data: answer
	});
});
module.exports = {
	addNewAnswerToQuestion,
	getAllAnswersByQuestion,
	getSingleAnswer,
	editAnswer,
	deleteAnswer,
	likeAnswer,
	undoLikeAnswer
};
