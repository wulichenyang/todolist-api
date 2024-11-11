const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const getConnection = async () => {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
};

module.exports = { getConnection };