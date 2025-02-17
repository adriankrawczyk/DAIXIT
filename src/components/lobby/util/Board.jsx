import { useState } from "react";
import NamePage from "../pages/NamePage";
import LobbyPage from "../pages/LobbyPage";

const BoardBackground = () => {
  return (
    <>
      <boxGeometry args={[2, 1.25, 0.02]} />
      <meshBasicMaterial color="gray" />
    </>
  );
};

const Board = () => {
  const [playClicked, setPlayClicked] = useState(false); // to change

  return (
    <mesh position={[0, 1.9, 3.5]} rotation={[-Math.PI / 16, 0, 0]}>
      <BoardBackground />
      {playClicked ? (
        <LobbyPage setPlayClicked={setPlayClicked} />
      ) : (
        <NamePage setPlayClicked={setPlayClicked} />
      )}
    </mesh>
  );
};
export default Board;
