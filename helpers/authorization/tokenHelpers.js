//helpers/authorization/tokenHelpers
const sendJwtToClient = (user, response) => {
	//generate jwt
	const token = user.generateJWTFromUser();
	//response
	const { JWT_COOKIE, NODE_ENV } = process.env;

	return response
		.status(200)
		.cookie('access_token', token, {
			httpOnly: true,
			expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000 * 60), // config.env içinden alacağız.
			secure: NODE_ENV === 'development' ? false : true //Node env development ise false değilse true olacak
		})
		.json({
			success: true,
			access_token: token,
			data: {
				name: user.name,
				email: user.email
			}
		});
};
const isTokenIncluded = (req) => {
	//eğer token burda yerleştirilmemişse biz geriye bir tane hata fırlatacağız. req.headers.authorization varsa ve Bearer ile başlıyorsa true dönecek yapı bu şekilde değilse false döncek
	return req.headers.authorization && req.headers.authorization.startsWith('Bearer:');
};
const getAccessTokenFromHeader = (req) => {
	const authorization = req.headers.authorization;
	const access_token = authorization.split(' ')[1]; //Bearer: sonra boşluk var
	return access_token;
};
module.exports = {
	sendJwtToClient,
	isTokenIncluded,
	getAccessTokenFromHeader
};
