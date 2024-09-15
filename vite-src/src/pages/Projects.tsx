import RPS_Splash from '../assets/rps_splash.webp';
import LangCraft_Splash from '../assets/langcraft_splash.png'

const projects = [
  {
    title: 'Rock Paper Infinity',
    description: 'Developed and deployed AI-powered game available at rockpaperinfinity.com in React powered by LLM backend.',
    image: RPS_Splash,
    link: 'https://rockpaperinfinity.com/',
  },
  {
    title: 'MineCompile',
    description: 'A framework built in Python for auto-generating Minecraft datapack components; includes mal (MetaAutoLang), a language with parser and interpreter for code generation.',
    image: LangCraft_Splash,
    link: 'https://github.com/user04f8/MineCompile',
  },
  {
    title: 'NeurIPS Autocast',
    description: 'Achieved 2nd best accuracy in this machine learning competition using fine-tuned GPT-3 with RAG on web-scraped news.',
    image: '', // TODO image
    link: 'https://github.com/user04f8/autocast',
  },
  {
    title: 'TradeBot',
    description: 'A trading bot that was the winning submission for Iddo Drori\'s deep learning stock market competition.',
    image: '', // TODO image
    link: 'https://github.com/user04f8/TradeBot',
  },
];

function Projects() {
  return (
    <div className="mt-20 p-6 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg">
            {project.image && (
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded" />
            )}
            <h2 className="text-2xl font-semibold mt-4">{project.title}</h2>
            <p className="mt-2">{project.description}</p>
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 block">
              Visit Project
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
