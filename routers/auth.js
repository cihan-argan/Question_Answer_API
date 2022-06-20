//Routers > auth.js
const express = require('express');
// /api/auth
const router = express.Router();
const {
	register,
	login,
	getUser,
	logout,
	imageUpload,
	forgotPassword,
	resetPassword,
	editDetails
} = require('../controllers/auth');
const { getAccessToRoute } = require('../middlewares/authorization/auth');
const profileImageUpload = require('../middlewares/libraries/profileImageUpload');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', getAccessToRoute, getUser);
router.get('/logout', getAccessToRoute, logout);
router.post('/forgotpassword', forgotPassword); //Burda herhangi middleware olmayacak kullancı zaten giriş yapamamış
router.put('/resetpassword', resetPassword);
router.put('/edit', getAccessToRoute, editDetails);

router.post('/upload', [ getAccessToRoute, profileImageUpload.single('profile_image') ], imageUpload);
// post işlemi olacak /upload routeına burda ikitane middleware çalışacak birincisi giriş yapmış kullanıcılar kullanacağı için getAccessToRoute çalışacak daha sonrasında bizim Middleware/libraries/profileImageUploads çalışacak bunun kullanımınımulter npmde .single şeklinde olduğu için  profileImageUpload.single( postmanden yollanılan key ) şeklinde kullanacağız.daha sonrada bizim imageUpload isminde oluşturucağımız controllerımızı yazmamız gerekiyor

//kullanabilmek için
module.exports = router;
