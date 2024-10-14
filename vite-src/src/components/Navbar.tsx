import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-900 fixed w-full z-10 top-0">
      <ul className="flex justify-center space-x-6 py-4">
        <li>
          <NavLink to="/" className="text-white hover:text-gray-400" end>
            About Me
          </NavLink>
        </li>
        <li>
          <NavLink to="/work-experience" className="text-white hover:text-gray-400">
            Work Experience
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" className="text-white hover:text-gray-400">
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className="text-white hover:text-gray-400">
            Contact
          </NavLink>
        </li>
        <li>
          <NavLink to="/mini-projects" className="text-white hover:text-gray-400">
            Mini-Projects
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
