import * as THREE from "three";
import { hand } from "./cardData";

export default function addCards(scene) {
  const textureLoader = new THREE.TextureLoader();
  const cardGeo = new THREE.BoxGeometry(0.492, 0.72, 0.001);
  const cardTexture = textureLoader.load("/card.png");
  cardTexture.colorSpace = THREE.SRGBColorSpace;
  const cardMat = [
    new THREE.MeshBasicMaterial(),
    new THREE.MeshBasicMaterial(),
    new THREE.MeshBasicMaterial(),
    new THREE.MeshBasicMaterial(),
    new THREE.MeshBasicMaterial({ map: cardTexture }),
    new THREE.MeshBasicMaterial({ map: cardTexture }),
  ];
  for (let i = 0; i < 5; i++) {
    // z,y,-x
    const cardPosition = new THREE.Vector3(4, 4, (i - 2) / 2.5);
    const cardRotation = new THREE.Vector3(
      Math.PI / 2 - i / 100,
      -Math.PI / 4,
      Math.PI / 2 - 0.1
    );

    const card = new THREE.Mesh(cardGeo, cardMat);
    card.rotation.set(cardRotation.x, cardRotation.y, cardRotation.z);
    card.position.set(cardPosition.x, cardPosition.y, cardPosition.z);

    card.name = "card";
    card.hoverable = true;
    scene.add(card);

    hand.set(card.uuid, {
      startX: card.position.x,
      startY: card.position.y,
      startZ: card.position.z,
      startRotationX: card.rotation.x,
      startRotationY: card.rotation.y,
      startRotationZ: card.rotation.z,
      chosenOnTable: false,
    });
  }
}
