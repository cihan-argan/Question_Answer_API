//Controller>auth.js
const customErrorHandler = require('../middlewares/errors/customErrorHandlers');
const User = require('../models/User');
const CustomError = require('../helpers/error/CustomErrors');

const register = async (req, res, next) => {
	//POST DATA gelecek fakat test amaçlı biz verileri burda oluşturucaz.
	const name = 'can bay ';
	const email = 'ali@outlook.com';
	const password = '12345';
	//zorunlu verilmesi gereken bilgileri hazırladık ve yeni kullanıcı oluşturabileceğiz bunun için async await yapısını kullanacağız.ilk başta register fonksiyonunu async e çevirmemiz gerekiyor ki içinde await yapısını kullanabilelim

	//asenkron kod yapısında ise try catch yardımı ile hata yakalayabiliriz.herhangi hata varsa catch bloğuna gelecek.next ile custom error handlerımıza gönderebileceğiz next middlewarelere yönlendirme yapıyordu..

	try {
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
	} catch (err) {
		return next(err);
	}
};

const errorTest = (req, res, next) => {
	//senkron kodda hata yakalama
	//Belirli code lar mevcut
	//Burda bir hata oluştu express senkron kod içinde oluşan hatayı direkt yakalicak nasıl yakalanılır.
	//Question does not exist
	//return next(new CustomError("Message","statuscode")) bu şekilde kendi oluşturduğumuz custom class ile kendi hatalarımızı ve kendi status kodlarımızı yollicaz.(helpers içinde hazırlicaz)
	return next(new SyntaxError('SyntaxError', 400)); //Bu andan itibaren express kendi içindeki error handling mekanizması vasıtasıyla bu error u yakalayacak ve bize response umuzu dönecek.

	//belirli kodlar mevcut
};
module.exports = {
	register,
	errorTest
};
