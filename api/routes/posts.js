import express from "express";
import { getPosts, addPost, deletePost } from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts); //function to get posts imported from controller
router.post("/", addPost); //function to add post and date
router.delete("/:id", deletePost);

export default router;
