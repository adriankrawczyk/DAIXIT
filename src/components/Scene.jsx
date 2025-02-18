import React, { useEffect } from "react";
import AllLights from "./lights/AllLights";
import CameraControls from "./camera/CameraControls";
import Table from "./objects/Table";
import CardsComponent from "./objects/CardsComponent";
import { OrbitControls } from "@react-three/drei";
import FullBackground from "./background/FullBackground";
import Paddle_Boat from "../../public/Paddle_Boat";
import Cone from "./objects/Cone";

const Scene = () => {
  return (
    <>
      <AllLights />
      <CameraControls />
      <CardsComponent numberOfCards={5} />
      {/* <Table /> */}
      <OrbitControls/>
      {/* <Paddle_Boat/> */}
      <Cone/>
      <FullBackground />
    </>
  );
};

export default Scene;
