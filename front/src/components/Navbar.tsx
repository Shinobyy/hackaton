import React from "react";
import { Link } from "react-router";

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to={"/"}>Invoice</Link>
        </li>
        <li>
          <Link to={"/clients"}>Clients</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
