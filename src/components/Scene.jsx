import React, { useEffect, useState } from "react";
import AllLights from "./lights/AllLights";
import CameraControls from "./camera/CameraControls";
import Table from "./objects/Table";
import Hand from "./objects/Hand";
import { OrbitControls } from "@react-three/drei";
import FullBackground from "./background/FullBackground";
import Paddle_Boat from "../../public/Paddle_Boat";
import Cone from "./objects/Cone";
import { getActivePlayersInGame, joinToGame } from "./firebase/lobbyMethods";
import { useSetup } from "./context/SetupContext";
import { getPosition } from "./firebase/gameMethods";
import FirebaseLogger from "./lobby/firebase/firebaseLogger";
import OtherPlayerCards from "./objects/OtherPlayerHands";
import SpinningWheel from "./objects/SpinningWheel";

const Scene = () => {
  const [joined, setJoined] = useState(false);
  const {
    setCameraPosition,
    setCameraLookAt,
    setCameraLookAtMultiplier,
    setDirectionalLightPosition,
    setCardsPosition,
    setCardsRotation,
    setPlayerPosition,
    setDirection,
  } = useSetup();
  const setup = async (gameId) => {
    const {
      playerPosition,
      position,
      lookAt,
      multiplier,
      directionalLightPosition,
      cardsPosition,
      cardsRotation,
      direction,
    } = await getPosition();

    setCameraPosition(position);
    setCameraLookAt(lookAt);
    setCameraLookAtMultiplier(multiplier);
    setDirectionalLightPosition(directionalLightPosition);
    setCardsPosition(cardsPosition);
    setCardsRotation(cardsRotation);
    setPlayerPosition(playerPosition);
    setDirection(direction);
  };

  useEffect(() => {
    const join = async () => {
      const gameId = window.location.href.split("/").pop();
      if (!localStorage.getItem("name")) await FirebaseLogger();
      await joinToGame(gameId);
      await setup(gameId);
      setJoined(true);
    };
    join();
  }, []);
  return (
    <>
      <AllLights />
      <CameraControls />
      {joined ? (
        <>
          <Hand numberOfCards={5} />
          <OtherPlayerCards />
          <Cone />
          <FullBackground />
        </>
      ) : (
        <SpinningWheel />
      )}
    </>
  );
};

export default Scene;
