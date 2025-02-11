import setCameraLookAt from "../camera/setCameraLookAt";
import mousePosition from "../mouse/mousePosition";
import raycaster from "../raycaster/raycaster";
import camera from "../camera/camera";
import { Vector2 } from "three";

export default function handleMouseMove(scene) {
  window.addEventListener("mousemove", (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = (e.clientY / window.innerHeight) * 2 - 1;
    setCameraLookAt();
    raycaster.setFromCamera(
      new Vector2(mousePosition.x, mousePosition.y),
      camera
    );
    const intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects);
  });
}
