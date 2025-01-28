// Fonction de récupération de tous les utilisateurs
const getUsers = (req, res) => {
  res.send("Liste des utilisateurs");
};

// Fonction de création d'un utilisateur
const createUser = (req, res) => {
  res.json({ message: "Utilisateur créé" });
};

// Export des fonctions
export default { getUsers, createUser };
