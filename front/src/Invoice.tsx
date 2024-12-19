import { useEffect, useState } from "react";
import TableList from "./components/TableList";
import Modal from "./components/invoices/Modal";
import { format } from "date-fns";

interface Client {
  id: number;
  name: string;
  dateSent: string;
  status: string;
}

function Invoice() {
  const formatDate = (date: string) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = parsedDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/");
        const data = await response.json();

        const formattedData = data.map((invoice) => ({
          ...invoice,
          date_envoi: format(new Date(invoice.date_envoi), "dd/MM/yyyy"), // Formater la date ici
        }));

        setInvoices(formattedData);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchData();
  }, [invoices]);

  const [clientNames, setClientNames] = useState<Client[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/clients");
        const data = await response.json();

        setClientNames(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold mb-10">Liste des factures</h1>
        <Modal />
      </div>

      <TableList data={invoices} clients={clientNames} />
    </div>
  );
}

export default Invoice;
