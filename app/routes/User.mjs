import express from "express";
import userController from "../controllers/userController.mjs";

const userRouter = express.Router();

userRouter.get("/", userController.getUsers);

export default userRouter;
