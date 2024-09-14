import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        {/* ignore warnings for now (TODO FIXME) */}
        <li><NavLink exact to="/" activeClassName="active">About Me</NavLink></li>
        <li><NavLink to="/work-experience" activeClassName="active">Work Experience</NavLink></li>
        <li><NavLink to="/projects" activeClassName="active">Projects</NavLink></li>
        <li><NavLink to="/contact" activeClassName="active">Contact</NavLink></li>
        <li><NavLink to="/assignments" activeClassName="active">Assignments</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;
