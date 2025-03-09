import mysql from "mysql2/promise";
import "dotenv/config";

// const sqlConfig = {
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT as string),
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
// };
const sqlConfig = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "rekolekcje",
  waitForConnections: true,
};

// console.log(sqlConfig);
export const db = mysql.createPool(sqlConfig);

export async function query(query: string, values: any[]) {
  const [rows, fields] = await db.query(query, values);
  return rows;
}
