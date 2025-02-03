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
  const { username, password } = req.body;
  try {
    const user = await findUser(username, password);
    if (user) {
      res.redirect("/auth?form=login");
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Export des fonctions
export default { authReq, createUserHandler, loginUserHandler };
