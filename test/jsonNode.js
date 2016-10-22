/**
 * @author 奕夫 <yitao.yyt@alibaba-inc.com>
 */
const db = require('../public/javascripts/db');
var getChartData = require('../public/javascripts/getChartData');

//db.query('select * from computer limit 0,50', (result) => {
//    if(result.success) {
//        console.log(JSON.stringify(getChartData.getComputer(result.data)));
//    }
//});

db.query('select * from user limit 0,50', (result) => {
    if(result.success) {
        console.log(JSON.stringify(getChartData.getUser(result.data)));
    }
});