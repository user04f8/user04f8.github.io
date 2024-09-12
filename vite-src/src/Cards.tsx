import React from "react";
import "./Cards.css";
import ParallaxCard from "./ParallaxCard";

const placeholder = 'https://t4.ftcdn.net/jpg/03/86/32/39/360_F_386323925_zrx6Y3SM4QdkM2ICGpbs9RbEVJFRxIGm.jpg';

const cardData = [
  {
    title: "Card 1",
    subheading: "Subheading 1",
    descriptor: "This is the full description of the first card. When you hover over the card, this text will be revealed.",
    backgroundImage: placeholder,
  },
  {
    title: "Card 2",
    subheading: "Subheading 2",
    descriptor: "This is the full description of the second card. Hover to reveal the details.",
    backgroundImage: placeholder,
  },
  {
    title: "Card 3",
    subheading: "Subheading 3",
    descriptor: "This is the full description of the third card. Hover to learn more.",
    backgroundImage: placeholder,
  },
  // Add more cards as needed
];

const Cards: React.FC = () => {
  return (
    <div className="cards-container">
      {cardData.map((card, index) => (
        <ParallaxCard
          key={index}
          title={card.title}
          subheading={card.subheading}
          descriptor={card.descriptor}
          backgroundImage={card.backgroundImage}
        />
      ))}
    </div>
  );
};

export default Cards;
