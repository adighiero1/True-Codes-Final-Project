import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
//function to get comments
export const getComments = (req, res) => {
  //fetching commenst that belong to the post id from database
  const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
    WHERE c.postId = ? ORDER BY c.createdAt DESC
    `;
  //fetching commenst that belong to the post id
  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  //function to add comment
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    //check our id first if everything is ok we insert
    const q =
      "INSERT INTO comments(`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";
    const values = [
      //values
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
    ];
    //query to create comment
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created.");
    });
  });
};

export const deleteComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const commentId = req.params.id;
    const q = "DELETE FROM comments WHERE `id` = ? AND `userId` = ?";

    db.query(q, [commentId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Comment has been deleted!");
      return res.status(403).json("You can delete only your comment!");
    });
  });
};

/*
this SQL query selects information from two different tables: comments and users. The query retrieves all comments and the corresponding user's information, related to a specific post, as specified by a ? placeholder, which would be replaced with a value at runtime.

The query starts with the SELECT statement, which specifies the columns to be retrieved. In this case, it selects all columns from the comments table (c.*) and the id, name, and profilePic columns from the users table. The AS keyword is used to rename the id column from the users table as userId. This is done to avoid ambiguity since the comments table also has a column named id.

The JOIN clause is used to combine the comments and users tables based on the id column in the users table and the userId column in the comments table. This means that for each comment, the corresponding user's information will also be retrieved. 

The WHERE clause is used to filter the results to only include comments related to the specified post, as indicated by the postId column in the comments table and the second ? placeholder.

Finally, the entire query is sorted by the createdAt column in the comments table in descending order (ORDER BY c.createdAt DESC), which means that the newest comments will appear first in the results. The resulting dataset will include all columns from the comments table, plus the id, name, and profilePic columns from the users table, for all comments related to the specified post, sorted by creation date in descending order.



*/
