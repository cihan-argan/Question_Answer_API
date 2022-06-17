const CustomError = require('../../helpers/error/CustomErrors');
const asyncErrorWrapper = require('express-async-handler');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { isTokenIncluded, getAccessTokenFromHeader } = require('../../helpers/authorization/tokenHelpers');
const getAccessToRoute = (req, res, next) => {
	const { JWT_SECRET_KEY } = process.env;

	//Token burda control edilecek
	if (!isTokenIncluded(req)) {
		//401 ve 403 status
		//401 Unauthorize => giriş ypamadan bir sayfaya ulaşmaya çalışıyorsun bu durum için
		//403 forbidden => Giriş yapsanda adminlerin erişebileceği yere erişmek istediğinde
		return next(new CustomError('You are not authorized to access this route', 401));
	}
	const accessToken = getAccessTokenFromHeader(req);
	jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
		//gönderdiğimiz token süresi geçmişse decoded gerçekleşemeyecek  err gelecek geçmemişse decoded işlemini gerçekleştireceğiz.
		if (err) {
			return next(new CustomError('You are not authorized to access this route', 401));
		}
		req.user = {
			id: decoded.id,
			name: decoded.name
		};
		next();
	});
};
const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
	const { id } = req.user; //getAccessToRoute fonksiyonuna girdikten sonra id yi alacağız
	const user = await User.findById(id); //aldığımız id ye göre kullanıcıyı bulacağız.
	if (user.role !== 'admin') {
		// Bulunan userın rolü admin değilse alttaki erroru yollicaz.
		return next(new CustomError('Only admins can access this route ', 403)); //403 forbidden hatası
	}
	next(); //eğer kullanıcı admin ise sonraki fonksiyona yönlendirilecek.
});
module.exports = {
	getAccessToRoute, //bu middleware nerde kullanıcam routers/auth.js içinde kullanacağım başka yerlerde de kullanabilirim
	getAdminAccess
};
