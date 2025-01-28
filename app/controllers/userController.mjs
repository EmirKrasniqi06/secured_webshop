// Fonction de récupération de tous les utilisateurs
const getUsers = (req, res) => {
  // Afficher la liste des utilisateurs dans index.html
  res.sendFile("public/index.html", { root: "./" });
};

// Fonction de création d'un utilisateur
const createUser = (req, res) => {
  res.json({ message: "Utilisateur créé" });
};

// Fonction de login d'un utilisateur
const loginUser = (req, res) => {
  res.json({ message: "Utilisateur connecté" });
};

// Export des fonctions
export default { getUsers, createUser };
