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
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

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
    setMessage(null);

    if (
      !formData.client_id ||
      !formData.date_envoi ||
      !formData.status ||
      !formData.montant
    ) {
      setMessage({
        text: "Tous les champs doivent être remplis.",
        type: "error",
      });
      return;
    }

    try {
      const formattedData = {
        ...formData,
        date_envoi: formatDate(formData.date_envoi),
      };

      const response = await fetch(
        `http://localhost:3000/update/${invoice?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setMessage({
          text: "Facture mise à jour avec succès",
          type: "success",
        });
      } else {
        setMessage({ text: `Erreur: ${result.message}`, type: "error" });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la facture:", error);
      setMessage({
        text: "Une erreur est survenue lors de la mise à jour.",
        type: "error",
      });
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const [day, month, year] = date.split("/");
      return `${year}-${month}-${day}`;
    }

    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return "";
      }
      return parsedDate.toISOString().split("T")[0];
    } catch (error) {
      console.error("Erreur de parsing de la date:", error);
      return "";
    }
  };

  if (!invoice) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-yellow-500 text-white hover:bg-yellow-600 transition-colors">
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Modifier la facture
          </DialogTitle>
          <DialogDescription>
            {message && (
              <div
                className={`p-3 rounded-md mb-4 ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <select
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <Button
                type="submit"
                className="w-full py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
              >
                Mettre à jour
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default EditModal;
