//const { query } = require('express');

const searchHelper = (searchKey, query, req) => {
	if (req.query.search) {
		const searchObject = {};
		const regex = new RegExp(req.query.search, 'i');
		searchObject[searchKey] = regex;
		return query.where(searchObject);
		//Question.find().where({title : regex}); yeni querimiz oldu
	}
	return query;
};

const populateHelper = (query, population) => {
	//Query miz gelecek ve population objemiz gelecek
	return query.populate(population);
};
const questionSortHelper = (query, req) => {
	//Query miz gelecek ve requestimiz gelecek
	//Sort = req.query.sortBy most-answered / most-liked
	const sortKey = req.query.sortBy;

	if (sortKey === 'most-answered') {
		//query = query.sort("answerCount") dersek küçükten büyüğe doğru yani answer ı az olandan çok olana doğru sıralar
		return query.sort('-answerCount'); // Büyükten küçüğe doğru
	}
	if (sortKey === 'most-liked') {
		//query = query.sort("likeCount") dersek küçükten büyüğe doğru sıralar. like ı az olandan çok olana doğru
		return query.sort('-likeCount '); // Büyükten küçüğe doğru
	}
	return query.sort('-createdAt');
};

//Not:ANSWERS  arrayinde işlem yapacağımız için burda model gönderemeyeceğiz bunun için bir güncelleme işlemi yapmamız gerekecek
const paginationHelper = async (totalDocuments, query, req) => {
	//Model query ve request gönderilecek.
	//pagination

	const page = parseInt(req.query.page) || 1; // page varsa onu al or diyoruz yoksa default olarak 1 i al diyoruz
	const limit = parseInt(req.query.limit) || 5; //Kullanıcı belli sayıda limitleme yaptırabilir eğer limit vermezsede or diyerek 5 tane getir diyoruz.

	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	//1 2 3 4 5 6 7 8 9 10 - bizim 10 tane değerimiz var
	//page = 1 , limit= 5 olsun startIndex = 0 , endIndex = 5 olacak  yani ilk sayfada 1 2 3 4 5 gösterilecek startIndexin 0 olduğu durumda bizim önceki sayfanın gösterilmiyor olması gerekecek ilk başta bunu kontrol edicez.endIndeximizde burda toplam sayodan küçük olduğu için sonraki sayfamız var demektir bu yüzden sonraki sayfayıda bir obje şeklinde döndürmemiz gerekiyor.
	//page = 2 olursa startIndex=5 endIndex= 10  olacak 6,7,8,9,10 sergilenecek  endIndex 10 olduğu için bir sonraki sayfamızın olması için endIndeximizin total sayıdan küüçük olması gerekiyor bu durum sağlanmadığı için sonraki sayfamız olmayacak bunları kontrol etemmiz gerekiyor
	const pagination = {};
	const total = totalDocuments; //Question collections içinde kaçtane soru olduğunu verecek.

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
	if (query === undefined) {
		return {
			//querymiz undefined ise undefined dön eğer bir query dönüyorsa bunuda query.skip(startIndex).limit(limit) ile dön diyeceğiz
			query: undefined, // skip(atlayacağı index sayısı ).limit(kaç tane kayıt getirecek)
			pagination: pagination,
			startIndex,
			limit
		};
	} else {
		return {
			//querymiz undefined ise undefined dön eğer bir query dönüyorsa bunuda query.skip(startIndex).limit(limit) ile dön diyeceğiz
			query: query.skip(startIndex).limit(limit), // skip(atlayacağı index sayısı ).limit(kaç tane kayıt getirecek)
			pagination: pagination
		};
	}
};
module.exports = {
	searchHelper,
	populateHelper,
	questionSortHelper,
	paginationHelper
};
