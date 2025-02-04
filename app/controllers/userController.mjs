import { log } from "console";
import { createUser, findUser } from "../db/db.mjs"; // Importer les fonctions de gestion des utilisateurs

// Fonction de récupération de tous les utilisateurs
const authReq = (req, res) => {
  res.sendFile("public/index.html", { root: "./" });
};

// Fonction de création d'un utilisateur
const createUserHandler = async (req, res) => {
  const { username, password } = req.body;
  try {
    await createUser(username, password);
    res.redirect("/auth?form=login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Fonction de connection d'un utilisateur
const loginUserHandler = async (req, res) => {
  console.log(req.body);

  res
    .status(200)
    .sendFile("views/auth.html", { root: "./", formType: "login" });

  // Créer deux page login et register
};

// Export des fonctions
export default { authReq, createUserHandler, loginUserHandler };
