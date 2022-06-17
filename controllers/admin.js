const User = require('../models/User');
const CustomError = require('../helpers/error/CustomErrors');
const asyncErrorWrapper = require('express-async-handler');

const blockUser = asyncErrorWrapper(async (req, res, next) => {
	const { id } = req.params; //id yi paramstan alıyoruz
	const user = await User.findById(id); //id ye ait kullanıcıyı buluyoruz
	user.bloked = !user.bloked; //bloked true ise false false ise true yapıyoruz.

	await user.save(); //işlem gerçekleştikten sonra kullanıcıyı kayıt ediyoruz.
	return res.status(200).json({
		success: true,
		message: 'Block-Unblock Successfull'
	});
});
const deleteUser = asyncErrorWrapper(async (req, res, next) => {
	const { id } = req.params;
	const user = await User.findById(id);
	await user.remove(); //db den ilgili kullanıcıyı silmiş olacağız.
	return res.status(200).json({
		success: true,
		message: 'Delete Operation Successfull'
	});
});

module.exports = { blockUser, deleteUser };
