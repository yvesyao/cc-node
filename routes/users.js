var express = require('express');
const db = require('../public/javascripts/db');
var router = express.Router();

//db.connect();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res) {
    db.query('select username from userdata where username=:username and password=:password', req.params, (data) => {
        res.send(data !== null);
    });
});

module.exports = router;
