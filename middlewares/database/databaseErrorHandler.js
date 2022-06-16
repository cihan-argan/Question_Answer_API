const User = require('../../models/User');
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
module.exports = {
	checkUserExist
	//nerde kullanacağız routers içindeki user.js te controllerdan öncesine eklememiz gerekecek.
};
