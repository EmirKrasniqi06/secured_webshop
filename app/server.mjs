// Importer les modules nécessaires
import express from "express"; // Module express pour créer un serveur
import https from "https"; // Module https pour créer un serveur HTTPS
import fs from "fs"; // Module fs pour lire les fichiers
import userRouter from "./routes/User.mjs"; // Contrôleur de authentification
import { connectDB } from "./db/db.mjs"; // Fonctions de gestion des utilisateurs
import path from "path"; // Module path pour gérer les chemins de fichiers
import { fileURLToPath } from "url"; // Module fileURLToPath pour convertir les URL en chemins de fichiers
import dotenv from "dotenv"; // Module dotenv pour charger les variables d'environnement
import cookieParser from "cookie-parser"; // Module cookie-parser pour parser les cookies

dotenv.config(); // Charger les variables d'environnement

const app = express();
const PORT = 443;

// Connecter à la base de données
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware pour parser le corps des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utiliser cookie-parser
app.use(cookieParser());

// Configurer le moteur de template EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware pour servir les fichiers statiques
app.use(express.static("views"));

// Utiliser les routes définies
app.use("/", userRouter);

// Charger les certificats SSL
const options = {
  key: fs.readFileSync("certs/key.pem"),
  cert: fs.readFileSync("certs/cert.pem"),
};

// Démarrage du serveur sur le port 443
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
