import React from "react";
import "./Cards.css";
import ParallaxCard, { ParallaxCardProps } from "./ParallaxCard";

const placeholder_img = 'https://t4.ftcdn.net/jpg/03/86/32/39/360_F_386323925_zrx6Y3SM4QdkM2ICGpbs9RbEVJFRxIGm.jpg';
const placeholder_txt = 'This is placeholder text, the most ordinary of text. Yet, even here, within the mundane, thoughts drift like leaves on a quiet breeze. The sun, with its fading light, sinks beyond the horizon, as the world carries on—unaware of the fleetingness of time. Conversations weave the same old patterns, while subtle moments slip past unseen. Life tumbles forward, relentless, yet in stillness, we find the quiet pulse of reflection. You read these hidden lines, never meant to be found, a secret tucked away in the crevices of code. All else fades, dissolving into the background, as thought flows freely, unanchored, unremarkable. All things seem both vital and inconsequential, suspended in the delicate balance of awareness. The rhythm of life hums on, indifferent to the fleeting musings that vanish like echoes into the void.'

const placeholderCardData = [
  {
    title: "Card 1",
    subheading: "Subheading 1",
    descriptor: placeholder_txt,
    backgroundImage: placeholder_img,
    link: "example.org"
  },
  {
    title: "Card 2",
    subheading: "Subheading 2",
    descriptor: placeholder_txt,
    backgroundImage: placeholder_img,
  },
  {
    title: "Card 3",
    subheading: "Subheading 3",
    descriptor: placeholder_txt,
    backgroundImage: placeholder_img,
  },
  // Add more cards as needed
];

interface CardsProps {
  cardData?: Array<ParallaxCardProps>
}

const Cards: React.FC<CardsProps> = ({ cardData }) => {
  return (
    <div className="cards-container">
      {(cardData ?? placeholderCardData).map((card, index) => (
        <ParallaxCard
          key={index}
          title={card.title}
          subheading={card.subheading}
          descriptor={card.descriptor}
          backgroundImage={card.backgroundImage}
          link={card?.link}
        />
      ))}
    </div>
  );
};

export default Cards;
