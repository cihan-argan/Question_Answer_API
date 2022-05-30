//Auth.js
const express = require('express');
// /api/auth
const router = express.Router();

router.get('/', (req, res) => {
	res.send('Auth Home Page');
});

// /api/auth/register
router.get('/register', (req, res) => {
	res.send('Auth Register Page');
});
//kullanabilmek için
module.exports = router;
