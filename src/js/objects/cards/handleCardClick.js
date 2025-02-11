import cardStates from "./cardStates";

export default function handleCardClick(intersects) {
  if (!intersects.length) return;
  const clickedCard = intersects[0].object;
  if (clickedCard.name !== "card") return;
  const startingZ = cardStates.get(clickedCard.uuid).z;
  cardStates.delete(clickedCard.uuid);

  clickedCard.name = "";
  clickedCard.rotation.set(-Math.PI / 2, 0, 0);
  clickedCard.position.set(2, 4, startingZ);
}
