import handleMouseClick from "./handleMouseClick";
import handleMouseMove from "./handleMouseMove";
import handleResize from "./handleResize";

export default function handleEventListeners(renderer, scene) {
  handleResize(renderer);
  handleMouseMove(scene);
  handleMouseClick(scene);
}
