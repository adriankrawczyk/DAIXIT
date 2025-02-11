import raycaster from "./raycaster";
import camera from "../camera/camera";
import mousePosition from "../mouse/mousePosition";
import { Vector2 } from "three";

export default function updateRaycaster(scene) {
  raycaster.setFromCamera(
    new Vector2(mousePosition.x, mousePosition.y),
    camera
  );
  const intersects = raycaster.intersectObjects(scene.children);
  intersects.forEach((intersect) => {
    if (intersect.object.name == "card") {
    }
  });
}
