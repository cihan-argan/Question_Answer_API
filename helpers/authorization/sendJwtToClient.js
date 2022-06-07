//helpers/authorization/sendJwtToClient()
const sendJwtToClient = (user, response) => {
	//generate jwt
	const token = user.generateJWTFromUser();
	//response
	const { JWT_COOKIE, NODE_ENV } = process.env;

	return response
		.status(200)
		.cookie('access_token', token, {
			httpOnly: true,
			expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000), // config.env içinden alacağız.
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
module.exports = sendJwtToClient;
