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
                var userName = result.data;
                _resultJson.result = userName !== null;
                delete _resultJson.data;
                if(userName) {
                    req.session.user = userName;
                }
            }
			res.json(_resultJson);
		});
});

module.exports = router;
