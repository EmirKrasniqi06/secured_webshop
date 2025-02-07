import mysql from "mysql2/promise";

const connectDB = async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    port: 6033,
    user: "root",
    password: "root",
    database: "db_webshop",
  });

  console.log("MySQL connected...");
  return connection;
};

const createUser = async (username, password, salt) => {
  const connection = await connectDB();
  const [result] = await connection.execute(
    "INSERT INTO t_user (username, passwordHash, salt) VALUES (?, ?, ?)",
    [username, password, salt]
  );
  return result;
};

const findUser = async (username, password) => {
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

export { connectDB, createUser, findUser, findUserById };
