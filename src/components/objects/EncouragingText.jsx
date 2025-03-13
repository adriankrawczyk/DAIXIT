import React from "react";
import InfoText from "../lobby/util/InfoText";
import { Float } from "@react-three/drei";

const EncouragingText = ({ encouragingButtonData }) => {
  return (
    <Float
      rotationIntensity={0.05}
      floatIntensity={0}
    >
      <InfoText
        text={"Write your special word and choose your card"}
        position={encouragingButtonData.position}
        fontSize={0.27}
        rotation={encouragingButtonData.rotation}
        textScaleMultiplier={encouragingButtonData.textScaleMultiplier}
        color={"#F0B964"}
        strokeWidth={0.012}
        strokeColor={"#a32c64"}
      />
    </Float>
  );
};

export default EncouragingText;
