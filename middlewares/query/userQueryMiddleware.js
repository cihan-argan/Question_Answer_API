const asyncErrorWrapper = require('express-async-handler');
const { searchHelper, paginationHelper } = require('./queryMiddlewareHelpers');
const userQueryMiddleware = function(model, options) {
	return asyncErrorWrapper(async function(req, res, next) {
		//1.adım querymizi oluşturalım
		let query = model.find();
		//2.adım biz userları search ederken name a göre search yaptırıcaz bize hem querymiz gerekecek mantıken user.find() burda search ile name göre istek atıcaz hangi name olduğu ise requestin içinde gelecek. search by name kısmı
		query = searchHelper('name', query, req);
		//3.adım pagination
		const paginationResult = await paginationHelper(model, query, req);
		query = paginationResult.query;
		pagination = paginationResult.pagination;

		const queryResults = await query;
		res.queryResults = {
			success: true,
			count: queryResults.length,
			pagination: pagination,
			data: queryResults
		};
		next();
	});
};

module.exports = userQueryMiddleware;
