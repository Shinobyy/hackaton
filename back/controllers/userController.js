const db = require("../database/db");

exports.getUsers = async (req, res) => {
  try {
    const clients = await db.any("SELECT * FROM client");
    res.json(clients);
  } catch (error) {
    console.error("Erreur lors de la récupération des clients :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération des clients" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, entreprise } = req.body;

    const newClient = await db.none(
      "INSERT INTO client (name, email, entreprise) VALUES ($1, $2, $3)",
      [name, email, entreprise]
    );

    res.status(201).json(newClient);
  } catch (error) {
    console.error("Erreur lors de la création du client :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la création du client" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, entreprise } = req.body;

    const updatedClient = await db.none(
      "UPDATE client SET name = $1, email = $2, entreprise = $3 WHERE id = $4",
      [name, email, entreprise, id]
    );

    res.json(updatedClient);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la mise à jour du client" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.none("DELETE FROM client WHERE id = $1", [id]);

    res.json({ message: "Client supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du client :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la suppression du client" });
  }
};
