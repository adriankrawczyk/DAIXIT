import Button from "./Button";
import TextLabel from "./TextLabel";


const GameListElement = ({ index, host, gameId, HandleJoinClick, setLastYPosition }) => {
  return (
    <mesh position={[0, 0.15 - index * 0.12, 0.1]}>
      <TextLabel position={[0, 0, 0.01]} fontSize={6} text={host} />
      <Button
        position={[0.42, 0, 0.01]}
        dimensions={[0.1, 0.06, 0.01]}
        text="Join"
        handleClick={() => HandleJoinClick(gameId)}
        disabledColor="#8B0095"
        enabledColor="#ff9300"
      />
      <boxGeometry args={[1, 0.09, 0.01]} />
      <meshBasicMaterial color="#790079" />
    </mesh>
  );
};
export default GameListElement;
