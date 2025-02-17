import React from "react";
import AllLights from "../lights/AllLights";
import CameraControls from "../camera/CameraControls";
import Board from "./util/Board";
import FirebaseLogger from "./firebase/firebaseLogger";

const Lobby = () => {
  FirebaseLogger();
  return (
    <>
      <AllLights />
      <CameraControls />
      <Board />
    </>
  );
};

export default Lobby;
