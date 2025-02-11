import clickRaycaster from "../raycaster/clickRaycaster";

export default function handleMouseClick(scene) {
  window.addEventListener("click", () => {
    clickRaycaster(scene);
  });
}
