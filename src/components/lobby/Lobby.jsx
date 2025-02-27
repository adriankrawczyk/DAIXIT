import React, { useEffect } from "react";
import AllLights from "../lights/AllLights";
import CameraControls from "../camera/CameraControls";
import Board from "./util/Board";
import FirebaseLogger from "./firebase/firebaseLogger";
import { leaveGame } from "../firebase/lobbyMethods";
import { getActivePlayersInGame } from "../firebase/lobbyMethods";
import { useSetup } from "../context/SetupContext";
import { fetchAllPhotos } from "../firebase/gameMethods";

const Lobby = () => {
  const { setAllPhotos } = useSetup();
  useEffect(() => {
    const log = async () => {
      await FirebaseLogger();
      const photos = await fetchAllPhotos();
      setAllPhotos(photos);
    };
    log();
  });
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
