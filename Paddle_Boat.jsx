import React from 'react'
import { useGLTF, useTexture } from "@react-three/drei";
import { useLoader } from '@react-three/fiber';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from "three";

export default function PaddleBoat() {
  const fbx = useLoader(FBXLoader, "/PaddleBoat.fbx");
  const textures = useTexture({
    ferroMaterial: "/paddleBoatTextures/ferro.jpg",
    woodMaterial: "/paddleBoatTextures/madeira_2.jpg",
    rope_1_jpg: "/paddleBoatTextures/rope_1.jpg",
    tecidoMaterial: "/paddleBoatTextures/tecido.jpg"

  });
  
   fbx.traverse((child) => {
    if (child.isMesh && child.material) {
      const matName = child.material.name;

      if (matName.includes("ferro")) {
        child.material.map = textures.ferroMaterial;
      } else if (matName.includes("madeira_2")) {
        child.material.map = textures.woodMaterial;
      } else if (matName.includes("rope")) {
        child.material.map = textures.rope_1_jpg;
      } else if (matName.includes("tecido")) {
        child.material.map = textures.tecidoMaterial;
      }

      child.material.needsUpdate = true;
    }
  });

  return (
    <primitive object={fbx} scale={1} position={[0,-10,8]} rotation={[Math.PI/20, 0, 0]}/>
  );
}
