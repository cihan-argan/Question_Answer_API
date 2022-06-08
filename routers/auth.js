//Routers > auth.js
const express = require('express');
// /api/auth
const router = express.Router();
const { register, getUser } = require('../controllers/auth');
const { getAccessToRoute } = require('../middlewares/authorization/auth');

router.post('/register', register);
router.get('/profile', getAccessToRoute, getUser);

//kullanabilmek için
module.exports = router;
