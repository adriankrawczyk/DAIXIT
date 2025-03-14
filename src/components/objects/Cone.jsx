import { useLoader } from "@react-three/fiber";
import React from "react";
import * as THREE from "three";

const Cone = () => {
  const texture = useLoader(THREE.TextureLoader, "/DAIXIT/wood2.jpg");

  return (
    <mesh position={[0, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[4.5, 2]} />
      {/* <meshBasicMaterial/> */}
      <meshStandardMaterial attachArray="material" map={texture} />
    </mesh>
  );
};

export default Cone;
