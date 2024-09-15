import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

function Contact() {
  return (
    <div className="mt-20 p-6 text-center text-white">
      <h1 className="text-4xl font-bold mb-6">Contact Me</h1>
      <div className="space-y-4">
        <a href="mailto:nc9241+fromwebsite@gmail.com" className="flex items-center justify-center space-x-2 text-lg hover:text-gray-400">
          <FaEnvelope />
          <span>nc9241@gmail.com</span>
        </a>
        <a href="https://github.com/user04f8" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 text-lg hover:text-gray-400">
          <FaGithub />
          <span>GitHub</span>
        </a>
        <a href="https://www.linkedin.com/in/nathan-clark-409719207/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 text-lg hover:text-gray-400">
          <FaLinkedin />
          <span>LinkedIn</span>
        </a>
      </div>
    </div>
  );
}

export default Contact;
