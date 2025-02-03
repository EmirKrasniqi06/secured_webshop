// Importer les modules nécessaires
import express from "express"; // Module express pour créer un serveur
import https from "https"; // Module https pour créer un serveur HTTPS
import fs from "fs"; // Module fs pour lire les fichiers
import userRouter from "./routes/User.mjs"; // Contrôleur de authentification
import { connectDB } from "./db/db.mjs"; // Fonction pour la connexion à la base de données

const app = express();
const PORT = 443;

// Connecter à la base de données
connectDB();

// Utiliser les routes définies
app.use("/", userRouter);

// Route pour servir le fichier auth.html
app.get("/auth", (req, res) => {
  res.sendFile("views/auth.html", { root: "./" });
});

// Charger les certificats SSL
const options = {
  key: fs.readFileSync("certs/key.pem"),
  cert: fs.readFileSync("certs/cert.pem"),
};

// Démarrage du serveur sur le port 443
https.createServer(options, app).listen(PORT, () => {
  console.log("Serveur HTTPS démarré sur le port 443");
});
