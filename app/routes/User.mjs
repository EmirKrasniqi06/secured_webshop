import express from "express";
import userController from "../controllers/userController.mjs";

const userRouter = express.Router();

userRouter.get("/", userController.getUsers);

userRouter.get("/register", userController.createUser);

userRouter.get("/login", userController.loginUser);

export default userRouter;
