import gsap from "gsap";
import { hand, setChosenCardOnTable, chosenCardOnTable } from "./cardData";

export default function handleCardClick(intersects) {
  if (!intersects.length) return;
  const clickedCard = intersects[0].object;
  if (clickedCard.name !== "card") return;

  setChosenCardOnTable(clickedCard);
  const chosenCardOnTableData = hand.get(chosenCardOnTable.uuid);

  chosenCardOnTableData.chosenOnTable = true;

  hand.set(chosenCardOnTable.uuid, chosenCardOnTableData);

  const startZ = chosenCardOnTableData.startZ;

  chosenCardOnTable.name = "";

  gsap.to(chosenCardOnTable.rotation, {
    x: -Math.PI / 2,
    y: 0,
    z: 0,
    duration: 0.5,
    ease: "power2.out",
  });

  gsap.to(chosenCardOnTable.position, {
    x: 2 + startZ * 2,
    y: 4,
    z: startZ,
    duration: 0.5,
    ease: "power2.out",
  });
}
