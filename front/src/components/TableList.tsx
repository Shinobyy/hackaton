import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditModal from "./invoices/EditModal";
import ClientEditModal from "./client/ClientEditModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileX,
  ListFilter,
  Search,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";

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

type SortableFields =
  | "id"
  | "name"
  | "client_id"
  | "date_envoi"
  | "status"
  | "montant";

interface TableListProps {
  data: Array<Invoice | Client>;
  clients?: Client[];
  isClientForm: boolean;
}

interface SortConfig {
  key: SortableFields;
  direction: "asc" | "desc";
}

function TableList({ data, clients, isClientForm }: TableListProps) {
  const [clientMap, setClientMap] = useState<Record<number, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "id",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState<Array<Invoice | Client>>([]);

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  useEffect(() => {
    if (clients) {
      const map = clients.reduce((acc, client) => {
        acc[client.id] = client.name;
        return acc;
      }, {} as Record<number, string>);
      setClientMap(map);
    }
  }, [clients]);

  useEffect(() => {
    let filtered = [...data].filter((row) => {
      return headers.some((header) => {
        if (header === "client_id" && "client_id" in row) {
          const clientName = clientMap[row.client_id];
          return clientName?.toLowerCase().includes(searchQuery.toLowerCase());
        }
        const cellValue = row[header as keyof typeof row]
          ?.toString()
          .toLowerCase();
        return cellValue?.includes(searchQuery.toLowerCase());
      });
    });

    /**
     * Trie des données en fonction d'une config de tri
     * @param firstItem Premier élément à comparer
     * @param secondItem Deuxième élément à comparer
     * Le tri peut etre fait de façon croissante ou décroissante
     * @returns 1 si le premier élément est supérieur, -1 si le deuxième élément est supérieur, 0 si égaux
     */
    filtered.sort((firstItem, secondItem) => {
      const firstValue = (firstItem as any)[sortConfig.key];
      const secondValue = (secondItem as any)[sortConfig.key];

      // Pour les dates, on utilise le timestamp en secondes pour compareer
      if (sortConfig.key === "date_envoi" && firstValue && secondValue) {
        const firstDate = new Date(firstValue as string).getTime();
        const secondDate = new Date(secondValue as string).getTime();
        return sortConfig.direction === "asc"
          ? firstDate - secondDate
          : secondDate - firstDate;
      }

      // Pour les montants, on utilise parseFloat pour comparer
      if (sortConfig.key === "montant" && firstValue && secondValue) {
        const firstAmount = parseFloat(firstValue as string);
        const secondAmount = parseFloat(secondValue as string);
        return sortConfig.direction === "asc"
          ? firstAmount - secondAmount
          : secondAmount - firstAmount;
      }

      return sortConfig.direction === "asc"
        ? firstValue > secondValue
          ? 1
          : -1
        : secondValue > firstValue
        ? 1
        : -1;
    });

    setFilteredData(filtered);
  }, [data, searchQuery, sortConfig, clientMap]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatHeader = (header: string) => {
    return header
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getClientName = (clientId: number) => {
    return clientMap[clientId] || "Client non trouvé";
  };

  const handleSort = (key: SortableFields) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDelete = async (isClientForm: boolean, id: number) => {
    try {
      const url = isClientForm
        ? `http://localhost:3000/clients/delete/${id}`
        : `http://localhost:3000/delete/${id}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (response.ok) {
        alert(
          isClientForm
            ? "Client supprimé avec succès"
            : "Facture supprimée avec succès"
        );
        window.location.reload();
      } else {
        alert(`Erreur: ${result.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression");
    }
  };

  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileX className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aucune donnée disponible
          </h3>
          <p className="text-gray-500 text-center">
            {isClientForm
              ? "Aucun client n'a été trouvé. Commencez par en ajouter un !"
              : "Aucune facture n'a été trouvée. Commencez par en créer une !"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">
        Affichage {(currentPage - 1) * itemsPerPage + 1} à{" "}
        {Math.min(currentPage * itemsPerPage, filteredData.length)} sur{" "}
        {filteredData.length} éléments
      </div>
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 min-w-[200px]">
            <ListFilter className="h-4 w-4 text-gray-500" />
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Éléments par page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 par page</SelectItem>
                <SelectItem value="25">25 par page</SelectItem>
                <SelectItem value="50">50 par page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Table>
        <TableCaption>
          {isClientForm ? "Liste des clients" : "Liste des factures"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>
                <Button
                  variant="ghost"
                  onClick={() => handleSort(header as SortableFields)}
                  className="flex items-center gap-2"
                >
                  {formatHeader(header)}
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((header, colIndex) => (
                <TableCell key={colIndex}>
                  {header === "client_id" && "client_id" in row
                    ? getClientName(row.client_id)
                    : row[header as keyof typeof row] || "-"}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex gap-5">
                  {isClientForm ? (
                    <ClientEditModal client={row as Client} />
                  ) : (
                    <EditModal invoice={row as Invoice} />
                  )}
                  <Dialog>
                    <DialogTrigger>
                      <Button className="bg-red-500 text-white hover:bg-red-600 transition-colors">
                        Supprimer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader className="text-xl font-semibold">
                        Êtes-vous sûr ?
                      </DialogHeader>
                      <DialogDescription>
                        Cette action est irréversible.
                        <Button
                          onClick={() => handleDelete(isClientForm, row.id)}
                          className="w-full mt-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                          Confirmer la suppression
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TableList;
