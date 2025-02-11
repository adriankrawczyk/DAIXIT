import cardStates from "./cardStates";

const MAX_OFFSET = 0.2;
const MOVE_SPEED = 0.15;
const FRAME_TIME = 1000 / 60;

let currentCard = null;
let targetCard = null;
let animationFrame = null;
let lastFrameTime = 0;

function animate(currentTime) {
  if (currentTime - lastFrameTime < FRAME_TIME) {
    animationFrame = requestAnimationFrame(animate);
    return;
  }
  lastFrameTime = currentTime;

  if (!currentCard && !targetCard) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
    return;
  }

  let isAnimating = false;

  if (targetCard && cardStates.get(targetCard.uuid)) {
    const startPos = cardStates.get(targetCard.uuid);
    const dx = startPos.startX - targetCard.position.x;
    const dy = startPos.startY - targetCard.position.y;

    if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
      targetCard.position.x += dx * MOVE_SPEED;
      targetCard.position.y += dy * MOVE_SPEED;
      isAnimating = true;
    } else {
      targetCard.position.x = startPos.startX;
      targetCard.position.y = startPos.startY;
      targetCard = null;
    }
  }

  if (currentCard && cardStates.get(currentCard.uuid)) {
    const startPos = cardStates.get(currentCard.uuid);
    const targetX = startPos.startX + MAX_OFFSET;
    const targetY = startPos.startY + MAX_OFFSET;

    const dx = targetX - currentCard.position.x;
    const dy = targetY - currentCard.position.y;

    if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
      currentCard.position.x += dx * MOVE_SPEED;
      currentCard.position.y += dy * MOVE_SPEED;
      isAnimating = true;
    }
  }

  if (isAnimating) {
    animationFrame = requestAnimationFrame(animate);
  } else {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
}

export default function handleCardHover(intersects) {
  const hoveredCard =
    intersects.length > 0 && intersects[0].object.name === "card"
      ? intersects[0].object
      : null;

  if (hoveredCard && !cardStates.has(hoveredCard.uuid)) {
    cardStates.set(hoveredCard.uuid, {
      startX: hoveredCard.position.x,
      startY: hoveredCard.position.y,
    });
  }

  if (hoveredCard !== currentCard) {
    if (currentCard) {
      targetCard = currentCard;
    }
    currentCard = hoveredCard;

    if (!animationFrame) {
      lastFrameTime = performance.now();
      animationFrame = requestAnimationFrame(animate);
    }
  }
}
export { currentCard, targetCard };
