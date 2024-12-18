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

interface Client {
  id: number;
  name: string;
}

interface TableListProps {
  data: Array<Record<string, any>>;
  clients: Client[];
}

function TableList({ data, clients }: TableListProps) {
  const [clientMap, setClientMap] = useState<Record<number, string>>({});
  const [selectedInvoice, setSelectedInvoice] = useState<Record<
    string,
    any
  > | null>(null);

  useEffect(() => {
    const map = clients.reduce((acc, client) => {
      acc[client.id] = client.name;
      return acc;
    }, {} as Record<number, string>);
    setClientMap(map);
  }, [clients]);

  if (data.length === 0) {
    return <p>No data available</p>;
  }

  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  headers.push("Actions");

  const getClientName = (clientId: number) => {
    return clientMap[clientId] || "Client non trouvé";
  };

  return (
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
        {data.map((row, rowIndex) => (
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
                <EditModal invoice={row} />
                <Button onClick={() => handleDelete(row.id)}>Supprimer</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const handleDelete = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:3000/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (response.ok) {
      return;
    } else {
      alert(`Erreur: ${result.message}`);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de la facture:", error);
  }
};

export default TableList;
