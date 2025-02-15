import React from "react";
import AllLights from "./lights/AllLights";
import CameraControls from "./camera/CameraControls";
import Table from "./objects/Table";
import Card from "./objects/Card";

const Scene = () => {
  const cardXPositions = [-2,-1,0,1,2]
  return (
    <>
      <AllLights />
      <CameraControls />
      {
      cardXPositions.map( (item,key) => 
      <Card xPosition={item}/> 
      )
      }

      {/* <Card xPosition={0}/> */}
      <Table />
    </>
  );
};

export default Scene;
