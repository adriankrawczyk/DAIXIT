import setCameraLookAt from "../camera/setCameraLookAt";
import mousePosition from "../mouse/mousePosition";

export default function handleMouseMove() {
  window.addEventListener("mousemove", (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = (e.clientY / window.innerHeight) * 2 + 1;
    setCameraLookAt();
  });
}
