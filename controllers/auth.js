//Controller>auth.js
const User = require('../models/User');

const register = async (req, res, next) => {
	//POST DATA gelecek fakat test amaçlı biz verileri burda oluşturucaz.
	const name = 'Sezai Argan';
	const email = 'dalokay68@outlook.com';
	const password = '123456';
	//zorunlu verilmesi gereken bilgileri hazırladık ve yeni kullanıcı oluşturabileceğiz bunun için async await yapısını kullanacağız.ilk başta register fonksiyonunu async e çevirmemiz gerekiyor ki içinde await yapısını kullanabilelim
	const user = await User.create({
		name, //name : name,
		email, //email : email,
		password //password :password ES6 Standartları gereği bu şekilde vermeye gerek kalmadı.bu veriler beklenecek bir hata çıkmaz ise yani validation hatası çıkmaz ise verilerimiz gelecek bizde bunu const user olarak alabileceğiz.
	});
	//Not: Postman üzerinden registera post yapınca fonksiyonumuz çalışacak ve userımız oluşacak oluşan user bize geri dönecek.
	res.status(200).json({
		success: true,
		data: user
	});
};
module.exports = {
	register
};
