import setCameraLookAt from "../camera/setCameraLookAt";
import mousePosition from "../mouse/mousePosition";
import raycaster from "../raycaster/raycaster";
import camera from "../camera/camera";
import { Vector2 } from "three";

export default function handleMouseMove(scene) {
  let interval;

  window.addEventListener("mousemove", (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = (e.clientY / window.innerHeight) * 2 - 1;
    setCameraLookAt();
    raycaster.setFromCamera(
      new Vector2(mousePosition.x, -mousePosition.y),
      camera
    );
    const intersects = raycaster.intersectObjects(scene.children);
    if (interval) clearInterval(interval);
    intersects.forEach((intersect) => {
      if (intersect.object.name == "card") {
        interval = setInterval(() => {
          intersect.object.rotateY(0.1);
        }, 20);
      }
    });
  });
}
