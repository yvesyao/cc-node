/**
 * @author 奕夫 <yitao.yyt@alibaba-inc.com>
 *     获取 computer 和 user 的数据
 */
var object = require('lodash/fp/object');
var array = require('lodash/fp/array');
var __keys = {
    computer: ['description', 'whenCreated', 'servicePrincipalName', 'whenChanged', 'uSNCreated', 'userAccountControl', 'badPwdCount', 'badPasswordTime', 'lastLogon', 'pwdLastSet', 'accountExpires', 'logonCount', 'operatingSystem', 'operatingSystemVersion', 'operatingSystemServicePack', 'lastLogonTimestamp', 'memberOf'],
    user: ['description', 'whenCreated', 'whenChanged', 'uSNCreated', 'userAccountControl', 'badPwdCount', 'badPasswordTime', 'lastLogon', 'pwdLastSet', 'accountExpires', 'logonCountlastLogonTimestamp', 'managedBy', 'memberOf', 'homeDirectory', 'lockoutTime', 'sn', 'givenName', 'department', 'company', 'telephoneNumber', 'streetAddress', 'mail', 'l', 'postalCode', 'manager', 'mobile', 'uNCName', 'url', 'userWorkstations', 'proxyAddresses']
};
function _formatJson(name, srcJson) {
    if(srcJson.__isLeaf) {
        srcJson.name = name;
        return object.omit('__isLeaf', srcJson);
    }
    return {
        name: name,
        children: object.keys(srcJson).map(childName => {
            return _formatJson(childName, srcJson[childName])
        })
    };
}


function _generatePath(str, key) {
    var result = [];
    str.substring(1, str.length - 1) // 去掉首尾的双引号
        .split('\\\\,')
        .forEach(item => {
            var _query = item.split('=');
            if(_query[0] === key) { // 匹配到对应的 key
                result.unshift(_query[1]);
            }
        });
    return result;
}

/**
 * 从 dbData 中筛选叶子节点所需的信息
 * @param name
 * @param dbData
 * @private
 */
function _filterData(name, nodePath, dbData) {
    var serviceList = [];
    var _result = {
        __isLeaf: true,
        path: nodePath.join('/')
    };
    __keys[name].forEach(key => {
        var _value = dbData[key];
        switch (key) {
            case 'servicePrincipalName':
                var _services = (_value || '').split(';');
                _services.forEach(service => {
                    const serviceName = service.split('\/')[0];
                    if(~serviceList.indexOf(serviceName)) {
                        return;
                    }
                    serviceList.push(serviceName);
                });
                _result.service = serviceList;
                return;
            case 'memberOf': _value = _value.split('\\\\\n')[0]
        }
        _result[key] = _value;
    });
    return _result;
}

/**
 * 格式化 computer&user 数据
 * @param name 'computer' 或者 'user'
 * @param dbData
 * @returns {*}
 */
function getJson(name, dbData) {
    var ROOT = '', // 根节点名称
        resultJson = void 0,
        maxDepth = 0,
        leafCount = 0,
        group = [],
        fileName = 'sample.csv';// TODO: fileName 作为参数和查询条件
    dbData.forEach(data => {
        const positionString = data['DN'],
            nodeName = data['name'],
            nodePath = _generatePath(positionString, 'OU');

        if(!resultJson) { // 获取 root 节点
            resultJson = {
                [ROOT = _generatePath(positionString, 'DC').reverse().join('.')]: {}
            }
        }
        var nodePos = resultJson[ROOT]; // 用于定位到当前 node 对应的位置

        nodePath.forEach(parentNodeName => {
            if(!nodePos[parentNodeName]) { // 新建路径
                nodePos[parentNodeName] = {};
            }
            nodePos = nodePos[parentNodeName]; // 向下寻找目标节点位置
        });
        nodePath.unshift(ROOT);
        if(nodePath.length > maxDepth) {
            maxDepth = nodePath.length;
        }
        ++leafCount;
        nodePos[nodeName] = _filterData(name, nodePath, data);
        group.push(nodePos[nodeName].memberOf);
    });
    return {
        treeData: _formatJson('', resultJson).children[0],
        treeInfo: {
            fileName: fileName,
            maxDepth: maxDepth,
            leafCount: leafCount,
            group: array.uniq(group)
        }
    };
}

function _generateGroupPath(memberOf) {
    return memberOf.split('\\\\\n').reverse();
}

function _filterGroupData(result, member) {
    (member.match(/CN=([^\\]*)/g) || []).forEach(matched => {
        result[matched.substr(3)] = {
            size: 1,
            __isLeaf: true
        }
    });
    return result;
}

function getGroup(dbData) {
    var ROOT = '', // 根节点名称
        resultJson = void 0;
    dbData.forEach(data => {
        const positionString = data['DN'],
            nodePath = _generateGroupPath(data['memberOf']);

        if(!resultJson) { // 获取 root 节点
            resultJson = {
                [ROOT = _generatePath(positionString, 'DC').reverse().join('.')]: {}
            }
        }
        var nodePos = resultJson[ROOT]; // 用于定位到当前 node 对应的位置
        nodePath.splice(1).forEach(parentNodeName => {
            if(!nodePos[parentNodeName]) { // 新建路径
                nodePos[parentNodeName] = {};
            }
            nodePos = nodePos[parentNodeName]; // 向下寻找目标节点位置
        });
        _filterGroupData(nodePos, data['member']);
    });
    return _formatJson('', resultJson).children[0];
}

function getComputer(dbData) {
    return getJson('computer', dbData);
}

function getUser(dbData) {
    return getJson('user', dbData);
}

module.exports = {
    getComputer: getComputer,
    getGroup: getGroup,
    getUser: getUser
};