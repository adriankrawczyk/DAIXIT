import addLights from "../lights/addLights";
import addCards from "./cards/addCards";
import addTable from "./addTable";

export default function addObjects(scene) {
  addLights(scene);
  addTable(scene);
  addCards(scene);
}
