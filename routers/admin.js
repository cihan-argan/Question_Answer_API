const express = require('express');
const router = express.Router();
const { getAccessToRoute, getAdminAccess } = require('../middlewares/authorization/auth');
//Block User
//delete User

router.use([ getAccessToRoute, getAdminAccess ]); //Bu artık tüm routelarda geçerli olacak ilk önce getAccessToRoute çalışacak sonra getAdminAccess Çalışacak.
router.get('/', (req, res, next) => {
	// deneme yapmak için bu şekilde hazırladık
	res.status(200).json({
		success: true,
		message: 'Admin Page'
	});
});

module.exports = router;
