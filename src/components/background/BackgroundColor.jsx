import { useFrame } from "@react-three/fiber";
import { Depth, LayerMaterial } from "lamina";
import React, { useRef } from "react";
import * as THREE from "three";

<<<<<<< HEAD
const BG_SPEED = 0.05
=======
const BG_SPEED = 0.05;
>>>>>>> 7315abd717de71c737155d2a7ffb18b087ca2d31

const BackgroundColor = () => {
  const backgroundRef = useRef();

  useFrame((_state, delta) => {
    backgroundRef.current.rotation.x += delta * BG_SPEED;
    backgroundRef.current.rotation.y += delta * BG_SPEED;
    backgroundRef.current.rotation.z += delta * BG_SPEED;
  });

  return (
    <mesh scale={100} ref={backgroundRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <LayerMaterial side={THREE.BackSide}>
        <Depth
          colorA={"#e978be"}
          colorB={"#5d31d4"}
          alpha={1}
          mode="normal"
          near={100}
          far={300}
          origin={[100, 100, -100]}
        />
      </LayerMaterial>
    </mesh>
  );
};

export default BackgroundColor;
