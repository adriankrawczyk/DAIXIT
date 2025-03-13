import TextLabel from "./TextLabel";

const Button = ({
  position,
  dimensions,
  text,
  handleClick,
  disabled = false,
  disabledColor = "red",
  enabledColor = "lightgreen"
}) => {
  const fontSize = 3;
  return (
    <>
      <mesh position={position} onClick={disabled ? () => {} : handleClick}>
        <TextLabel position={[0, 0, 0.01]} fontSize={fontSize} text={text} />
        <boxGeometry args={dimensions} />
        <meshBasicMaterial color={disabled ? disabledColor : enabledColor} />
      </mesh>
    </>
  );
};

export default Button;
