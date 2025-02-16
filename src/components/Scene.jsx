import React from "react";
import AllLights from "./lights/AllLights";
import CameraControls from "./camera/CameraControls";
import Table from "./objects/Table";
import CardsComponent from "./objects/CardsComponent";

const Scene = () => {
  return (
    <>
      <AllLights />
      <CameraControls />
      <CardsComponent />
      <Table />
    </>
  );
};

export default Scene;
