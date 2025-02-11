import handleCardClick from "../objects/cards/handleCardClick";
import raycaster from "./raycaster";

export default function clickRaycaster(scene) {
  const intersects = raycaster.intersectObjects(scene.children);
  handleCardClick(intersects);
}
