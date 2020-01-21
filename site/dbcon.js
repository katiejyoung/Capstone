var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'oniddb.cws.oregonstate.edu',
  user            : 'dixonky-db',
  password        : 'istkEvx33erUQQIe',
  database        : 'dixonky-db'
});

module.exports.pool = pool;
//This needs to be changed to the class server, I can't get my personal one to work