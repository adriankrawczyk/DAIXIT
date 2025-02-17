import React from "react";
import AllLights from "../lights/AllLights";
import CameraControls from "../camera/CameraControls";
import Board from "./util/Board";

const Lobby = () => {
  return (
    <>
      <AllLights />
      <CameraControls />
      <Board />
    </>
  );
};

export default Lobby;
