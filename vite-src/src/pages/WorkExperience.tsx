import './WorkExperience.css';
import { FaBriefcase, FaLaptopCode, FaChartLine } from 'react-icons/fa';

const experienceData = [
    // TODO fill in placeholder
  { 
    icon: <FaBriefcase />,
    title: 'Software Engineer',
    company: 'TechCorp Inc.',
    duration: 'Jan 2020 - Present',
    description: 'Developing scalable web applications and working with cross-functional teams.',
  },
  {
    icon: <FaLaptopCode />,
    title: 'Frontend Developer',
    company: 'WebWorks',
    duration: 'Jun 2018 - Dec 2019',
    description: 'Focused on building responsive UI components with React and Redux.',
  },
  {
    icon: <FaChartLine />,
    title: 'Data Analyst',
    company: 'DataInsights',
    duration: 'Jan 2016 - May 2018',
    description: 'Analyzed large datasets to drive business decisions and strategies.',
  },
];

function WorkExperience() {
  return (
    <div className="workexperience-page">
      <h1>Work Experience</h1>
      <div className="experience-container">
        {experienceData.map((item, index) => (
          <div className="experience-card" key={index}>
            <div className="experience-icon">{item.icon}</div>
            <h2 className="experience-title">{item.title}</h2>
            <h3 className="experience-company">{item.company}</h3>
            <p className="experience-duration">{item.duration}</p>
            <p className="experience-description">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkExperience;
