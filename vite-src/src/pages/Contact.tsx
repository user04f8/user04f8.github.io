// pages/Contact.tsx
import React from 'react';
import './Contact.css';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

function Contact() {
  return (
    <div className="contact-page">
      <h1>Contact Me</h1>
      <div className="contact-info">
        <a href="mailto:nc9241+fromwebsite@gmail.com">
          <FaEnvelope /> nc9241@gmail.com
        </a>
        <a href="https://github.com/user04f8" target="_blank" rel="noopener noreferrer">
          <FaGithub /> GitHub
        </a>
        <a href="https://www.linkedin.com/in/nathan-clark-409719207/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin /> LinkedIn
        </a>
      </div>
    </div>
  );
}

export default Contact;
