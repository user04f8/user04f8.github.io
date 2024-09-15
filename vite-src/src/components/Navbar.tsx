import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            About Me
          </NavLink>
        </li>
        <li>
          <NavLink to="/work-experience" className={({ isActive }) => (isActive ? 'active' : '')}>
            Work Experience
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? 'active' : '')}>
            Projects
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
            Contact
          </NavLink>
        </li>
        <li>
          <NavLink to="/assignments" className={({ isActive }) => (isActive ? 'active' : '')}>
            Assignments
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
