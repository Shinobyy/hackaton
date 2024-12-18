require("dotenv").config();

const pgp = require("pg-promise")();
const db = pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function setupTables() {
  // Créer la table Client avec les colonnes total_factures et montant_total
  await db.none(`
      CREATE TABLE IF NOT EXISTS Client (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        entreprise VARCHAR(255) NOT NULL,
        total_factures INT DEFAULT 0,
        montant_total NUMERIC(10, 2) DEFAULT 0
      );
    `);

  // Vérifier et ajouter les colonnes si elles n'existent pas
  await db.none(`
      DO $$
      BEGIN
        -- Ajouter total_factures si la colonne n'existe pas
        IF NOT EXISTS (
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name='client' AND column_name='total_factures'
        ) THEN
          ALTER TABLE Client ADD COLUMN total_factures INT DEFAULT 0;
        END IF;
  
        -- Ajouter montant_total si la colonne n'existe pas
        IF NOT EXISTS (
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name='client' AND column_name='montant_total'
        ) THEN
          ALTER TABLE Client ADD COLUMN montant_total NUMERIC(10, 2) DEFAULT 0;
        END IF;
      END $$;
    `);

  // Créer la table Invoice
  await db.none(`
      CREATE TABLE IF NOT EXISTS Invoice (
        id SERIAL PRIMARY KEY,
        client_id INT REFERENCES Client(id) ON DELETE CASCADE,
        date_envoi DATE NOT NULL,
        status VARCHAR(20) CHECK (status IN ('Payée', 'Annulée', 'Envoyée')) NOT NULL,
        montant NUMERIC(10, 2) NOT NULL
      );
    `);

  // Mettre à jour les valeurs de total_factures et montant_total dans la table Client
  await db.none(`
      UPDATE Client
      SET total_factures = COALESCE((
        SELECT COUNT(*) FROM Invoice WHERE client_id = Client.id
      ), 0),
      montant_total = COALESCE((
        SELECT SUM(montant) FROM Invoice WHERE client_id = Client.id
      ), 0);
    `);
}

setupTables()
  .then(() => {
    console.log("Tables configurées avec succès.");
  })
  .catch((err) => {
    console.error("Erreur lors de la configuration des tables :", err);
  });

module.exports = db;
