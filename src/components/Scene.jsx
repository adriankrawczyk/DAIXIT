import React from "react";
import AllLights from "./lights/AllLights";
import CameraControls from "./camera/CameraControls";
import Table from "./objects/Table";

const Scene = () => {
  return (
    <>
      <AllLights />
      <CameraControls />
      <Table />
    </>
  );
};

export default Scene;
