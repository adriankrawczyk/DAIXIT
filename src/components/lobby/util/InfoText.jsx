import { Center, Text, Text3D } from "@react-three/drei";
import React from "react";

const InfoText = ({
  text,
  position,
  fontSize,
  color,
  strokeWidth,
  strokeColor,
  rotation,
  textScaleMultiplier,
}) => {
  return (
    <Text
      font="/DAIXIT/fonts/BrewedCoffee.otf"
      position={position}
      fontSize={fontSize}
      letterSpacing={0.04}
      color={color}
      scale={[
        textScaleMultiplier[0] * fontSize,
        textScaleMultiplier[1] * fontSize,
        textScaleMultiplier[2] * fontSize,
      ]}
      strokeWidth={strokeWidth}
      strokeColor={strokeColor}
      rotation={rotation}
    >
      {text}
    </Text>
  );
};

export default InfoText;
