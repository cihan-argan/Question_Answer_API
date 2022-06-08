const bcrypt = require('bcryptjs');
const validateUserInput = (email, password) => {
	return email && password;
};
const comparePassword = (password, hashedPassword) => {
	//bcrypt kütüphanesini kullanacağız  farklı bir yöntem ile
	return bcrypt.compareSync(password, hashedPassword); //burda hash li password decode edilecek aynıysa true değilse false döncek
};
module.exports = { validateUserInput, comparePassword };
