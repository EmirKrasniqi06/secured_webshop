// Fonction de récupération de tous les utilisateurs

// { root: "./" } permet de spécifier le répertoire racine pour la recherche du fichier

const authReq = (req, res) => {
  // Afficher la liste des utilisateurs dans index.html
  res.sendFile("public/index.html", { root: "./" });
};

// Fonction de création d'un utilisateur
const createUser = (req, res) => {
  res.redirect("/auth?form=register");
};

// Fonction de connection d'un utilisateur
const loginUser = (req, res) => {
  res.redirect("/auth?form=login");
};

// Export des fonctions
export default { authReq, createUser, loginUser };
