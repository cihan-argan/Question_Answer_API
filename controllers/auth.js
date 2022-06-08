//Controller>auth.js
const customErrorHandler = require('../middlewares/errors/customErrorHandlers');
const User = require('../models/User');
const { sendJwtToClient } = require('../helpers/authorization/tokenHelpers');
const CustomError = require('../helpers/error/CustomErrors');
const asyncErrorWrapper = require('express-async-handler');
const { validateUserInput, comparePassword } = require('../helpers/inputs/inputHelpers');

const register = asyncErrorWrapper(async (req, res, next) => {
	//POST DATA
	const { name, email, password, role } = req.body;

	const user = await User.create({
		name, //name : name,
		email, //email : email,
		password, //password :password ES6 Standartları gereği bu şekilde vermeye gerek kalmadı.bu veriler beklenecek bir hata çıkmaz ise yani validation hatası çıkmaz ise verilerimiz gelecek bizde bunu const user olarak alabileceğiz.
		role
	});
	//Not: Postman üzerinden registera post yapınca fonksiyonumuz çalışacak ve userımız oluşacak oluşan user bize geri dönecek.
	sendJwtToClient(user, res);
});

const login = asyncErrorWrapper(async (req, res, next) => {
	const { email, password } = req.body;
	if (!validateUserInput(email, password)) {
		//email yada passworden herhangi birisi undifened ise buraya gireceğiz
		return next(new CustomError('please check your inputs', 400)); //kullanıcı tarafından hata olduğu için 400
	}
	//Burada userSchemadan bu emaile göre verimi cekmek istiyorum bunun için
	const user = await User.findOne({ email }).select('+password'); //bizim emailimize göre arama yapacak verimizi döndürecek.
	//console.log(user); //bakınca password gözükmüyor ama login için bizim password almamız gerekiyor models ta password select false demiştik.bunu almak içinde findone yanına .select("+password"); ile passwordu almak istediğimi söyleyeceğım.
	//Not2 : gelen password hashli geleceği için bcrypt kütüphanesi yardımıyla bizim tekrardan passwordu decode etmemiz gerekecek.eğer eşleşiyorsa gönderilen password ile bizim artık login işlemimizi bitirmemiz gerekiyor.Bunun için bir tane daha helpers yazmam gerekiyor inputhelpersta yazabilirim.

	if (!comparePassword(password, user.password)) {
		//formdan aldığım password ve userın passwordu(hashlenmiş) verildi.
		return next(new CustomError('Please check your credentials', 400));
	}
	sendJwtToClient(user, res);//password da doğruysa tokenı tekrar gösterebiliriz.
});
const getUser = (req, res, next) => {
	res.json({
		success: true,
		data: {
			id: req.user.id,
			name: req.user.name
		}
	});
};
module.exports = {
	register,
	login,
	getUser
};
