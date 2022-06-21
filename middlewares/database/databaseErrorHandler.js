const User = require('../../models/User');
const Question = require('../../models/Question');
const CustomError = require('../../helpers/error/CustomErrors');
const asyncErrorWrapper = require('express-async-handler');

const checkUserExist = asyncErrorWrapper(async (req, res, next) => {
	// /api/users/id şeklindeki route erişmeden önce ben bu middleware in çalışmasını istiyorum userexist mi değilmi kontrolünden sonra user controller çalışsın istiyorum.
	const { id } = req.params;
	const user = await User.findById(id);
	console.log(user);
	if (!user) {
		return next(new CustomError('There is no such user with that id ', 400)); //bu id ye sahip kullanıcı yok
	}
	next();
});
const checkQuestionExist = asyncErrorWrapper(async (req, res, next) => {
	//Ben burda Questiona göre sorgulama yapacağım için Question dahil etmemiz gerekecek.
	const { id } = req.params;
	const question = await Question.findById(id); //Question ımız id ye göre bize döncek.
	//id ye göre bu question yok ise
	if (!question) {
		return next(new CustomError('There is no such question with that id', 400));
	}
	//eğer question var ise devam edecekç
	next();
});
module.exports = {
	checkUserExist, ///nerde kullanacağız routers içindeki herhangi bir yerde User  var mı yok mu diye control ettireceğimiz zaman kullanabiliriz.

	checkQuestionExist // nerde kullanacağız routers içindeki herhangi bir yerde question var mı yok mu diye control ettireceğimiz zaman kullanabiliriz.
};
