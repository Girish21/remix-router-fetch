import { NavLink } from "react-router-dom";

export const Navbar = () => {
  return (
    <header className='mb-4 p-6 text-white text-2xl font-bold sticky top-0 shadow-sm bg-gradient-to-r from-blue-300 via-indigo-300 to-green-400'>
      <nav className="space-x-4">
        <NavLink to="/" end activeClassName="underline">
          Home
        </NavLink>
        <NavLink to="/team" activeClassName="underline">
          Team
        </NavLink>
      </nav>
    </header>
  );
};
