import { useState } from "react";
import NamePage from "../pages/NamePage";
import LobbyPage from "../pages/LobbyPage";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const BoardBackground = () => {
  const texture = useLoader(THREE.TextureLoader, "/DAIXIT/border.png");
  return (
    <>
      <boxGeometry args={[2.5, 1.8, 0.02]} />
      {/* <meshBasicMaterial color="gray" /> */}
      <meshStandardMaterial transparent={true} map={texture} />
    </>
  );
};

const Board = () => {
  const [playClicked, setPlayClicked] = useState(false); // to change
  return (
    <mesh position={[0, 1.8, 3.5]} rotation={[-Math.PI / 16, 0, 0]}>
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
