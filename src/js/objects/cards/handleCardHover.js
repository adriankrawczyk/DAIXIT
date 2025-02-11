import gsap from "gsap";
import { hand } from "./cardData";

const MAX_OFFSET = 0.2;

let currentCard = null;
let previousCard = null;

export default function handleCardHover(intersects) {
  const hoveredCard =
    intersects.length > 0 && intersects[0].object.name === "card"
      ? intersects[0].object
      : null;

  if (hoveredCard !== currentCard) {
    if (currentCard) {
      previousCard = currentCard;
      const prevCardData = hand.get(previousCard.uuid);
      if (prevCardData.chosenOnTable) {
        currentCard = null;
        previousCard = null;
        return;
      }
      if (prevCardData) {
        gsap.to(previousCard.position, {
          x: prevCardData.startX,
          y: prevCardData.startY,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }

    currentCard = hoveredCard;

    if (currentCard) {
      const cardData = hand.get(currentCard.uuid);

      const targetX = cardData.startX + MAX_OFFSET;
      const targetY = cardData.startY + MAX_OFFSET;

      gsap.to(currentCard.position, {
        x: targetX,
        y: targetY,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }
}

export { currentCard, previousCard };
