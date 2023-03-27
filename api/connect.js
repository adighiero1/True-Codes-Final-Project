import mysql from "mysql";

export const db = mysql.createConnection({
  // exporting db which contains the connection to the database
  host: "localhost",
  user: "root",
  password: "password",
  database: "instabook",
});
