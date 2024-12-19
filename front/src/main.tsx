import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Client from "./Client";
import Invoice from "./Invoice";
import Navbar from "./components/Navbar";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Navbar />
    <div className="mx-5 lg:mx-72">
      <Routes>
        <Route path="/" element={<Invoice />} />
        <Route path="/clients" element={<Client />} />
      </Routes>
    </div>
  </BrowserRouter>
);
