import { Text } from "@react-three/drei";

const TextLabel = ({ position, fontSize, text }) => {
  return (
    <Text
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
