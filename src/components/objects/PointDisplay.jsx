import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const PointDisplay = ({ setupData }) => {
  const ref = useRef();

  return (
    <mesh ref={ref} position={setupData.position} rotation={setupData.rotation}>
      <boxGeometry args={[0.6, 0.35, 0.01]} />
      <meshStandardMaterial color={"blue"} />
    </mesh>
  );
};

export default PointDisplay;
