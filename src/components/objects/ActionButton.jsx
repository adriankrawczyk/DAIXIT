import React, { forwardRef } from "react";
import TextLabel from "../lobby/util/TextLabel";
import { Text } from "@react-three/drei";

const ActionButton = forwardRef(
  ({ buttonSetupData, color, text, onClick, defaultScale = 0 }, ref) => {
    const fontSize = 0.25;
    return (
      <mesh
        ref={ref}
        position={buttonSetupData.position}
        rotation={buttonSetupData.rotation}
        scale={defaultScale}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <Text
          scale={[
            buttonSetupData.textScaleMultiplier[0] * fontSize,
            buttonSetupData.textScaleMultiplier[1] * fontSize,
            buttonSetupData.textScaleMultiplier[2] * fontSize,
          ]}
          position={buttonSetupData.textPosition}
        >
          {text}
        </Text>
        <boxGeometry args={[1, 0.5, 0.01]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }
);

export default ActionButton;
