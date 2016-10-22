/**
 * Created by Yves on 2016/10/15.
 */
const Pool = require('generic-pool').Pool,
    mysql = require('mysql'),
    dbConf = require('../config/db.json');
require('log-color-date');

var pool = new Pool({
    name     : 'mysql',
    create   : function(callback) {
        var connection = mysql.createConnection(dbConf);

        // parameter order: err, resource
        callback(null, connection);
    },
    destroy  : function(client) { client.end(); },
    max      : 1000,
    // optional. if you set this, make sure to drain() (see step 3)
    min      : 2,
    // specifies how long a resource can stay idle in pool before being removed
    idleTimeoutMillis : 30000,
    // if true, logs via console.log - can also be a function
    log : false
});



//function connect(callback) {
//    console.info(`Connecting to ${dbConf.host}:${dbConf.port}`);
//    connection.connect(err => {
//        if(err) {
//            console.error('Connection error');
//        } else {
//            console.info('Connected to mysql');
//            callback();
//        }
//    });
//}

//connection.on('error', function(err) {
//    console.error(err.code)
//    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
//        var count = 5;
//        setInterval(() => {
//            console.warn('Lost connection with database. Try again in %d secs later...', count--);
//        });
//        setTimeout(connect, count * 1000);
//    }
//});

function query(sql, parameters, callback) {

    const _params = [];
    parameters = parameters || [];
    if(typeof parameters === 'function') {
        callback = parameters;
        parameters = {};
    }

    for(var key in parameters) {
        if(parameters.hasOwnProperty(key)) {
            // TODO: fix error
            // _params[key] = (pool.escape(parameters[key]));
            _params[key] = parameters[key];
        }
    }

    pool.acquire(function(err, client) {
        if (err) {
            // handle error - this is generally the err from your
            // factory.create function
        }
        else {
            console.log('params', typeof(_params), _params)
            client.query(sql, parameters, (err, res) => {
                var result = {
                    success: true,
                    data: null,
                    error: null
                };
                if(err) {
                    result.success = false;
                    result.error = err;
                    console.error("Query error");
                } else {
                    console.info("Query success");
                    result.data = res;
                }
                if(typeof callback === 'function') {
                    callback(result);
                }
                // return object back to pool
                pool.release(client);
            });
        }
    });
}

function disConnect() {
    pool.drain(function() {
        pool.destroyAllNow();
    });
    //connection.end(function (err) {
    //    if(err) {
    //        console.error('Disconnection error');
    //    } else {
    //        console.info('Disconnected with mysql');
    //    }
    //});
}

module.exports = {
    //connect,
    query,
    disConnect
};