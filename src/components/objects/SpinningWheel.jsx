import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const SpinningWheel = () => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z -= 0.1;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 0.02]} />
        <meshStandardMaterial color="skyblue" />
      </mesh>
    </>
  );
};

export default SpinningWheel;
