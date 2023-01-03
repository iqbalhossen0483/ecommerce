import mysql from "mysql2/promise";

export async function mySql() {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "diaryofmind_iqbal",
    database: "diaryofmind_iqbal",
    password: "rPg#];Bb+~Gn",
    connectionLimit: 10,
    waitForConnections: true,
  });
  return db;
}
// export async function mySql() {
//   const db = await mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     database: "ecommerce",
//     password: "",
//     connectionLimit: 10,
//     waitForConnections: true,
//   });

//   return db;
// }

export const queryDocument = async (query) => {
  const connection = await mySql();
  const result = await connection.execute(query);
  await connection.end();
  return result[0];
};

export const postDocument = async (query, doc, option = undefined) => {
  const connection = await mySql();
  let data = "";
  Object.entries(doc).forEach(([key, value]) => {
    if (data) {
      data += `, ${key} = '${value}'`;
    } else data += `${key} = '${value}'`;
  });
  if (option) data += option;
  const result = await connection.execute(query + data);
  await connection.end();
  return result[0];
};
