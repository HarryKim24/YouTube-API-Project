// get the client
const mysql = require("mysql2");

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Youtube",
  dateStrings: true
});

module.exports = connection

// // simple query
// connection.query(
//   "SELECT * FROM `users`", 
//   function (err, results, fiedls) {
//     let {id, user_email, user_name, user_contact, user_created_at} = results[0];
//     console.log(id);
//     console.log(user_email);
//     console.log(user_name);
//     console.log(user_contact);
//     console.log(user_created_at);
//   }
// ); 

