// Importer les modules
import express from "express";
import https from "https";
import fs from "fs";
import userRouter from "./routes/User.mjs";

const app = express();

// Charger les certificats SSL
const options = {
  key: fs.readFileSync("certs/key.pem"),
  cert: fs.readFileSync("certs/cert.pem"),
};

// Utiliser les routes définies
app.use("/users", userRouter);

// Route de test
app.get("/", (req, res) => {
  res.send("Bienvenue sur votre serveur sécurisé en HTTPS !");
});

// Démarrage du serveur sur le port 443
https.createServer(options, app).listen(443, () => {
  console.log("Serveur HTTPS démarré sur le port 443");
});
