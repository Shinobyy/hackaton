import React, { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import TableList from "./components/TableList";

function Invoice() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/");
        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <h1>Liste des factures</h1>
        <Button onClick={() => alert("clicked")}>Créer une facture</Button>
      </div>

      <TableList data={invoices} />
    </div>
  );
}

export default Invoice;
