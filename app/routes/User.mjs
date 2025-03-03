import express from "express";
import userController from "../controllers/userController.mjs";
import path from "path";
import { fileURLToPath } from "url";
import redirectIfAuthenticated from "../middleware/redirectIfAuthenticated.mjs";
import authenticateJWT from "../middleware/auth.mjs";
import { getAllUsers } from "../db/db.mjs";

const userRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route / qui redirige vers la page profil
userRouter.get("/", (req, res) => {
  res.redirect("/profile");
});

// Route pour afficher le formulaire d'inscription
userRouter.get("/register", (req, res) => {
  const error = req.query.error;
  res.render("auth/register", { error });
});

// Route pour gérer la soumission du formulaire d'inscription
userRouter.post("/register", userController.createUserHandler);

// Route pour afficher le formulaire de connexion
userRouter.get("/login", redirectIfAuthenticated, (req, res) => {
  const successMessage = req.query.success;
  const error = req.query.error;
  res.render("auth/login", { error, successMessage });
});

// Route pour gérer la soumission du formulaire de connexion
userRouter.post("/login", userController.loginUserHandler);

// Route pour afficher la page de profil de l'utilisateur (protégée par le middleware d'authentification)
userRouter.get("/profile", authenticateJWT, async (req, res) => {
  let users = [];
  const search = req.query.search || "";
  if (req.user.isAdmin) {
    users = await userController.searchUsers(search);
  }
  res.render("profile", { name: req.user.username, users, search });
});

// Route pour gérer la déconnexion
userRouter.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/login");
});

export default userRouter;
