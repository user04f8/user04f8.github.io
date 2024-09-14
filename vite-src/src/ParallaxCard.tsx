import React, { useEffect, useState } from "react";
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
  const [scrollAmount, setScrollAmount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll position relative to the top of the viewport
      const scrollPosition = window.scrollY;
      setScrollAmount(scrollPosition * 0.5); // Adjust scroll rate
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="parallax-card"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        // Cast as any to allow CSS custom properties in inline styles
        "--scroll-amount": `${scrollAmount}px`,
      } as React.CSSProperties} /* <-- Important fix here */
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
