/**
 * @author 奕夫 <yitao.yyt@alibaba-inc.com>
 */
var express = require('express');
const db = require('../public/javascripts/db');
var routeUtil = require('./utils');
var getChartData = require('../public/javascripts/getChartData');
var router = express.Router();

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
    db.query('select * from computer limit 0,1000', (result) => {
        var _resultJson = routeUtil.generateResult(result);
        res.setHeader("Access-Control-Allow-Origin", "*");
        if(result.success) {
            const tree = getChartData.getComputer(result.data);
            _resultJson.data = tree.treeData;
            _resultJson.info = tree.treeInfo;
        }
        res.json(_resultJson);
    });
});

router.get('/user', function(req, res) {
    db.query('select * from user limit 0,1000', (result) => {
        var _resultJson = routeUtil.generateResult(result);
        res.setHeader("Access-Control-Allow-Origin", "*");
        if(result.success) {
            const tree = getChartData.getUser(result.data);
            _resultJson.data = tree.treeData;
            _resultJson.info = tree.treeInfo;
        }
        res.json(_resultJson);
    });
});

router.get('/groupData', function(req, res) {
    const nameList = (req.query.groupList || []).map(db.escape);
    db.query('select * from groupData where name in (' + nameList.join(',') + ')', (result) => {
        var _resultJson = routeUtil.generateResult(result);
        res.setHeader("Access-Control-Allow-Origin", "*");
        if(result.success) {
            _resultJson.data = getChartData.getGroup(result.data);
        }
        res.json(_resultJson);
    });
});

module.exports = router;
