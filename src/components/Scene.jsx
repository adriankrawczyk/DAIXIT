import React, { useEffect } from "react";
import AllLights from "./lights/AllLights";
import CameraControls from "./camera/CameraControls";
import Table from "./objects/Table";
import CardsComponent from "./objects/CardsComponent";
import { OrbitControls } from "@react-three/drei";
import FullBackground from "./background/FullBackground";
import Paddle_Boat from "../../public/Paddle_Boat";
import Cone from "./objects/Cone";
import { getActivePlayersInGame, joinToGame } from "./firebase/lobbyMethods";
import { useSetup } from "./context/SetupContext";
import { getSetupData } from "./firebase/gameMethods";
import FirebaseLogger from "./lobby/firebase/firebaseLogger";

const Scene = () => {
  const {
    setCameraPosition,
    setCameraLookAt,
    setCameraLookAtMultiplier,
    setDirectionalLightPosition,
    setCardsPosition,
    setCardsRotation,
  } = useSetup();
  const setup = async (gameId) => {
    const {
      position,
      lookAt,
      multiplier,
      directionalLightPosition,
      cardsPosition,
      cardsRotation,
    } = await getSetupData(gameId);
    setCameraPosition(position);
    setCameraLookAt(lookAt);
    setCameraLookAtMultiplier(multiplier);
    setDirectionalLightPosition(directionalLightPosition);
    setCardsPosition(cardsPosition);
    setCardsRotation(cardsRotation);
  };

  useEffect(() => {
    const join = async () => {
      const gameId = window.location.href.split("/").pop();
      if (!localStorage.getItem("name")) await FirebaseLogger();
      await joinToGame(gameId);
      await setup(gameId);
    };
    join();
  }, []);
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
