import { createUser, findUser } from "../db/db.mjs"; // Importer les fonctions de gestion des utilisateurs
import bcrypt from "bcrypt"; // Importer le module bcrypt pour le hachage du mot de passe
import jwt from "jsonwebtoken"; // Importer le module jsonwebtoken pour créer des tokens JWT

// Fonction de récupération de tous les utilisateurs
const authReq = (req, res) => {
  res.sendFile("views/index.html", { root: "./" });
};

// Fonction de création de l'utilisateur
const createUserHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validez les données ici (par exemple, vérifiez si le mot de passe est assez long, etc.)
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insérez l'utilisateur dans la base de données
    const result = await createUser(username, hashedPassword, salt);

    res.status(201).json({
      message: "User created successfully",
      user: { id: result.insertId, username },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Fonction de connexion de l'utilisateur
const loginUserHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Recherchez l'utilisateur dans la base de données
    const user = await findUser(username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Vérifiez le mot de passe
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
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
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Export des fonctions
export default { authReq, createUserHandler, loginUserHandler };
