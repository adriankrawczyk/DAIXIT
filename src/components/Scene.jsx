import React from "react";
import AllLights from "./lights/AllLights";
import CameraControls from "./camera/CameraControls";
import Table from "./objects/Table";
import CardsComponent from "./objects/CardsComponent";
import { OrbitControls } from "@react-three/drei";

const Scene = () => {
  return (
    <>
      <AllLights />
      <CameraControls />
      <CardsComponent numberOfCards={5}/>
      <Table />
    </>
  );
};

export default Scene;
