const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
	res.send('Answer Route Deneme 123 ...');
});
module.exports = router;
