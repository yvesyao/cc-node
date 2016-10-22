/**
 * @author 奕夫 <yitao.yyt@alibaba-inc.com>
 */
function generateResult(result) {
    if(result.success) {
        return {
            success: result.success,
            data: result.data
        }
    } else {
        return result;
    }
}

module.exports = {
    generateResult: generateResult
};