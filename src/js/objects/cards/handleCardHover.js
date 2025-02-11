import gsap from "gsap";
import cardStates from "./cardStates";

const MAX_OFFSET = 0.2;

let currentCard = null;
let previousCard = null;

export default function handleCardHover(intersects) {
  const hoveredCard =
    intersects.length > 0 && intersects[0].object.name === "card"
      ? intersects[0].object
      : null;

  if (hoveredCard && !cardStates.has(hoveredCard.uuid)) {
    cardStates.set(hoveredCard.uuid, {
      startX: hoveredCard.position.x,
      startY: hoveredCard.position.y,
      startZ: hoveredCard.position.z,
    });
  }

  if (hoveredCard !== currentCard) {
    if (currentCard) {
      previousCard = currentCard;

      const prevState = cardStates.get(previousCard.uuid);
      if (prevState) {
        gsap.to(previousCard.position, {
          x: prevState.startX,
          y: prevState.startY,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }

    currentCard = hoveredCard;

    if (currentCard) {
      const startPos = cardStates.get(currentCard.uuid);
      const targetX = startPos.startX + MAX_OFFSET;
      const targetY = startPos.startY + MAX_OFFSET;

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
