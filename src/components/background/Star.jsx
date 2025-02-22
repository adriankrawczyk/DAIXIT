import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";

const X_ALTITUDE = 20;
const Y_ALTITUDE = 5;
const Z_ALTITUDE = 20;

const Star = ({ position, xSign, ySign, zSign, xSpeed, ySpeed, zSpeed }) => {
  const starRef = useRef();

  const initialPosition = useMemo(() => [...position], [position]);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();

    starRef.current.position.x =
      initialPosition[0] + Math.cos(elapsedTime * xSpeed) * X_ALTITUDE * xSign;
    starRef.current.position.y =
      initialPosition[1] + Math.sin(elapsedTime * ySpeed) * Y_ALTITUDE * ySign;
    starRef.current.position.z =
      initialPosition[2] + Math.cos(elapsedTime * zSpeed) * Z_ALTITUDE * zSign;
  });

  return (
    <mesh position={initialPosition} ref={starRef}>
      <sphereGeometry args={[0.03, 32, 32]} />
      <meshStandardMaterial emissive="yellow" emissiveIntensity={10} />
    </mesh>
  );
};

export default Star;
