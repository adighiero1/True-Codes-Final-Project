import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  //function to get likes
  const q = "SELECT userId FROM likes WHERE postId = ?";

  db.query(q, [req.query.postId], (err, data) => {
    //query
    if (err) return res.status(500).json(err); //if error return error
    return res.status(200).json(data.map((like) => like.userId)); //else return data. we want this to only contain user id and nothing else so we use map function. we take each like and return like.userId
  });
};

export const addLike = (req, res) => {
  //function to add a like
  const token = req.cookies.accessToken; //verifying json web token
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    //query to insert like. we are going to add userId and postId
    const q = "INSERT INTO likes (`userId`,`postId`) VALUES (?)";
    const values = [userInfo.id, req.body.postId];

    db.query(q, [values], (err, data) => {
      //query to add the like
      if (err) return res.status(500).json(err); //if there is error
      return res.status(200).json("Post has been liked."); //else return this data
    });
  });
};

export const deleteLike = (req, res) => {
  //function to delete like
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    //delete condition where the user id = post id
    const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

    //user info is the user id and the post id is req.
    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      //query to deelte
      if (err) return res.status(500).json(err); //if there is error
      return res.status(200).json("Post has been disliked."); //e;se send this data
    });
  });
};
