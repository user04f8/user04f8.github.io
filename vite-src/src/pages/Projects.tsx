import './Projects.css';
import Cards from '../components/Cards'
import { ParallaxCardProps } from '../components/ParallaxCard';

import RPS_Splash from '../assets/rps_splash.webp'

const projectsData: Array<ParallaxCardProps> = [
  {
    title: 'Rock Paper Infinity',
    subheading: '',
    descriptor: '',
    backgroundImage: `url(${RPS_Splash})`,
    link: 'https://rockpaperinfinity.com/'
  },
  // TODO: add more projects
];

function Projects() {
  return (
    <div className="projects-page">
      {/* <h1>Projects</h1> */}
      {/* <div className="projects-container"> */}
        <Cards cardData={projectsData} />
      {/* </div> */}
    </div>
  );
}

export default Projects;
