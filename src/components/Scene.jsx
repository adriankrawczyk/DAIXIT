import React from "react";
import AllLights from "./lights/AllLights";
import CameraControls from "./camera/CameraControls";
import Table from "./objects/Table";
import Card from "./objects/Card";

const Scene = () => {
  return (
    <>
      <AllLights />
      <CameraControls />
      <Card/>
      <Table />
    </>
  );
};

export default Scene;
