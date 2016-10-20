var express = require('express');
const db = require('../public/javascripts/db');
var router = express.Router();

//db.connect();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res) {
	const _query = req.query;
		db.query('select username from userdata where username = ? and password = ?', [_query.username, _query.password], (data) => {
			console.log("data");
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.json({
				result: data !== null
				});
		});
});

module.exports = router;
