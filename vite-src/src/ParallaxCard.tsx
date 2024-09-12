import React, { useState } from "react";
import "./ParallaxCard.css";

interface ParallaxCardProps {
  title: string;
  subheading: string;
  descriptor: string;
  backgroundImage: string;
}

const ParallaxCard: React.FC<ParallaxCardProps> = ({
  title,
  subheading,
  descriptor,
  backgroundImage,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`parallax-card ${isHovered ? "hovered" : ""}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <h3 className="card-subheading">{subheading}</h3>
        <p className="card-descriptor">{descriptor}</p>
      </div>
    </div>
  );
};

export default ParallaxCard;
