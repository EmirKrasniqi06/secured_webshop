import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

// Créer la table t_user si elle n'existe pas
const createTableIfNotExists = async (connection) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS t_user (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      passwordHash VARCHAR(255) NOT NULL,
      salt VARCHAR(255) NOT NULL,
      isAdmin BOOLEAN DEFAULT FALSE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await connection.execute(createTableQuery);
};

const connectDB = async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    port: 6033,
    user: "root",
    password: "root",
    database: "db_webshop",
  });

  console.log("MySQL connected...");

  await createTableIfNotExists(connection);

  await seedAdminUser(connection);

  return connection;
};

const seedAdminUser = async (connection) => {
  const [rows] = await connection.execute(
    "SELECT * FROM t_user WHERE username = ?",
    ["admin"]
  );

  if (rows.length === 0) {
    const username = "admin";
    const password = "admin";
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    const [result] = await connection.execute(
      "INSERT INTO t_user (username, passwordHash, salt, isAdmin) VALUES (?, ?, ?, ?)",
      [username, passwordHash, salt, true]
    );

    console.log("Admin user created with ID:", result.insertId);
  } else {
    console.log("Admin user already exists.");
  }
};

const createUser = async (username, passwordHash, salt, isAdmin = false) => {
  const connection = await connectDB();
  const [result] = await connection.execute(
    "INSERT INTO t_user (username, passwordHash, salt, isAdmin) VALUES (?, ?, ?, ?)",
    [username, passwordHash, salt, isAdmin]
  );
  return result;
};

const findUser = async (username) => {
  const connection = await connectDB();
  const [rows] = await connection.execute(
    "SELECT * FROM t_user WHERE username = ?",
    [username]
  );
  return rows[0];
};

const findUserById = async (id) => {
  const connection = await connectDB();
  const [rows] = await connection.execute("SELECT * FROM t_user WHERE id = ?", [
    id,
  ]);
  return rows[0];
};

const getAllUsers = async () => {
  const connection = await connectDB();
  const [rows] = await connection.execute("SELECT * FROM t_user");
  return rows;
};

const searchByUsername = async (search) => {
  const connection = await connectDB();
  const [rows] = await connection.execute(
    "SELECT * FROM t_user WHERE username LIKE ?",
    [`%${search}%`]
  );
  return rows;
};

export {
  connectDB,
  createUser,
  findUser,
  findUserById,
  getAllUsers,
  searchByUsername,
};
