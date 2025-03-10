import React, { forwardRef } from "react";
import TextLabel from "../lobby/util/TextLabel";
import { MeshWobbleMaterial, RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

const ActionButton = forwardRef(
  (
    {
      buttonSetupData,
      text,
      onClick,
      color = "",
      texture = "",
      defaultScale = 0,
      textColor = "white",
      fontSize = 0.25,
      strokeColor = "white"
    },
    ref
  ) => {

    let materialProps = {};
    if (texture !== "")
    {
      const textureMap = useLoader(THREE.TextureLoader, `/DAIXIT/${texture}`);
      materialProps.map = textureMap;
    } 
    else 
    {
      materialProps.color = color;
    }

    // if texture has been defined previously, use it
    return <RoundedBox
        ref={ref}
        position={buttonSetupData.position}
        rotation={buttonSetupData.rotation}
        scale={defaultScale}
        radius={0.05}
        smoothness={4}
        args={[1, 0.5, 0.01]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <Text
          font="/DAIXIT/fonts/BrewedCoffee.otf"
          scale={[
            buttonSetupData.textScaleMultiplier[0] * fontSize,
            buttonSetupData.textScaleMultiplier[1] * fontSize,
            buttonSetupData.textScaleMultiplier[2] * fontSize,
          ]}
          position={buttonSetupData.textPosition}
          maxWidth={1}
          color={textColor}
          strokeColor={strokeColor}
          strokeWidth={0.02}
        >
          {text}
        </Text>
        <meshStandardMaterial {...materialProps} />
      </RoundedBox>
  }
);

export default ActionButton;
