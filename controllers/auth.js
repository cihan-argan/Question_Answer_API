//Controller>auth.js
const customErrorHandler = require('../middlewares/errors/customErrorHandlers');
const User = require('../models/User');
const { sendJwtToClient } = require('../helpers/authorization/tokenHelpers');
const CustomError = require('../helpers/error/CustomErrors');
const asyncErrorWrapper = require('express-async-handler');
const { validateUserInput, comparePassword } = require('../helpers/inputs/inputHelpers');
const sendEmail = require('../helpers/libraries/sendEmail');
const { findOne } = require('../models/User');
//register
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
//login
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
	sendJwtToClient(user, res); //password da doğruysa tokenı tekrar gösterebiliriz.
});
//logout
const logout = asyncErrorWrapper(async (req, res, next) => {
	//Tokenler silinicek bunun için ilk başta envoirement değişkenlerimizi almamız gerekecek.
	const { NODE_ENV } = process.env;

	return res
		.status(200)
		.cookie({
			httpOnly: true,
			expires: new Date(Date.now()), //Çıkış süremizi o anı yapmalısın ki oturum sonlansın bu sayede Logout yapınca cookieimiz yok olmuş olacak
			secure: NODE_ENV === 'development' ? false : true // development ise false production ise true olacak.
		})
		.json({
			success: true,
			message: 'Logout Successfull'
		});
});
//getUser
const getUser = (req, res, next) => {
	res.json({
		success: true,
		data: {
			id: req.user.id,
			name: req.user.name
		}
	});
};
//ImageUpload
const imageUpload = asyncErrorWrapper(async (req, res, next) => {
	//veri tabanı güncellenmesi
	const user = await User.findByIdAndUpdate(
		req.user.id,
		{
			profile_image: req.savedProfileImage
		},
		{
			new: true,
			runValidators: true
		}
	);

	//Image Upload Success
	res.status(200).json({
		success: true,
		message: 'Image Upload Successful',
		data: user
	});
});

//forgatPassword
const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
	const resetEmail = req.body.email; // emaili aldık
	//Yapmamız gereken ilk işlem kullanıcımızı bu email ile almak kullanıcı yoksada bu emaile sahip kullanıcı yok diye hata fırlatacağız

	const user = await User.findOne({ email: resetEmail }); // email ile eşleşen kullanıcı var mı

	if (!user) {
		return next(new CustomError('There is no user with that email ', 400)); // kullanıcı yoksa hata fırlattık
	}
	//Geçtiysek kullanıcı var demektir. resetpasswordtokenı burda çalıştırabiliriz.
	const resetPasswordToken = user.getResetPasswordTokenFromUser(); // varsa tokenımızı  user modeline kaydettiğimniz getresetpasswordtokenfromuser ile  user model içinde oluşturduk

	await user.save(); // user.save diyerek userımıza kaydettik.resetPasswordToken ve resetPasswordExpire oluşturduk
	//maili göndereceğiz
	//1.adım mail içeriğinin hangi url ye gideceğini söyleyeceğiz
	const resetPasswordUrl = `https://localhost:5040/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
	//mail içeriğimizin hangi urlye gönderileceğini belirtiyoruz.ve içine tokenimizi göndereceğiz.biz bir sonraki derste resetpassword adında bir rout tanımlicaz.ve buna gönderilen resetPasswordTokenı göndereceğiz.
	//2.adım email template oluşturucaz
	const emailTemplate = `
		<h3> Reset Your Password </h3>
		<p>This <a href = '${resetPasswordUrl}' target = '_blank'>link</a> will expire in 1 hour.</p>
	`;

	//3.adım aldıktan sonra await ile bu mailin gönderilmesini beklicem.Bunu try içine alıcam herhangi hata olursa bizim resetPasswordTokenı ve resetPasswordExpire ı  tekrardan undifined yapmamız gerekiyorYani burda merkezicustomerrorhandler değil kendi errorhandlerimizi kullanmaya çalışacağız o yüzden buraya try açıcaz.
	try {
		await sendEmail({
			from: process.env.SMTP_USER, //nerden göndereceğiz
			to: resetEmail, //kime göndereceğiz
			subject: 'Reset Your Password', //mesaj başlığı
			html: emailTemplate //html içeriği
		});
		return res.status(200).json({
			success: true,
			message: 'Token sent to your  email.'
		});
	} catch (err) {
		//herhangi hata alırsak bu mail gönderilmemiş demektir bizim resetPasswordToken ve resetPasswordExpire ı alıp undifened yapmamız gerekiyor.

		user.resetPasswordToken = undifened; //mail
		user.resetPasswordExpire = undifened;
		await user.save();
		return next(new CustomError('Email Could Not Be Sent', 500));
	}
});
const resetPassword = asyncErrorWrapper(async (req, res, next) => {
	const { resetPasswordToken } = req.query; //Tokenımızı req.query içinden almamız gerekiyor.
	//yeni parolamızda postmande body de row da json olarak "password":"123456789" olarak gönderilecek.bunuda almam gerekiyor.
	const { password } = req.body;
	//resetPasswordToken gönderilmemişse şeklinde kontrol gerçekleştirmem gerekiyor.

	if (!resetPasswordToken) {
		return next(new CustomError('Please provide a valid token ', 400));
	}
	//gönderilmişse biz bu tokena göre kullanıcımızı seçicez.
	let user = await User.findOne({
		resetPasswordToken: resetPasswordToken, //reset password token varsa ve ancak expire etmemişse yani 1 saat geçmemişse bu kullanıcımızın passwordunu güncellememiz gerekiyor.expire etmememe durumunu aşağıdaki gibi yapabiliriz.
		resetPasswordExpire: { $gt: Date.now() } // expire 1 saat geçmiş ise yani şuanki tarihten ileri tarih olmasını sorgulamam gerekiyor bunnun için mongodb nin greater then sorgusunu kullanmam gerekiyor.Yani expire date.now dan büyükse getir demek oluyor.
		//yani bu token henüz expire etmemişse ve bu tokenımız  mevcutsa o userı alacağız. ve sıfırlama işlemini gerçekleştirebiliriz.
	});
	//eğer user gelmezse
	if (!user) {
		return next(new CustomError('Invalid Token or Session Expired', 404));
	}
	user.password = password; // body içinden passwordu almıştık user.password = body içindeki passowrd oldu.
	//ve artık token ve expire ımızı undifened yapmamız gerekiyor.
	user.resetPasswordToken = undifened;
	user.resetPasswordExpire = undifened;
	//bu userımızı güncelledik ve artık veri tabanına yazmamız gerekiyor
	await user.save(); // yeni parolamızda userSchema.pre("save",function) içine girip tekrar cryptolanacak.
	return res.status(200).json({
		success: true,
		message: 'Reset Password Proccess Successfull'
	});
});
module.exports = {
	register,
	login,
	forgotPassword,
	resetPassword,
	logout,
	getUser,
	imageUpload
};
