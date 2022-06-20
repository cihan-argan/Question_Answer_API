//controllers>question.js
const Question = require('../models/Question'); //İlk başta question modelini almamız gerekecek.
const CustomError = require('../helpers/error/CustomErrors'); //CıstomError alınacak
const asyncErrorWrapper = require('express-async-handler'); //asyncErrorWrapper alınacak

const getAllQuetions = asyncErrorWrapper(async (req, res, next) => {
	const questions = await Question.find(); //Tüm Questionları çekmeye çalışıyorum
	return res.status(200).json({
		success: true,
		data: questions
	});
});

const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {
	//biz request.Bodyden information ımızı alacağız.birde User Id yi buraya ekleyerek yeni bir questionı oluşturmaya çalışacağız.
	const information = req.body;
	console.log(information);
	const question = await Question.create({
		//eğer soru oluşturulmuşsa Question.create diyerek oluşturuyoruz.
		...information, // post verisinden gelen information ı alacağız.
		//title: information.title,
		//content:information.content

		//2.olarak Object modelimizde zorunlu olan Object Id yi koymamız gerekiyor.
		user: req.user.id
	});
	res.status(200).json({
		success: true,
		data: question
	});
});

module.exports = { getAllQuetions, askNewQuestion };
