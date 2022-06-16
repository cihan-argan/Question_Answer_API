const User = require('../models/User');
const CustomError = require('../helpers/error/CustomErrors');
const asyncErrorWrapper = require('express-async-handler');

const getSingleUser = asyncErrorWrapper(async (req, res, next) => {
	const { id } = req.params; //idler req.params içinden gelecek.
	const user = await User.findById(id);
	console.log(user);
	if (!user) {
		return next(new CustomError('There is no such user with that id ', 400)); //bu id ye sahip kullanıcı yok
	}
	return res.status(200).json({
		success: true,
		data: user
	});
});
module.exports = { getSingleUser };
