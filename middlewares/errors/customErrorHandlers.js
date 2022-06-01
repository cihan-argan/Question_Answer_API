//middlewares>error>customErrorHandlers.js
const customErrorHandler = (err, req, res, next) => {
	console.log(err);
	res
		.status(400) //kullanıcı tarafından bir hata yapılırsa 400 gönderiyorum 400 = bad request
		.json({
			success: false
		});
};
module.exports = customErrorHandler;
