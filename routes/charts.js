/**
 * @author 奕夫 <yitao.yyt@alibaba-inc.com>
 */
var express = require('express');
const db = require('../public/javascripts/db');
var router = express.Router();

function getComputer() {
    var resultJson = {};
    db.query('select * from computer limit 0,5', req.params, (data) => {
        res.send(data !== null);
    });
    return resultJson;
}

function getUser() {
    var resultJson = {};
    return resultJson;
}

function getGroup() {
    var resultJson = {};
    return resultJson;
}
//db.connect();
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/computer', function(req, res) {

});

module.exports = router;
