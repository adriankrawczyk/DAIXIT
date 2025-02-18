import React, { useEffect } from "react";
import AllLights from "./lights/AllLights";
import CameraControls from "./camera/CameraControls";
import Table from "./objects/Table";
import CardsComponent from "./objects/CardsComponent";
import { OrbitControls } from "@react-three/drei";
import FullBackground from "./background/FullBackground";

const Scene = () => {
  return (
    <>
      <AllLights />
      <CameraControls />
      <CardsComponent numberOfCards={5} />
      <Table />
      <FullBackground />
    </>
  );
};

export default Scene;
