import { useFrame, useLoader } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";

const CENTER_POSITION = [0, -0.5, 0];

const Planets = ({ texture, positionRadius, speed, fi }) => {
  const material = useLoader(THREE.TextureLoader, texture);
  const ref = useRef();

  const position = useMemo(() => {
    const pos = [...CENTER_POSITION];
    pos[1] = Math.random() * 4;
    return pos;
  }, []);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();

    ref.current.rotation.x = elapsedTime * 0.1;
    ref.current.rotation.y = elapsedTime * 0.1;
    ref.current.rotation.z = elapsedTime * 0.1;

    ref.current.position.x =
      CENTER_POSITION[0] + Math.sin(elapsedTime * speed + fi) * positionRadius;
    ref.current.position.z =
      CENTER_POSITION[2] + Math.cos(elapsedTime * speed + fi) * positionRadius;
  });

  return (
    <mesh position={position} ref={ref}>
      <sphereGeometry args={[0.2]} />
      <meshStandardMaterial attach="material" map={material} />
    </mesh>
  );
};

export default Planets;
