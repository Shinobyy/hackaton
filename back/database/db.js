const pgp = require("pg-promise")();
const db = pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function setupTables() {
  try {
    // Créer la table client avec les colonnes total_factures et montant_total
    await db.none(`
      CREATE TABLE IF NOT EXISTS client (
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
          ALTER TABLE client ADD COLUMN total_factures INT DEFAULT 0;
        END IF;

        -- Ajouter montant_total si la colonne n'existe pas
        IF NOT EXISTS (
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name='client' AND column_name='montant_total'
        ) THEN
          ALTER TABLE client ADD COLUMN montant_total NUMERIC(10, 2) DEFAULT 0;
        END IF;
      END $$;
    `);

    // Créer la table invoice
    await db.none(`
      CREATE TABLE IF NOT EXISTS invoice (
        id SERIAL PRIMARY KEY,
        client_id INT REFERENCES client(id) ON DELETE CASCADE,
        date_envoi DATE NOT NULL,
        status VARCHAR(20) CHECK (status IN ('Payée', 'Annulée', 'Envoyée')) NOT NULL,
        montant NUMERIC(10, 2) NOT NULL
      );
    `);

    // Mettre à jour les valeurs de total_factures et montant_total dans la table client
    await db.none(`
      UPDATE client
      SET total_factures = COALESCE((
        SELECT COUNT(*) FROM invoice WHERE client_id = client.id
      ), 0),
      montant_total = COALESCE((
        SELECT SUM(montant) FROM invoice WHERE client_id = client.id
      ), 0);
    `);

    console.log("Tables configurées avec succès.");
    return db; // Retourner l'instance de base de données
  } catch (error) {
    console.error("Erreur lors de la configuration des tables :", error);
    throw error; // Relancer l'erreur pour la gestion des tests
  }
}

// Pour les environnements de test, ajoutez une méthode de nettoyage
async function cleanupTables() {
  try {
    await db.none("DROP TABLE IF EXISTS invoice");
    await db.none("DROP TABLE IF EXISTS client");
    console.log("Tables supprimées avec succès.");
  } catch (error) {
    console.error("Erreur lors de la suppression des tables :", error);
    throw error;
  }
}

// Uniquement pour les tests
if (process.env.NODE_ENV === "test") {
  module.exports = {
    db,
    setupTables,
    cleanupTables,
  };
} else {
  // Pour l'environnement de production ou développement
  setupTables()
    .then(() => {
      console.log("Tables configurées avec succès.");
    })
    .catch((err) => {
      console.error("Erreur lors de la configuration des tables :", err);
    });

  module.exports = db;
}
