// ParallaxCard.tsx
import React, { useEffect, useRef, useState } from "react";
import "./ParallaxCard.css";

export interface ParallaxCardProps {
  title: string;
  subheading: string;
  descriptor: string;
  backgroundImage: string;
  link?: string;
}

// FIXME: This entire approach is suboptimal and overly complex, maybe completely refactor

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
        const scrollPosition = window.scrollY;
        const cardOffsetTop = rect.top + scrollPosition - 100;
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
        backgroundImage: backgroundImage,  // TODO: ideally this would load webp or png as appropriate
        backgroundPositionY: `${offsetY}px`,  // FIXME: this is set to an initial value that differs from the first scroll
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
