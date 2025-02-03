import express from "express";
import userController from "../controllers/userController.mjs";

const userRouter = express.Router();

userRouter.get("/api/users", userController.authReq);

userRouter.get("/register", userController.createUserHandler);

userRouter.get("/login", userController.loginUserHandler);

export default userRouter;
