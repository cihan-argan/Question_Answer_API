const CustomError = require('../../helpers/error/CustomErrors');
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
module.exports = {
	getAccessToRoute
};
//bu middleware nerde kullanıcam routers/auth.js içinde kullanacağım
