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
  email: string;
  entreprise: string;
  total_factures: number;
  montant_total: string;
}

interface ClientEditModalProps {
  client: Client | null;
}

function ClientEditModal({ client }: ClientEditModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    entreprise: "",
    total_factures: 0,
    montant_total: "",
  });

  // Mettre à jour formData uniquement lorsque client change
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        entreprise: client.entreprise,
        total_factures: client.total_factures,
        montant_total: client.montant_total,
      });
    }
  }, [client]); // Ne dépend plus de formData

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const response = await fetch(
        `http://localhost:3000/clients/update/${client?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Client mis à jour avec succès");
      } else {
        alert(`Erreur: ${result.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };

  if (!client) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Modifier</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le client</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit} className="flex flex-col">
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
              <Button type="submit">Mettre à jour</Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ClientEditModal;
