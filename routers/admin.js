const express = require('express');
const router = express.Router();
const { getAccessToRoute, getAdminAccess } = require('../middlewares/authorization/auth');
const { checkUserExist } = require('../middlewares/database/databaseErrorHandler');
const { blockUser } = require('../controllers/admin'); //Block User
//delete User

router.use([ getAccessToRoute, getAdminAccess ]); //Bu artık tüm routelarda geçerli olacak ilk önce getAccessToRoute çalışacak sonra getAdminAccess Çalışacak.

router.get('/block/:id', checkUserExist, blockUser);

module.exports = router;
