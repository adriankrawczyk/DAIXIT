import gltfLoader from "../util/GLTFLoader";

export default function addTable(scene) {
  gltfLoader.load("/kitchen_table.glb", (glb) => {
    const table = glb.scene;
    scene.add(table);
    table.rotateY(Math.PI / 2);
    table.scale.set(0.35, 0.35, 0.35);
    table.position.set(0.25, 0, 0);
    table.traverse((node) => {
      if (node.isMesh) node.receiveShadow = true;
    });
  });
}
