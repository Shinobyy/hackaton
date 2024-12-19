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

interface EditModalProps {
  invoice: Record<string, any> | null;
}

function EditModal({ invoice }: EditModalProps) {
  const [clientNames, setClientNames] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    client_id: "",
    date_envoi: "",
    status: "",
    montant: "",
  });

  useEffect(() => {
    // Fetching client names for the dropdown
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

  // Only set form data when the invoice is available and formData is empty
  useEffect(() => {
    if (invoice && Object.values(formData).every((value) => value === "")) {
      setFormData({
        client_id: invoice.client_id || "",
        date_envoi: invoice.date_envoi || "",
        status: invoice.status || "",
        montant: invoice.montant || "",
      });
    }
  }, [invoice, formData]);

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
      !formData.client_id ||
      !formData.date_envoi ||
      !formData.status ||
      !formData.montant
    ) {
      alert("Tous les champs doivent être remplis.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/update/${invoice?.id}`,
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
        alert("Facture mise à jour avec succès");
      } else {
        alert(`Erreur: ${result.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la facture:", error);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = parsedDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (!invoice) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Modifier</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la facture</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <select
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
              >
                <option value="" disabled>
                  --Choisir un client--
                </option>
                {clientNames.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              <input
                placeholder="Date d'envoi"
                type="date"
                name="date_envoi"
                value={formatDate(formData.date_envoi)}
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
              <input
                placeholder="Montant"
                type="number"
                name="montant"
                value={formData.montant}
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

export default EditModal;
