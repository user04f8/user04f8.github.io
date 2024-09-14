// ParallaxCard.tsx
import React, { useEffect, useRef, useState } from "react";
import "./ParallaxCard.css";

interface ParallaxCardProps {
  title: string;
  subheading: string;
  descriptor: string;
  backgroundImage: string;
  link: string | undefined;
}

const ParallaxCard: React.FC<ParallaxCardProps> = ({
  title,
  subheading,
  descriptor,
  backgroundImage,
  link
}) => {
  const [offsetY, setOffsetY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const scrollPosition = window.pageYOffset;
        const cardOffsetTop = rect.top + scrollPosition - 1000;
        const parallaxSpeed = 0.2;
        const yPos = -(scrollPosition - cardOffsetTop) * parallaxSpeed;
        setOffsetY(yPos);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="parallax-card"
      ref={cardRef}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPositionY: `${offsetY}px`,
      }}
      onClick={() => link === undefined ? {} : open(link)}
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
