import { Text } from "@react-three/drei";

const TextLabel = ({
  position,
  fontSize,
  text,
  textColor = "black",
  textScale = [1, 1, 1],
  rotation = [0, 0, 0],
  font = "/DAIXIT/fonts/coolfont.otf"
}) => {
  return (
    <Text
      scale={textScale}
      rotation={rotation}
      position={position}
      fontSize={fontSize / 100}
      font={font}
      color={textColor}
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
};
export default TextLabel;
