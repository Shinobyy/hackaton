import React, { useEffect, useState } from "react";
import TableList from "./components/TableList";
import ClientModal from "./components/client/ClientModal";

function Client() {
  const [client, setClient] = useState<[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/clients");
        const data = await response.json();

        setClient(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold mb-10">Liste des clients</h1>
        <ClientModal />
      </div>

      <TableList data={client} isClientForm={true} />
    </div>
  );
}

export default Client;
