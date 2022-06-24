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
module.exports = {
	addNewAnswerToQuestion,
	getAllAnswersByQuestion,
	getSingleAnswer
};
