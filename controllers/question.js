//controllers>question.js
const Question = require('../models/Question'); //İlk başta question modelini almamız gerekecek.
const CustomError = require('../helpers/error/CustomErrors'); //CıstomError alınacak
const asyncErrorWrapper = require('express-async-handler'); //asyncErrorWrapper alınacak

const getAllQuetions = asyncErrorWrapper(async (req, res, next) => {
	let query = Question.find(); //default querymiz
	const populate = true;
	const populateObject = {
		path: 'user',
		select: 'name profile_image'
	};
	//Search
	if (req.query.search) {
		const searchObject = {};
		const regex = new RegExp(req.query.search, 'i');
		searchObject['title'] = regex;
		query = query.where(searchObject);
		//Question.find().where({title : regex}); yeni querimiz oldu
	}
	//Populate
	if (populate) {
		query = query.populate(populateObject);
	}

	//pagination
	const page = parseInt(req.query.page) || 1; // page varsa onu al or diyoruz yoksa default olarak 1 i al diyoruz
	const limit = parseInt(req.query.limit) || 5; //Kullanıcı belli sayıda limitleme yaptırabilir eğer limit vermezsede or diyerek 5 tane getir diyoruz.
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	//1 2 3 4 5 6 7 8 9 10 - bizim 10 tane değerimiz var
	//page = 1 , limit= 5 olsun startIndex = 0 , endIndex = 5 olacak  yani ilk sayfada 1 2 3 4 5 gösterilecek startIndexin 0 olduğu durumda bizim önceki sayfanın gösterilmiyor olması gerekecek ilk başta bunu kontrol edicez.endIndeximizde burda toplam sayodan küçük olduğu için sonraki sayfamız var demektir bu yüzden sonraki sayfayıda bir obje şeklinde döndürmemiz gerekiyor.
	//page = 2 olursa startIndex=5 endIndex= 10  olacak 6,7,8,9,10 sergilenecek  endIndex 10 olduğu için bir sonraki sayfamızın olması için endIndeximizin total sayıdan küüçük olması gerekiyor bu durum sağlanmadığı için sonraki sayfamız olmayacak bunları kontrol etemmiz gerekiyor
	const pagination = {};
	const total = await Question.countDocuments(); //Question collections içinde kaçtane soru olduğunu verecek.
	//Önceki sayfa olup olmama durumunu kontrolü startIndex 0 ise zaten önceki sayfa yok demektir.sıfırdan büyükse var demektir.
	if (startIndex > 0) {
		//startIndex 0 dan büyükse önceki sayfamız var demektir.pagenation içine önceki sayfanın bilgisini yazmam gerekecek
		pagination.previous = {
			page: page - 1, // önceki sayfanın page değeri şuanki sayfanın page değerinden 1 eksik olacak
			limit: limit // limit değeride değişmeyeceği için aynı şekilde vermiş olacağım
		};
	}
	//Son sayfada olup olmama durumu kontrolü endIndex totalden küçük değilse son sayfadasın demektir.sonraki sayfa olmayacak.
	if (endIndex < total) {
		//Bir sonraki sayfanın bilgisini vermem gerekecek.
		pagination.next = {
			page: page + 1, //sonraki sayffanın page değeri şuankinin 1 fazlası olacak
			limit: limit // limit değeride yine aynı olacak.
		};
	}
	query = query.skip(startIndex).limit(limit); // skip(atlayacağı index sayısı ).limit(kaç tane kayıt getirecek)
	const questions = await query;
	return res.status(200).json({
		success: true,
		count: questions.length, //Oanda kaçtane değer varsa o gösterilsin
		pagination: pagination, //hangi sayfada olduğumuzu ve öncesi sonrası varmı bunları gösterebilirzi.
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
const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {
	const { id } = req.params;
	const question = await Question.findById(id);
	return res.status(200).json({
		success: true,
		data: question
	});
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
	//daha sonra güncellemiş bu soruyu veri tabanına yazmamız gerekiyor.
	const likesLength = await question.likes.length;
	await question.save();
	return res.status(200).json({
		success: true,
		data: question,
		numberOfLikes: likesLength
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
	const likesLength = await question.likes.length;
	await question.save();
	return res.status(200).json({
		success: true,
		data: question,
		numberOfLikes: likesLength
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
