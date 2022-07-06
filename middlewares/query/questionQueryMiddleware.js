const asyncErrorWrapper = require('express-async-handler');
const { searchHelper, populateHelper, questionSortHelper, paginationHelper } = require('./queryMiddlewareHelpers');

const questionQueryMiddleware = function(model, options) {
	//Bu function bir tane middlewareFunctionı return edecek Bu middleware funtion ise zaten bizim normal middleware function olacak.
	/*Yani birtane normal function oluşturuyoruz bu bir tanne middleware dönecek.argüman gönderildiği için. */

	return asyncErrorWrapper(async function(req, res, next) {
		//1.İŞLEM Query başlatma initial query
		let query = model.find();
		//2.işlem ilk başta search işlemini yaptıracağız. //Biz bu search işlemini diğer middlewaerelerde de kullanmak için bir helper function olarak  yazmak istiyorum.Bunu hemen query folder içinde yazıcam.queryMiddlewareHelpers.js içinde searchHelper fonksiyonu  oluşturucaz
		query = searchHelper('title', query, req);
		//3.işlem Populate işlemi burdada bir  queryMiddlewareHelpers.js populateHelper fonksiyonu oluşturucağız
		if (options && options.population) {
			//Options undifened değilse ve options içinde population varsa
			query = populateHelper(query, options.population);
		}
		//4.işlem sort işlemi burdada bir  queryMiddlewareHelpers.js questionSortHelper fonksiyonu oluşturucağız
		query = questionSortHelper(query, req);
		//5.işlem Pagination işlemi
		// burdada bir  queryMiddlewareHelpers.js paginationHelper fonksiyonu oluşturucağız ama öncesinde total oluşturmamız gerekecek
		const total = await model.countDocuments();
		const paginationResult = await paginationHelper(total, query, req); //Burda bize obje dönüyor bu şekilde almamız gerekiyor
		query = paginationResult.query;
		const pagination = paginationResult.pagination;
		//Burdan sonra artık querymizin responsunu yollamaya çalışacağız.
		const queryResults = await query;
		res.queryResults = {
			//Bunu yapmamızdaki sebep bunun GetAllQuestionda kullanilabilmesi için
			success: true,
			count: queryResults.length,
			pagination: pagination,
			data: queryResults
		};
		next();
	});
};
module.exports = questionQueryMiddleware;
