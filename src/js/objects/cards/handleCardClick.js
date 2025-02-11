import gsap from "gsap";
import { hand, setChosenCardOnTable, chosenCardOnTable } from "./cardData";
import { backToHand } from "./handleCardHover";

export default function handleCardClick(intersects) {
  if (!intersects.length) return;
  const clickedCard = intersects[0].object;
  if (clickedCard.name !== "card") return;

  const chosenCardOnTableData = hand.get(clickedCard.uuid);

  if (chosenCardOnTable) {
    chosenCardOnTableData.chosenOnTable = false;
    hand.set(clickedCard.uuid, chosenCardOnTableData);
    backToHand(chosenCardOnTable);
    if (chosenCardOnTable == clickedCard) return;
  }

  setChosenCardOnTable(clickedCard);

  chosenCardOnTableData.chosenOnTable = true;

  hand.set(chosenCardOnTable.uuid, chosenCardOnTableData);

  chosenCardOnTable.hoverable = false;

  gsap.to(chosenCardOnTable.rotation, {
    x: -Math.PI / 2,
    y: 0,
    z: 0,
    duration: 0.5,
    ease: "power2.out",
  });

  gsap.to(chosenCardOnTable.position, {
    x: 2,
    y: 4,
    z: 0,
    duration: 0.5,
    ease: "power2.out",
  });
}
