import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import EditModal from "./invoices/EditModal";
import ClientEditModal from "./client/ClientEditModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Client {
  id: number;
  name: string;
}

interface Invoice {
  id: number;
  client_id: number;
  date_envoi: string;
  status: string;
  montant: string;
}

interface TableListProps {
  data: Array<Invoice | Client>;
  clients?: Client[];
  isClientForm: boolean;
}

function TableList({ data, clients, isClientForm }: TableListProps) {
  const [clientMap, setClientMap] = useState<Record<number, string>>({});
  const [selectedInvoice, setSelectedInvoice] = useState<Record<
    string,
    any
  > | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const formatHeader = (header: string) => {
    return header
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Mise à jour du mapping des clients
  useEffect(() => {
    if (clients) {
      const map = clients.reduce((acc, client) => {
        acc[client.id] = client.name;
        return acc;
      }, {} as Record<number, string>);
      setClientMap(map);
    }
  }, [clients]);

  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  headers.push("Actions");

  const filteredData = data.filter((row) => {
    return headers.slice(0, -1).some((header) => {
      if (header === "client_id" && row[header]) {
        const clientName = clientMap[row[header]];
        return (
          clientName &&
          clientName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      const cellValue = row[header]?.toString().toLowerCase();
      return cellValue?.includes(searchQuery.toLowerCase());
    });
  });

  const getClientName = (clientId: number) => {
    return clientMap[clientId] || "Client non trouvé";
  };

  const handleDelete = async (isClientForm: boolean, id: number) => {
    try {
      let url = "";

      if (isClientForm) {
        url = `http://localhost:3000/clients/delete/${id}`;
      } else {
        url = `http://localhost:3000/delete/${id}`;
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (response.ok) {
        if (isClientForm === false) {
          alert("Facture supprimée avec succès");
        } else {
          alert("Client supprimé avec succès");
        }
      } else {
        alert(`Erreur: ${result.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la facture:", error);
    }
  };

  if (filteredData.length === 0) {
    return <p>No data available</p>;
  }
  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border w-full rounded-sm focus:outline-blue-400"
      />
      {filteredData.length === 0 ? (
        <p>Aucune donnée ne correspond à votre recherche</p>
      ) : (
        <Table>
          <TableCaption>
            {isClientForm ? "Tous les clients" : "Toutes les invoices"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index}>{formatHeader(header)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.slice(0, -1).map((header, colIndex) => (
                  <TableCell key={colIndex}>
                    {header === "client_id"
                      ? getClientName(row.client_id)
                      : row[header] || "-"}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-5">
                    {isClientForm ? (
                      <ClientEditModal client={row as ClientData} />
                    ) : (
                      <EditModal invoice={row} />
                    )}
                    <Dialog>
                      <DialogTrigger>
                        <Button className="bg-red-500 text-white hover:bg-red-600 transition-colors">
                          Supprimer
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader className="text-xl font-semibold">
                          Vous-êtes sûrs ?
                        </DialogHeader>
                        <DialogDescription>
                          <Button
                            onClick={() => handleDelete(isClientForm, row.id)}
                            className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                          >
                            Confirmer
                          </Button>
                        </DialogDescription>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default TableList;
