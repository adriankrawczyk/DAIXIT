import addLights from "../lights/addLights";
import addTable from "./table";

export default function addObjects(scene) {
  addLights(scene);
  addTable(scene);
}
