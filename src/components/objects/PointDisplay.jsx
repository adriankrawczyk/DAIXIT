import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

const PointDisplay = ({
  setupData,
  playerName,
  points,
  pointsInThisRound,
  afterVotePhase,
}) => {
  const ref = useRef();
  const fontSize = 0.08;
  return (
    <mesh ref={ref} position={setupData.position} rotation={setupData.rotation}>
      <Text
        scale={[
          setupData.textScaleMultiplier[0] * fontSize,
          setupData.textScaleMultiplier[1] * fontSize,
          setupData.textScaleMultiplier[2] * fontSize,
        ]}
        position={[
          setupData.textPosition[0],
          setupData.textPosition[1] + 0.075,
          setupData.textPosition[2],
        ]}
        maxWidth={1}
      >
        {playerName}
      </Text>
      <Text
        scale={[
          setupData.textScaleMultiplier[0] * fontSize,
          setupData.textScaleMultiplier[1] * fontSize,
          setupData.textScaleMultiplier[2] * fontSize,
        ]}
        position={[
          setupData.textPosition[0],
          setupData.textPosition[1] - 0.075,
          setupData.textPosition[2],
        ]}
      >
        {afterVotePhase ? `${points - pointsInThisRound} -> ${points}` : points}
      </Text>
      <boxGeometry args={[0.6, 0.35, 0.01]} />
      <meshStandardMaterial color={setupData.color} />
    </mesh>
  );
};

export default PointDisplay;
