import { useState } from "react";
import NamePage from "../pages/NamePage";

const BoardBackground = () => {
  return (
    <>
      <boxGeometry args={[2, 1.25, 0.02]} />
      <meshBasicMaterial color="gray" />
    </>
  );
};

const Board = () => {
  return (
    <mesh position={[0, 1.9, 3.5]} rotation={[-Math.PI / 16, 0, 0]}>
      <BoardBackground />
      {localStorage.getItem("name") ? <></> : <NamePage />}
    </mesh>
  );
};
export default Board;
