// Importer les modules
import express from "express";
import https from "https";
import fs from "fs";
import userRouter from "./routes/User.mjs";

const app = express();

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
https.createServer(options, app).listen(443, () => {
  console.log("Serveur HTTPS démarré sur le port 443");
});
