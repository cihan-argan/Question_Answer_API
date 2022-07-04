const User = require('../models/User');
const CustomError = require('../helpers/error/CustomErrors');
const asyncErrorWrapper = require('express-async-handler');

const getSingleUser = asyncErrorWrapper(async (req, res, next) => {
	const { id } = req.params; //idler req.params içinden gelecek.
	const user = await User.findById(id);

	return res.status(200).json({
		success: true,
		data: user
	});
});
const getAllUsers = asyncErrorWrapper(async (req, res, next) => {
	return res.status(200).json(res.queryResults);
});
module.exports = { getSingleUser, getAllUsers };
