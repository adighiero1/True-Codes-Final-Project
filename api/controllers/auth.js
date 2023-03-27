import { db } from "../connect.js"; //importing connect js which lets us connect database
import bcrypt from "bcryptjs"; // to hash the password
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  //CHECK USER IF EXISTS
  // using "?"" provides extra security rather than using req.body.username
  const q = "SELECT * FROM users WHERE username = ?";
  //values are req.body.username
  // taking inputs username email password and name inside req.body.username
  //to do this we use middleware express.json
  db.query(q, [req.body.username], (err, data) => {
    //passing q to the query
    if (err) return res.status(500).json(err); //if error send this
    if (data.length) return res.status(409).json("User already exists!"); // if exists
    //CREATE A NEW USER
    //Hash the password
    const salt = bcrypt.genSaltSync(10); //creating a salt that adds random characters to the password
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    // we are hasing a password. the password is req.body.password and we pass in the salt and this function returns an encrypted password
    const q =
      "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";
    //this array contains the values we are inserting.

    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];

    db.query(q, [values], (err, data) => {
      //query to insert the values
      if (err) return res.status(500).json(err); //if error return this
      return res.status(200).json("User has been created."); //if no error
    });
  });
};

export const login = (req, res) => {
  // how to login
  const q = "SELECT * FROM users WHERE username = ?"; //

  db.query(q, [req.body.username], (err, data) => {
    //query to log in checking username
    if (err) return res.status(500).json(err); //if error send this
    if (data.length === 0) return res.status(404).json("User not found!");
    //if data.length is zero we dont have any user like that we send that error
    const checkPassword = bcrypt.compareSync(
      //if there is no error we can check password. sending body request and password and user passrod ind our db
      req.body.password, //if body password equals the password in database
      data[0].password //we check data[0] because the array will only contain one user
    );

    if (!checkPassword)
      //if checked password is not correct
      return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ id: data[0].id }, "secretkey"); //creatint token. sending user id as the id for this token

    const { password, ...others } = data[0]; //descruturing our user because we don't want to send our password even if it is hashed.

    res
      .cookie("accessToken", token, {
        //sending and taking our cookies through the website. random script cannot use our cookie
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res //we delete our cookie to logout
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none", //this becaue our api and client are different ports
    })
    .status(200)
    .json("User has been logged out.");
};
