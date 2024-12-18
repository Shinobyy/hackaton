require("dotenv").config();
const pgp = require("pg-promise")();

const db = pgp({
  host: "127.0.0.1",
  port: "5432",
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

(async () => {
  try {
    const result = await db.one("SELECT NOW() AS current_time");
    console.log("Connexion réussie à PostgreSQL : ", result.current_time);
  } catch (error) {
    console.error("Erreur de connexion à PostgreSQL :", error.message);
  } finally {
    pgp.end();
  }
})();
