const db = require("../database/db");

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await db.any("SELECT * FROM invoice");
    res.json(invoices);
  } catch (error) {
    console.error("Erreur lors de la récupération des factures :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération des factures" });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const { client_id, date_envoi, status, montant } = req.body;

    // Validation des champs requis
    if (!client_id || !date_envoi || !status || !montant) {
      return res.status(400).json({
        message:
          "Tous les champs sont obligatoires : client_id, date_envoi, status, montant",
      });
    }

    // Vérifier si le client existe
    const clientExists = await db.oneOrNone(
      "SELECT id FROM client WHERE id = $1",
      [client_id]
    );

    if (!clientExists) {
      return res.status(404).json({
        message: `Aucun client trouvé avec l'ID ${client_id}`,
      });
    }

    const newInvoice = await db.one(
      "INSERT INTO invoice (client_id, date_envoi, status, montant) VALUES ($1, $2, $3, $4) RETURNING *",
      [client_id, date_envoi, status, montant]
    );

    res.status(201).json(newInvoice);
  } catch (error) {
    console.error("Erreur lors de la création de la facture :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la création de la facture" });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { client_id, date_envoi, status, montant } = req.body;

    // Validation des champs requis
    if (!client_id || !date_envoi || !status || !montant) {
      return res.status(400).json({
        message:
          "Tous les champs sont obligatoires : client_id, date_envoi, status, montant",
      });
    }

    // Vérifier si le client existe
    const clientExists = await db.oneOrNone(
      "SELECT id FROM client WHERE id = $1",
      [client_id]
    );

    if (!clientExists) {
      return res.status(404).json({
        message: `Aucun client trouvé avec l'ID ${client_id}`,
      });
    }

    const updatedInvoice = await db.oneOrNone(
      "UPDATE invoice SET client_id = $1, date_envoi = $2, status = $3, montant = $4 WHERE id = $5 RETURNING *",
      [client_id, date_envoi, status, montant, id]
    );

    if (!updatedInvoice) {
      return res.status(404).json({
        message: `Aucune facture trouvée avec l'ID ${id}`,
      });
    }

    res.json(updatedInvoice);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la facture :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la mise à jour de la facture" });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.result("DELETE FROM invoice WHERE id = $1", [id]);

    // Vérifier si une facture a été supprimée
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: `Aucune facture trouvée avec l'ID ${id}`,
      });
    }

    res.json({
      message: "Facture supprimée avec succès",
      deletedCount: result.rowCount,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la facture :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la suppression de la facture" });
  }
};

// Méthode supplémentaire pour récupérer une facture par ID
exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await db.oneOrNone("SELECT * FROM invoice WHERE id = $1", [
      id,
    ]);

    if (!invoice) {
      return res.status(404).json({
        message: `Aucune facture trouvée avec l'ID ${id}`,
      });
    }

    res.json(invoice);
  } catch (error) {
    console.error("Erreur lors de la récupération de la facture :", error);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération de la facture",
    });
  }
};

// Méthode pour récupérer les factures d'un client spécifique
exports.getInvoicesByClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Vérifier si le client existe
    const clientExists = await db.oneOrNone(
      "SELECT id FROM client WHERE id = $1",
      [clientId]
    );

    if (!clientExists) {
      return res.status(404).json({
        message: `Aucun client trouvé avec l'ID ${clientId}`,
      });
    }

    const invoices = await db.any(
      "SELECT * FROM invoice WHERE client_id = $1",
      [clientId]
    );

    res.json(invoices);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des factures du client :",
      error
    );
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des factures du client",
    });
  }
};
