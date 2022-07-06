const asyncErrorWrapper = require('express-async-handler');
const { populateHelper, paginationHelper } = require('./queryMiddlewareHelpers');
const answerQueryMiddleware = function(model, options) {
	return asyncErrorWrapper(async function(req, res, next) {
		//Burda mantık şu bir sorunun cevaplarını paginate yada populate edeceğimiz için bizim önce o soruya ulaşıyor olmamız lazım bunun içinde bize request içinden soruya ait id gelecek önce bunu almalıyız.ve bu fonksiyonu routers/question.js içinde getSingleQuestion requestindenden hemen önce  kullanacağız.
		const { id } = req.params;
		//Peki biz questionın hangi schema bölümünü kullanacağız yani hangi arrayini kullanacağız onun adını almamız lazım
		const arrayName = 'answers';
		//Daha sonra bizim burda kaçtane answerımızın olduğunu bulmamız gerekiyor bunuda zaten questionSchemalarda belirtmiştik answersCount kısmında bu sayı tutulmakta bunun için idsi elimize ulaşan soruyu bulmamız gerekecek (await model.findById(id)) onun içindeki answerCount ile bu answers arrayindeki eleman sayısına ulaşabiliriz.
		const total = (await model.findById(id))['answerCount'];

		//daha sonra bizim pagination çalıştırmamız gerekiyor

		const paginationResult = await paginationHelper(total, undefined, req);

		//Biz burda query yollamadık undifened gönderdiğimiz için paginationHelperda undifened çıkıcak biz burda kendi querymizi kendimiz yazacağız.Bu yüzden bizim PaginationHelper da startIndex ve Limiti orda da dönmemiz gerekecek.ki burda da kullanacağız
		const startIndex = paginationResult.startIndex;
		const limit = paginationResult.limit;
		//Pagination işlemleri için artık bizde olan her bilgi yeterli fakat query.skip kullanamıyoruz bunun yerinede arrayimizi parçalamaya çalışacağız(startIndex ve Limit değerlerine göre ) bizim arrayimiz 10 elemanlı örneğin startIndex=2 olduğu zaman ve limitimiz de 3 ise bizim 0.index=1 1.index=2 2.index=3 3.index=4 4.index=5 ise bizim 2.index ile.4index dahil olmak  2 3 ve 4. indexdeki elemanları almamız gerekecek. bunun içinde  mongoDb nin  slice isimli özelliğini kullanacağız.
		//Bu özelliği kullanmak için ilk başta birtane queryObject oluşturmam gerekiyor.
		let queryObject = {};
		//queryObject içinde yukarıdaki arrayName i vereceğim
		queryObject[arrayName] = { $slice: [ startIndex, limit ] }; //StartIndex ve limit değerlerini slice a vererek buna göre parçalama işlemini gerçekleştireceğiz.
		//querymizi oluşturuyoruz model.find({"hangi alanları "},Options)
		query = model.find({ _id: id }, queryObject);
        //Populate 
        //populate Helper  fonksiyonuna querymizi ve options içinden gelecek olan  population kısmı  göndereceğiz.
        query = populateHelper(query,options.population)

		const queryResults = await query;
		res.queryResults = {
			success: true,
			pagination: paginationResult.pagination,
			data: queryResults
		};

		next();
	});
};

module.exports = answerQueryMiddleware;
