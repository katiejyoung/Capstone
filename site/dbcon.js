var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'capstone_2019_secretkeeper',
  password        : '8MJEPjSVGL4HG59P',
  database        : 'capstone_2019_secretkeeper'
});

module.exports.pool = pool;
