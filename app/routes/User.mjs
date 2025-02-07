import express from "express";
import userController from "../controllers/userController.mjs";
import path from "path";
import { fileURLToPath } from "url";
import auth from "../middleware/auth.mjs";
import redirectIfAuthenticated from "../middleware/redirectIfAuthenticated.mjs";
import passport from "passport";

const userRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
userRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Route pour afficher la page de profil de l'utilisateur (protégée par le middleware d'authentification)
userRouter.get("/profile", auth, (req, res) => {
  res.render("profile", { name: req.user.username });
});

export default userRouter;
