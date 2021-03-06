//controllers>question.js
const Question = require('../models/Question'); //İlk başta question modelini almamız gerekecek.
const CustomError = require('../helpers/error/CustomErrors'); //CıstomError alınacak
const asyncErrorWrapper = require('express-async-handler'); //asyncErrorWrapper alınacak

const getAllQuetions = asyncErrorWrapper(async (req, res, next) => {
	return res.status(200).json(res.queryResults);
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
const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {
	return res.status(200).json(res.queryResults);
});
const editQuestion = asyncErrorWrapper(async (req, res, next) => {
	const { id } = req.params; //req.params içinden id yi aldık
	const { title, content } = req.body; //req.body içinden yeni title ve yeni contenti aldık
	let question = await Question.findById(id); //let ile almamızın sebebi questionımızın daha sonra değişecek olması diyerek şuanki questionımızı aldık.
	question.title = title; // güncellenmemiş sorumuzun title ını güncelledik
	question.content = content; //güncellenmemiş sorumuzun contentini güncelledik.
	this.question = await question.save(); //editlenmiş questionımız buraya gelecek ve save edilerek veri tabanına yazdık.ve bize güncellenmiş sorumuz geldi.
	return res.status(200).json({
		success: true,
		data: question
	});
});
const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
	const { id } = req.params;
	await Question.findByIdAndDelete(id); //burda post hook işlemi olmayacak id ye göre bul ve sil demek yeterli
	return res.status(200).json({
		success: true,
		message: 'Question delete operation successfull '
	});
});
const likeQuestion = asyncErrorWrapper(async (req, res, next) => {
	// ilk olarak questionımızı almamız gerekiyor.
	const { id } = req.params;
	const question = await Question.findById(id);
	//Giriş yapmış kullanıcı bu soruya like etmişse
	if (question.likes.includes(req.user.id)) {
		return next(new CustomError('You already likes this question', 400));
	}
	//giriş yapılan kullanıcının id si bu sorudaki likes arrayinde mevcut değil ise arraye bu kullanıcıyı ekliyoruz.
	question.likes.push(req.user.id);
	question.likeCount = question.likes.length;
	//daha sonra güncellemiş bu soruyu veri tabanına yazmamız gerekiyor.
	await question.save();
	return res.status(200).json({
		success: true,
		data: question
	});
});
const undoLikeQuestion = asyncErrorWrapper(async (req, res, next) => {
	const { id } = req.params;
	const question = await Question.findById(id);

	//Bu id li kullanıcı gerçekten sorumuzu like etmişmmi etmemiş mi bunu kontrol edicez.etmemişse burda hata vermemiz gerekecek.
	if (!question.likes.includes(req.user.id)) {
		//Burda zaten kullanıcımız like etmemiş demektir. hata fırlatacağız.
		return next(new CustomError('You can not undo like opreation for this question ', 400));
	}
	//Kontrolü geçmişse kullanıcı like etmiş demektir.Kullanıcının idsininin indexini  likes array içinde bulmamız gerekecek
	const index = question.likes.indexOf(req.user.id);
	question.likes.splice(index, 1);
	question.likeCount = question.likes.length;
	await question.save();
	return res.status(200).json({
		success: true,
		data: question
	});
});

module.exports = {
	getAllQuetions,
	askNewQuestion,
	getSingleQuestion,
	editQuestion,
	deleteQuestion,
	likeQuestion,
	undoLikeQuestion
};
