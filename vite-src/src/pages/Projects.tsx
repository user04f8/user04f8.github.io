// pages/Projects.tsx
import React from 'react';
import './Projects.css';
import ParallaxCard from '../components/ParallaxCard';

const projectsData = [
  {
    title: 'Rock Paper Infinity',
    subheading: '',
    descriptor: '',
    backgroundImage: 'assets/react.svg',
    link: 'https://rockpaperinfinity.com/'
  },
  {
    title: 'Project Beta',
    subheading: 'Next-Gen Technology',
    descriptor: 'A brief description of Project Beta.',
    backgroundImage: 'path_to_image_beta.jpg',
  },
  // Add more projects as needed
];

function Projects() {
  return (
    <div className="projects-page">
      <h1>My Projects</h1>
      <div className="projects-container">
        {projectsData.map((project, index) => (
          <ParallaxCard
            key={index}
            title={project.title}
            subheading={project.subheading}
            descriptor={project.descriptor}
            backgroundImage={project.backgroundImage}
            link={project?.link}
          />
        ))}
      </div>
    </div>
  );
}

export default Projects;
