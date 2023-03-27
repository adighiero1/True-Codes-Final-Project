import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  //function to get relationships
  //query to get relationships as it pertains to a user. we fetch the follower user id
  const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";
  //passing followed user id into query. using this id we are going to find it's followers
  db.query(q, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json(data.map((relationship) => relationship.followerUserId)); //this returns us an object and we are going to transform this object into user ids
  });
};

export const addRelationship = (req, res) => {
  //function to add relationship
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    //query the table to insert new relationship
    const q =
      "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";
    const values = [userInfo.id, req.body.userId]; //first one is your id because we are the follower. and we will be following req.body.userId

    db.query(q, [values], (err, data) => {
      //doing the query
      if (err) return res.status(500).json(err); //if there is error return error
      return res.status(200).json("Following"); //else return response following
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    //query the table to delete relationships
    const q =
      "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollow");
    });
  });
};
