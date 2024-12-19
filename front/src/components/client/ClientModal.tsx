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
    montant_total: 0,
  });

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "total_factures" || name === "montant_total"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    setMessage(null);

    if (!formData.name || !formData.email || !formData.entreprise) {
      setMessage({
        text: "Tous les champs doivent être remplis.",
        type: "error",
      });
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
        setMessage({ text: "Client créé avec succès", type: "success" });
        setFormData({
          name: "",
          email: "",
          entreprise: "",
          total_factures: 0,
          montant_total: 0,
        });
        window.location.reload();
      } else {
        setMessage({ text: `Erreur: ${result.message}`, type: "error" });
      }
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
      setMessage({
        text: "Une erreur est survenue lors de la création.",
        type: "error",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          Créer un client
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Créer un nouveau client
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
            <div className="space-y-4 mt-4">
              <input
                placeholder="Nom du client"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                placeholder="Email du client"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                placeholder="Entreprise du client"
                type="text"
                name="entreprise"
                value={formData.entreprise}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handleSubmit}
                className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Créer
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ClientModal;
