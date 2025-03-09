import React, { useEffect } from "react";
import AllLights from "../lights/AllLights";
import CameraControls from "../camera/CameraControls";
import Board from "./util/Board";
import FirebaseLogger from "./firebase/firebaseLogger";
import { leaveGame } from "../firebase/lobbyMethods";
import { getActivePlayersInGame } from "../firebase/lobbyMethods";
import { useSetup } from "../context/SetupContext";
import { fetchAllPhotos } from "../firebase/gameMethods";
import { currentGame, playerUid } from "../firebase/localVariables";

const Lobby = () => {
  const { setAllPhotos, setCameraPosition, setCameraLookAt, setDirection } =
    useSetup();
  useEffect(() => {
    setDirection("Bottom");
    setCameraPosition([0, 2, 4.4]);
    setCameraLookAt([0, 0, -5]);
    const log = async () => {
      await FirebaseLogger();
      const photos = await fetchAllPhotos();
      setAllPhotos(photos);
    };
    log();
  }, []);
  if (currentGame) {
    leaveGame(currentGame, playerUid);
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
