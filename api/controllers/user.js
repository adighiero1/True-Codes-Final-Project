import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  //function to get the user
  //function we export to be used in routes
  const userId = req.params.userId; //grabbing user id
  const q = "SELECT * FROM users WHERE id=?"; //we are passing this user id

  //quering the database for the user
  db.query(q, [userId], (err, data) => {
    //if there is an error
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0]; //if everything is ok we destructure user and grab only the information, excluding the password
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  //function to update user
  const token = req.cookies.accessToken; //taking token
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    //query to update the table of  user
    const q =
      "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

    //query to update the user here
    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.coverPic,
        req.body.profilePic,
        userInfo.id, //the WHERE id=? is this user.Info.id
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        //this means if the affected rows is greateer than 0 we can return our response
        if (data.affectedRows > 0) return res.json("Updated!");
        // if the rows where not affected it means it was not our id and we cannot update
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};
