import handleMouseMove from "./handleMouseMove";
import handleResize from "./handleResize";

export default function handleEventListeners(renderer) {
  handleResize(renderer);
  handleMouseMove();
}
