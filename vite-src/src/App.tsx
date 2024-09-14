import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Cards from './components/Cards'
import AboutMe from './pages/AboutMe';
// import WorkExperience from './pages/WorkExperience';
// import Projects from './pages/Projects';
// import Contact from './pages/Contact';
import Assignments from './pages/Assignments';

// App.tsx
function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Cards />
        <Routes>
          <Route path="/" element={<AboutMe />} />
          {/* TODO: other routes */}
          <Route path="/assignments" element={<Assignments />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

