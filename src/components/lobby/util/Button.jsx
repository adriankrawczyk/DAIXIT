import TextLabel from "./TextLabel";

const Button = ({
  position,
  dimensions,
  text,
  handleClick,
  disabled = false,
}) => {
  const fontSize = 3;

  return (
    <>
      <mesh position={position} onClick={disabled ? () => {} : handleClick}>
        <TextLabel position={[0, 0, 0.01]} fontSize={fontSize} text={text} />
        <boxGeometry args={dimensions} />
        <meshBasicMaterial color={disabled ? "red" : "lightgreen"} />
      </mesh>
    </>
  );
};

export default Button;
