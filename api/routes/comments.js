import express from "express";
import {
  getComments,
  addComment,
  deleteComment,
} from "../controllers/comment.js";

const router = express.Router();

router.get("/", getComments); //route to get comments from controllers/comment
router.post("/", addComment); //route to add comment from controllers/comment
router.delete("/:id", deleteComment);

export default router;
