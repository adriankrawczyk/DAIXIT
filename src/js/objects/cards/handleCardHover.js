import gsap from "gsap";
import { hand } from "./cardData";

const MAX_OFFSET = 0.2;

let currentCard = null;

export default function handleCardHover(intersects) {
  const hoveredCard =
    intersects.length > 0 && intersects[0].object.hoverable === true
      ? intersects[0].object
      : null;

  if (hoveredCard !== currentCard) {
    if (currentCard) {
      unhover(currentCard);
    }

    currentCard = hoveredCard;

    if (currentCard) {
      hover(currentCard);
    }
  }
}
function hover(card) {
  const cardData = hand.get(card.uuid);
  const targetX = cardData.startX + MAX_OFFSET;
  const targetY = cardData.startY + MAX_OFFSET;

  gsap.to(card.position, {
    x: targetX,
    y: targetY,
    duration: 0.3,
    ease: "power2.out",
  });
}

function unhover(card) {
  const cardData = hand.get(card.uuid);
  if (cardData.chosenOnTable) {
    currentCard = null;
    return;
  }
  if (cardData) {
    gsap.to(card.position, {
      x: cardData.startX,
      y: cardData.startY,
      duration: 0.3,
      ease: "power2.out",
    });
  }
}

function backToHand(card) {
  const cardData = hand.get(card.uuid);

  gsap.to(card.position, {
    x: cardData.startX,
    y: cardData.startY,
    z: cardData.startZ,
    duration: 0.5,
    ease: "power2.out",
  });
  gsap.to(card.rotation, {
    x: cardData.startRotationX,
    y: cardData.startRotationY,
    z: cardData.startRotationZ,
    duration: 0.5,
    ease: "power2.out",
  });
  card.hoverable = true;
  cardData.chosenOnTable = false;
  hand.set(card.uuid, cardData);
}

export { backToHand };
