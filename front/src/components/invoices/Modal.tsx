import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface Client {
  id: number;
  name: string;
}

function Modal() {
  const [clientNames, setClientNames] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    client_id: "",
    date_envoi: "",
    montant: "",
    status: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/clients");
        const data = await response.json();
        setClientNames(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchData();
  }, []);

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
    if (!formData.client_id || !formData.date_envoi || !formData.montant) {
      alert("Tous les champs doivent être remplis.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Facture créée avec succès");
        // Ici vous pouvez fermer le modal si nécessaire
      } else {
        alert(`Erreur: ${result.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      alert("Une erreur est survenue lors de la création.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Créer une facture</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle facture</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col">
              <select
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
              >
                <option value="" disabled>
                  --Choisir un client--
                </option>
                {clientNames.map((client: Client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              <input
                placeholder="Date d'envoi"
                type="date"
                name="date_envoi"
                value={formData.date_envoi}
                onChange={handleChange}
              />
              <input
                placeholder="Montant"
                type="number"
                name="montant"
                value={formData.montant}
                onChange={handleChange}
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Envoyée">Envoyée</option>
                <option value="Payée">Payée</option>
                <option value="Annulée">Annulée</option>
              </select>
              <Button onClick={handleSubmit}>Créer</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
