import express from "express";
import { login, register, logout } from "../controllers/auth.js"; //importing authenitcation functions
//we will make login and register processes here not in users
const router = express.Router();
//to login register and logout
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
//using functions from controles to perfrom operations. all from auth.js
export default router;
