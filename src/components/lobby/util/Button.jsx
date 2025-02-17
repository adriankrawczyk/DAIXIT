import TextLabel from "./TextLabel";

const Button = ({ position, dimensions, text, handleClick }) => {
  const fontSize = 3;

  return (
    <>
      <mesh position={position} onClick={handleClick}>
        <TextLabel position={[0, 0, 0.01]} fontSize={fontSize} text={text} />
        <boxGeometry args={dimensions} />
        <meshBasicMaterial color="lightgreen" />
      </mesh>
    </>
  );
};

export default Button;
