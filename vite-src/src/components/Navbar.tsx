import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">About Me</Link></li>
        <li><Link to="/work-experience">Work Experience</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/assignments">Assignments</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
