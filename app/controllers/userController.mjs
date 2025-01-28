// Fonction de récupération de tous les utilisateurs
const getUsers = (req, res) => {
  // Afficher la liste des utilisateurs dans index.html
  res.sendFile("public/index.html", { root: "./" });
};

// Fonction de création d'un utilisateur
const createUser = (req, res) => {
  res.sendFile("view/register.html", { root: "./" });
};

// Fonction de connection d'un utilisateur
const loginUser = (req, res) => {
  res.sendFile("view/login.html", { root: "./" });
};

// Export des fonctions
export default { getUsers, createUser };
