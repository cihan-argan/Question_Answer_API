//Controller>auth.js
const customErrorHandler = require('../middlewares/errors/customErrorHandlers');
const User = require('../models/User');
const {sendJwtToClient}  = require('../helpers/authorization/tokenHelpers');
const CustomError = require('../helpers/error/CustomErrors');
const asyncErrorWrapper = require('express-async-handler');

const register = asyncErrorWrapper(async (req, res, next) => {
	//POST DATA
	const { name, email, password, role } = req.body;

	const user = await User.create({
		name, //name : name,
		email, //email : email,
		password //password :password ES6 Standartları gereği bu şekilde vermeye gerek kalmadı.bu veriler beklenecek bir hata çıkmaz ise yani validation hatası çıkmaz ise verilerimiz gelecek bizde bunu const user olarak alabileceğiz.
	});
	//Not: Postman üzerinden registera post yapınca fonksiyonumuz çalışacak ve userımız oluşacak oluşan user bize geri dönecek.
	sendJwtToClient(user, res);
});

const getUser = (req, res, next) => {
	res.json({
		success: true,
		data:{
			id: req.user.id,
			name:req.user.name
		}
	});
};
module.exports = {
	register,
	getUser
};
