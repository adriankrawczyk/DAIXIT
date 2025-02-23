import { Text } from "@react-three/drei";

const TextLabel = ({
  position,
  fontSize,
  text,
  textScale = [1, 1, 1],
  rotation = [0, 0, 0],
}) => {
  return (
    <Text
      scale={textScale}
      rotation={rotation}
      position={position}
      fontSize={fontSize / 100}
      color="black"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
};
export default TextLabel;
