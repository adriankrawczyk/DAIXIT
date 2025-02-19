import React from "react";
import AllLights from "../lights/AllLights";
import CameraControls from "../camera/CameraControls";
import Board from "./util/Board";
import FirebaseLogger from "./firebase/firebaseLogger";
import { leaveGame } from "../firebase/lobbyMethods";
import { getActivePlayersInGame } from "../firebase/lobbyMethods";

const Lobby = () => {
  FirebaseLogger();
  const gameId = localStorage.getItem("currentGame");
  if (gameId) {
    leaveGame(gameId, localStorage.getItem("playerUid"));
  }

  return (
    <>
      <AllLights />
      <CameraControls />
      <Board />
    </>
  );
};

export default Lobby;
