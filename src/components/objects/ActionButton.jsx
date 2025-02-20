import React, { forwardRef } from "react";
import TextLabel from "../lobby/util/TextLabel";
import { Text } from "@react-three/drei";

const ActionButton = forwardRef(({dimensions, color, text, onClick, defaultScale=0}, ref) => {
  const fontSize = 0.25;
  return (
    <mesh ref={ref} position={dimensions} rotation={[-Math.PI / 13, 0, 0]} scale={defaultScale} onClick={(e)=>{
      e.stopPropagation();
      onClick(); 
      }}>
      <Text scale={fontSize} position={[0,0,0.1]}>{text}</Text>
      <boxGeometry args={[1, 0.5, 0.1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
});

export default ActionButton;