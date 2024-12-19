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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

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
    status: "default",
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setMessage(null);

    if (!formData.client_id || !formData.date_envoi || !formData.montant) {
      setMessage({
        text: "Tous les champs doivent être remplis.",
        type: "error",
      });
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
        setMessage({ text: "Facture créée avec succès", type: "success" });
        window.location.reload();
      } else {
        setMessage({ text: `Erreur: ${result.message}`, type: "error" });
      }
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
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
          Créer une facture
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Créer une nouvelle facture
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
              <Select
                name="client_id"
                value={formData.client_id.toString()}
                onValueChange={(value) =>
                  handleChange({
                    target: { name: "client_id", value },
                  } as React.ChangeEvent<HTMLSelectElement>)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir un client" />
                </SelectTrigger>
                <SelectContent>
                  {clientNames.map((client: Client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                placeholder="Date d'envoi"
                type="date"
                name="date_envoi"
                value={formData.date_envoi}
                onChange={handleChange}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />

              <Input
                placeholder="Montant"
                type="number"
                name="montant"
                value={formData.montant}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <Select
                name="client_id"
                value={formData.status}
                onValueChange={(value) => {
                  handleChange({
                    target: { name: "status", value },
                  } as React.ChangeEvent<HTMLSelectElement>);
                }}
                defaultValue="default"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="--Choisir un status--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Envoyée">Envoyée</SelectItem>
                  <SelectItem value="Payée">Payée</SelectItem>
                  <SelectItem value="Annulée">Annulée</SelectItem>
                </SelectContent>
              </Select>

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

export default Modal;
