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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Client {
  id: number;
  name: string;
}

interface ClientData {
  id: number;
  name: string;
  email: string;
  entreprise: string;
  total_factures: number;
  montant_total: number;
}

interface TableListProps {
  data: Array<Record<string, any>>;
  clients?: Client[];
  isClientForm: boolean;
}

function TableList({ data, clients, isClientForm }: TableListProps) {
  const [clientMap, setClientMap] = useState<Record<number, string>>({});
  const [selectedInvoice, setSelectedInvoice] = useState<Record<
    string,
    any
  > | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (clients) {
      const map = clients.reduce((acc, client) => {
        acc[client.id] = client.name;
        return acc;
      }, {} as Record<number, string>);
      setClientMap(map);
    }
  }, [clients]);

  if (data.length === 0) {
    return <p>No data available</p>;
  }

  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  headers.push("Actions");

  const getClientName = (clientId: number) => {
    return clientMap[clientId] || "Client non trouvé";
  };

  const filteredData = data.filter((row) => {
    return headers.some((header) => {
      const cellValue = row[header]?.toString().toLowerCase();
      return cellValue?.includes(searchQuery.toLowerCase());
    });
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher..."
        className="mb-4 p-2 border border-gray-300 rounded w-full focus:outline-blue-300"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <Table>
        <TableCaption>Toutes les invoices</TableCaption>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
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
                    : row[header]}
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
                      <Button>Supprimer</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>Vous-êtes sûrs ?</DialogHeader>
                      <DialogDescription>
                        <Button
                          onClick={() => handleDelete(isClientForm, row.id)}
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
    </div>
  );
}

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
      // Optionnel : Logique après la suppression
    } else {
      alert(`Erreur: ${result.message}`);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de la facture:", error);
  }
};

export default TableList;
