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
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

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
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (
      !formData.name ||
      !formData.email ||
      !formData.entreprise ||
      formData.total_factures < 0 ||
      !formData.montant_total.trim()
    ) {
      setMessage({
        text: "Tous les champs doivent être remplis.",
        type: "error",
      });
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
        setMessage({ text: "Client mis à jour avec succès", type: "success" });
        window.location.reload();
      } else {
        setMessage({ text: `Erreur: ${result.message}`, type: "error" });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
      setMessage({
        text: "Une erreur est survenue lors de la mise à jour.",
        type: "error",
      });
    }
  };

  if (!client) {
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
            Modifier le client
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
              <input
                placeholder="Nom du client"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                placeholder="Email du client"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                placeholder="Entreprise du client"
                type="text"
                name="entreprise"
                value={formData.entreprise}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                placeholder="Total factures"
                type="number"
                name="total_factures"
                value={formData.total_factures}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                placeholder="Montant total"
                type="number"
                name="montant_total"
                value={formData.montant_total}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                step="0.01"
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

export default ClientEditModal;
