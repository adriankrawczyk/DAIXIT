import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Depth, LayerMaterial } from "lamina";
import React, { useRef } from "react";
import * as THREE from "three";

const BG_SPEED = 0.05;

const BackgroundColor = (
  { 
    colorA,
    colorB
  }
) => {
  const backgroundRef = useRef();


  useFrame((_state, delta) => {
    backgroundRef.current.rotation.x += delta * BG_SPEED;
    backgroundRef.current.rotation.y += delta * BG_SPEED;
    backgroundRef.current.rotation.z += delta * BG_SPEED;
  });

  return (
    <>
    <mesh scale={100} ref={backgroundRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <LayerMaterial side={THREE.BackSide}>
        <Depth
          colorA={colorA}
          colorB={colorB}
          alpha={1}
          mode="normal"
          near={100}
          far={300}
          origin={[100, 100, -100]}
        />
      </LayerMaterial>
    </mesh>
    </>
  );
};

export default BackgroundColor;
