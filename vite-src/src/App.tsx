import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// import Cards from './components/Cards';
import AboutMe from './pages/AboutMe';
import WorkExperience from './pages/WorkExperience';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Assignments from './pages/Assignments';

function App() {
  return (
    <Router>
      <div className="full-content">
        <Navbar />
        <div className="main-content">
          <Routes>
            {/* This is currently per reqs in https://gallettilance.github.io/assignments/assignment0/ TODO refactor after assignment is graded to improve structure */}
            <Route path="/" element={<AboutMe />} />
            <Route path="/work-experience" element={<WorkExperience />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/assignments" element={<Assignments />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;