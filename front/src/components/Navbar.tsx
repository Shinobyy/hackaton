import { Link } from "react-router";

function Navbar() {
  return (
    <nav className="dark:bg-black dark:text-white p-4 shadow-md mb-4">
      <ul className="flex justify-center items-center space-x-8">
        <li>
          <Link
            to={"/"}
            className="dark:hover:bg-slate-700 hover:bg-accent px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Factures
          </Link>
        </li>
        <li>
          <Link
            to={"/clients"}
            className="dark:hover:bg-gray-700 hover:bg-accent px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Clients
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
