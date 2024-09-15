import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AboutMe from './pages/AboutMe';
import WorkExperience from './pages/WorkExperience';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Assignments from './pages/Assignments';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="mt-20">
        <Routes>
          <Route path="/" element={<AboutMe />} />
          <Route path="/work-experience" element={<WorkExperience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/assignments" element={<Assignments />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
