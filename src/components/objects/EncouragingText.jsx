import React from "react";
import InfoText from "../lobby/util/InfoText";
import { Float } from "@react-three/drei";

const EncouragingText = ({ encouragingButtonData }) => {
  return (
    <Float
      rotationIntensity={0.2}
      floatIntensity={0.2}
      floatingRange={[-0.001, 0.001]}
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

      {/* <InfoText
        text={"card"}
        position={[
          encouragingButtonData.position[0] + 0.94,
          encouragingButtonData.position[1],
          encouragingButtonData.position[2],
        ]}
        fontSize={0.27}
        rotation={encouragingButtonData.rotation}
        textScaleMultiplier={encouragingButtonData.textScaleMultiplier}
        color={"#a32c64"}
        strokeWidth={0.012}
        strokeColor={"#c49755"}
      /> */}
    </Float>
  );
};

export default EncouragingText;
