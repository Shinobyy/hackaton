import React from "react";
import { Link } from "react-router";

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md mb-4">
      <ul className="flex space-x-8">
        <li>
          <Link
            to={"/"}
            className="hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Factures
          </Link>
        </li>
        <li>
          <Link
            to={"/clients"}
            className="hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Clients
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
