var express = require('express');
var object = require('lodash/fp/object');
var routeUtil = require('./utils');
const db = require('../public/javascripts/db');
var router = express.Router();

//db.connect();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res) {
	const _query = req.query;
		db.query('select username from userdata where username = ? and password = ?', [_query.username, _query.password], (result) => {
			var _resultJson = routeUtil.generateResult(result);
            if(result.success) {
                _resultJson.result = result.data !== null;
                delete _resultJson.data;
            }
            res.setHeader("Access-Control-Allow-Origin", "*");
			res.json(object.assign(_resultJson));
		});
});

module.exports = router;
