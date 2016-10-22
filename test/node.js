/**
 * @author 奕夫 <yitao.yyt@alibaba-inc.com>
 */
var object = require('lodash/fp/object');
const foo = {
    'a': 1,
    b: 2,
    c: 3
};

const arr = [1,2,3]

//arr.forEach(console.log)

console.log(object.omit('a', foo));