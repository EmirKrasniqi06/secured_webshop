import express from "express";
import userController from "../controllers/userController.mjs";
import path from "path";
import { fileURLToPath } from "url";
import auth from "../middleware/auth.mjs";
import redirectIfAuthenticated from "../middleware/redirectIfAuthenticated.mjs";
import passport from "passport";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUser, getAllUsers } from "../db/db.mjs"; // Assurez-vous que cette fonction est correctement importée
import authenticateJWT from "../middleware/auth.mjs";

const userRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
  };
  const secret = process.env.JWT_SECRET || "your_jwt_secret";
  const options = {
    expiresIn: "1h", // Le token expirera dans 1 heure
  };
  return jwt.sign(payload, secret, options);
};

// Route pour afficher le formulaire d'inscription
userRouter.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/auth/register.html"));
});

// Route pour gérer la soumission du formulaire d'inscription
userRouter.post("/register", userController.createUserHandler);

// Route pour afficher le formulaire de connexion
userRouter.get("/login", redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/auth/login.html"));
});

// Route pour gérer la soumission du formulaire de connexion
userRouter.post("/login", userController.loginUserHandler);

// Route pour afficher la page de profil de l'utilisateur (protégée par le middleware d'authentification)
userRouter.get("/profile", authenticateJWT, async (req, res) => {
  let users = [];
  if (req.user.isAdmin) {
    users = await getAllUsers();
  }
  res.render("profile", { name: req.user.username, users });
});

// Route pour gérer la déconnexion
userRouter.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/login");
});

export default userRouter;
