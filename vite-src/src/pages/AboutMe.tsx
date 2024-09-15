import { useEffect } from 'react';
import { motion } from 'framer-motion';

function AboutMe() {
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', '#1a202c');
  }, []);

  return (
    <div className="mt-20 p-6 text-center text-white">
      <motion.h1
        className="text-4xl font-bold mb-4"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        About Me
      </motion.h1>
      <p className="text-lg">
        I'm a machine learning engineer passionate about leveraging technology for a better future. I also enjoy music, especially classical piano, in my spare time.
      </p>
      {/* Additional interactive elements can be added here */}
    </div>
  );
}

export default AboutMe;
