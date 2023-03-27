import express from "express";
import { getUser, updateUser } from "../controllers/user.js"; // importing the functions we use at the bottom from the user.js controller file

const router = express.Router();

router.get("/find/:userId", getUser); // find a specific user using getUser
router.put("/", updateUser); //update user function from controlers user.js

// we can use user router in our index file and make any API request here

export default router;
