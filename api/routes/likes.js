import express from "express";
import { getLikes, addLike, deleteLike } from "../controllers/like.js";

const router = express.Router();

router.get("/", getLikes); //importing like function from controllers like
router.post("/", addLike); //importing like function from controllers like
router.delete("/", deleteLike); //importing delete function from controllers like

export default router;
