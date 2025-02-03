import express from "express";
import userController from "../controllers/userController.mjs";

const userRouter = express.Router();

userRouter.get("/user", userController.authReq);

userRouter.get("/register", userController.createUser);

userRouter.get("/login", userController.loginUser);

export default userRouter;
