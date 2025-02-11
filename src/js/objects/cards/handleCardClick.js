import gsap from "gsap";
import cardStates from "./cardStates";

export default function handleCardClick(intersects) {
  if (!intersects.length) return;

  const clickedCard = intersects[0].object;
  if (clickedCard.name !== "card") return;

  const startZ = cardStates.get(clickedCard.uuid).startZ;
  cardStates.delete(clickedCard.uuid);

  clickedCard.name = "";

  gsap.to(clickedCard.rotation, {
    x: -Math.PI / 2,
    y: 0,
    z: 0,
    duration: 0.5,
    ease: "power2.out",
  });

  gsap.to(clickedCard.position, {
    x: 2,
    y: 4,
    z: startZ * 2,
    duration: 0.5,
    ease: "power2.out",
  });
}
