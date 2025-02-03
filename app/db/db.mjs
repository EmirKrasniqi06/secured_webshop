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

const createUser = async (username, password) => {
  const connection = await connectDB();
  const [result] = await connection.execute(
    "INSERT INTO t_user (username, passwordHash) VALUES (?, ?)",
    [username, password]
  );
  return result;
};

const findUser = async (username, password) => {
  const connection = await connectDB();
  const [rows] = await connection.execute(
    "SELECT * FROM t_user WHERE username = ? AND passwordHash = ?",
    [username, password]
  );
  return rows[0];
};

export { connectDB, createUser, findUser };
