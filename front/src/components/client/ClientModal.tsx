import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

function ClientModal() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    entreprise: "",
    total_factures: 0,
    montant_total: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.entreprise ||
      formData.total_factures === 0 ||
      !formData.montant_total
    ) {
      alert("Tous les champs doivent être remplis.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/clients/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Client créé avec succès");
        // Vous pouvez fermer le modal ici si nécessaire
      } else {
        alert(`Erreur: ${result.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
      alert("Une erreur est survenue lors de la création.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Créer un client</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouveau client</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col">
              <input
                placeholder="Nom du client"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                placeholder="Email du client"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                placeholder="Entreprise du client"
                type="text"
                name="entreprise"
                value={formData.entreprise}
                onChange={handleChange}
              />
              <input
                placeholder="Total factures"
                type="number"
                name="total_factures"
                value={formData.total_factures}
                onChange={handleChange}
              />
              <input
                placeholder="Montant total"
                type="number"
                name="montant_total"
                value={formData.montant_total}
                onChange={handleChange}
              />
              <Button onClick={handleSubmit}>Créer</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ClientModal;
