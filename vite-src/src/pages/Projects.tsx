// pages/Projects.tsx
import React from 'react';
import './Projects.css';
import Cards from '../components/Cards'
import { ParallaxCardProps } from '../components/ParallaxCard';

import RPS_Splash from '../assets/rps_splash.webp'

const projectsData: Array<ParallaxCardProps> = [
  {
    title: 'Rock Paper Infinity',
    subheading: '',
    descriptor: '',
    backgroundImage: RPS_Splash,
    link: 'https://rockpaperinfinity.com/'
  },
  {
    title: 'Project Beta',
    subheading: 'Next-Gen Technology',
    descriptor: 'A brief description of Project Beta.',
    backgroundImage: 'path_to_image_beta.jpg',
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
