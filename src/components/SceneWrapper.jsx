import React, { memo } from "react";
import AllLights from "./lights/AllLights";
import CameraControls from "./camera/CameraControls";
import Cone from "./objects/Cone";
import FullBackground from "./background/FullBackground";
import SpinningWheel from "./objects/SpinningWheel";
import GameScene from "./game_scene/GameScene";
import { useSetup } from "./context/SetupContext";

const StaticSceneElements = memo(() => (
  <>
    <AllLights />
    <CameraControls />
    <Cone />
    <FullBackground />
  </>
));

const LoadingSpinner = memo(() => <SpinningWheel />);

const SceneWrapper = () => {
  const setupContext = useSetup();
  const { joined } = setupContext;

  return (
    <>
      {joined ? <StaticSceneElements /> : <LoadingSpinner />}
      <GameScene setupContext={setupContext} />
    </>
  );
};

export default SceneWrapper;
