// Importer les modules nécessaires
import express from "express"; // Module express pour créer un serveur
import https from "https"; // Module https pour créer un serveur HTTPS
import fs from "fs"; // Module fs pour lire les fichiers
import userRouter from "./routes/User.mjs"; // Contrôleur de authentification
import { connectDB, findUser, findUserById } from "./db/db.mjs"; // Fonctions de gestion des utilisateurs
import session from "express-session"; // Module express-session pour gérer les sessions
import passport from "passport"; // Module passport pour l'authentification
import { Strategy as LocalStrategy } from "passport-local"; // Stratégie locale de Passport
import path from "path"; // Module path pour gérer les chemins de fichiers
import { fileURLToPath } from "url"; // Module fileURLToPath pour convertir les URL en chemins de fichiers
import crypto from "crypto"; // Module crypto pour générer des chaînes aléatoires
import bcrypt from "bcrypt"; // Module bcrypt pour hacher les mots de passe
import dotenv from "dotenv"; // Module dotenv pour charger les variables d'environnement

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

// Configuration de la session
const secret =
  process.env.SESSION_SECRET || crypto.randomBytes(64).toString("hex");

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuration de la stratégie locale de Passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await findUser(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      // Vérifiez le mot de passe ici (par exemple, en utilisant bcrypt)
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Sérialisation et désérialisation de l'utilisateur
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id); // Implémentez findUserById pour récupérer l'utilisateur par ID
    done(null, user);
  } catch (err) {
    done(err);
  }
});

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
  console.log(`Serveur HTTPS démarré sur le port ${PORT}`);
});
