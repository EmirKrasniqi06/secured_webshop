import { createUser, findUser, searchByUsername } from "../db/db.mjs"; // Importer les fonctions de gestion des utilisateurs
import bcrypt from "bcrypt"; // Importer le module bcrypt pour le hachage du mot de passe
import jwt from "jsonwebtoken"; // Importer le module jsonwebtoken pour créer des tokens JWT

// Fonction de récupération de tous les utilisateurs
const authReq = (req, res) => {
  res.sendFile("views/index.html", { root: "./" });
};

// Fonction de création de l'utilisateur
const createUserHandler = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    // Validez les données ici (par exemple, vérifiez si le mot de passe est assez long, etc.)
    if (!username || !password || !confirmPassword) {
      return res.redirect(
        "/register?error=Username, password, and confirmation are required!"
      );
    }

    // Vérifiez si le mot de passe et sa confirmation sont égaux
    if (password !== confirmPassword) {
      return res.redirect("/register?error=Passwords do not match!");
    }

    // Recherchez l'utilisateur dans la base de données
    const existingUser = await findUser(username);

    if (existingUser) {
      return res.redirect("/register?error=Username already exists!");
    }

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insérez l'utilisateur dans la base de données
    const result = await createUser(username, hashedPassword, salt);

    // Rediriger vers la page de login avec un message de succès
    res.redirect("/login?success=User registered successfully! Please log in.");
  } catch (error) {
    res.redirect("/register?error=Error creating user");
  }
};

// Fonction de connexion de l'utilisateur
const loginUserHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Recherchez l'utilisateur dans la base de données
    const user = await findUser(username);

    if (!user) {
      return res.redirect("/login?error=User not found !");
    }

    // Vérifiez le mot de passe
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.redirect("/login?error=Invalid credentials !");
    }

    // Générer un token JWT
    const payload = {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };
    const secret = process.env.JWT_SECRET || "your_jwt_secret";
    const options = {
      expiresIn: "1h", // Le token expirera dans 1 heure
    };
    const token = jwt.sign(payload, secret, options);

    // Définir le cookie JWT
    res.cookie("jwt", token, { httpOnly: true, secure: true });

    // Rediriger vers la page de profil
    res.redirect("/profile");
  } catch (error) {
    res.redirect("/login?error=Error logging in");
  }
};

// Fonction de recherche des utilisateurs
const searchUsers = async (search) => {
  try {
    const users = await searchByUsername(search);
    return users;
  } catch (error) {
    console.error("Error searching users:", error); // Ajoutez un log pour l'erreur
    throw error;
  }
};

// Export des fonctions
export default { authReq, createUserHandler, loginUserHandler, searchUsers };
