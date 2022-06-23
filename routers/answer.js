const express = require('express');

const router = express.Router({ mergeParams: true });

router.get('/', (req, res, next) => {
	console.log(req.params);
	res.send('Answer Route Deneme 123 ...');
});
module.exports = router;
