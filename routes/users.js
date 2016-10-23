/**
 * 登录、注销、重定向到登录
 * 不会检测登录状态
 * @type {*|exports|module.exports}
 */

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
                var data = result.data;
                _resultJson.result = data.length;
                delete _resultJson.data;
                if(data.length) {
                    req.session.userName = data[0].username;
                }
            }
			res.json(_resultJson);
		});
});

router.get('/goLogin', function(req, res) {
    res.header('Access-Control-Expose-Headers', 'need-login');
    res.header('need-login', 'true');
    res.json({
        success: false,
        errorCode: 'You need to login'
    });
});

module.exports = router;
