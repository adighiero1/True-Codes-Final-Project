import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
//function to get posts
export const getPosts = (req, res) => {
  const userId = req.query.userId; //we will user userId for the sql query
  const token = req.cookies.accessToken; //checking cookies
  if (!token) return res.status(401).json("Not logged in!"); //if there is no token we send error becasue it means you are not logged in

  jwt.verify(token, "secretkey", (err, userInfo) => {
    //if there is token we validate because it expires. there for there can be an error or it can return data
    if (err) return res.status(403).json("Token is not valid!"); //if there is error there is token but not valid. if everything is ok it will return user info

    //in auth.js in the token we sent data[0].id which is the user info. if we say userinfo.id we will be able to reach this user id
    console.log(userId);

    const q = //query combining tables post and users
      userId !== "undefined" // if there is a user id it means we are in profile page so we are NOT going to select our timeline posts we are going to select all posts belonging to this user
        ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
    ORDER BY p.createdAt DESC`;
    //AS u ON () is the condition to only select the owner of this post. then we grab all the data
    //Join relationships AS r is to get the information on who is following
    //we get user id from the web token
    const values = //if there is a user id use only user id if its not use current user id
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      //query to get the post information
      if (err) return res.status(500).json(err);
      return res.status(200).json(data); //if no error res is 200 and returns the data
    });
  });
};

export const addPost = (req, res) => {
  //function to add post
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = //query to insert post.
      "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      //values
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), //moment library to display date and time and turining it into sql
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      //query
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created."); //if everything ok post has been created
    });
  });
};
export const deletePost = (req, res) => {
  //function to delete post
  const token = req.cookies.accessToken; //veryfing token
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    //query to delete post. the post id must match user id because it has to be our post
    const q = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";
    //req.params.id is passing
    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        //if the affected rows bigger than 0 it means we updated user. if not it means its not our post
        return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post");
    });
  });
};

/*
The first part of the query (SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ?) retrieves all columns (*) from the posts table and the id, name, and profilePic columns from the users table. The JOIN clause is used to combine the posts and users tables based on the id column in the users table and the userId column in the posts table. This means that for each post, the corresponding user's information will also be retrieved. The WHERE clause filters the results to only include posts by the specific user, as indicated by the first ? placeholder.

The second part of the query (LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?) adds a LEFT JOIN clause to include data from the relationships table. This table likely represents the relationships between users, such as who is following whom. The ON clause specifies that the relationship table should be joined based on the userId column in the posts table and the followedUserId column in the relationships table. The WHERE clause filters the results to include posts by the specified user or by users who are being followed by the specified user, as indicated by the two ? placeholders.

Finally, the entire query is sorted by the createdAt column in the posts table in descending order (ORDER BY p.createdAt DESC), which means that the newest posts will appear first in the results. The resulting dataset will include all columns from the posts table, plus the id, name, and profilePic columns from the users table, for all posts by the specified user or by users being followed by the specified user, sorted by creation date in descending order.




*/
