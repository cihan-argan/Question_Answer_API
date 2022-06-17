//middlewares>error>customErrorHandlers.js
const CustomError = require('../../helpers/error/CustomErrors');
const customErrorHandler = (err, req, res, next) => {
	let customError = err;

	if (err.name === 'SyntaxError') {
		customError = new CustomError(err.message, 400);
	}
	if (err.name === 'ValidationError') {
		customError = new CustomError(err.message, 400);
	}

	if (err.name === 'CastError') {
		customError = new CustomError('Please provide a valid id', 400);
	}

	if (err.code === 11000) {
		//Duplicate Key
		customError = new CustomError('Duplicate Key Found: Check Your Input', 400);
	}
	console.log(customError.message, customError.status);

	res.status(customError.status || 500).json({
		//eğer karşılaşılan hatanın statusu yoksa 500 gönder 500 Internal Server Error
		success: false,
		message: customError.message || 'Internal Server Error'
		//Eğer Karşılaşılan hatanın mesajı yoksa Internal Server Error hatası yolla diyoruz.
	});
};
module.exports = customErrorHandler;
