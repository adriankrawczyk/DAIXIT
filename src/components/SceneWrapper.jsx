import React from "react";
import AllLights from "./lights/AllLights";
import CameraControls from "./camera/CameraControls";
import Cone from "./objects/Cone";
import FullBackground from "./background/FullBackground";
import SpinningWheel from "./objects/SpinningWheel";
import GameScene from "./GameScene";
import { useSetup } from "./context/SetupContext";

const SceneWrapper = () => {
  const setupContext = useSetup();

  return (
    <>
      <AllLights />
      <CameraControls />
      <GameScene setupContext={setupContext}>
        {(joined) => (
          <>
            {joined ? (
              <>
                <Cone />
                <FullBackground />
              </>
            ) : (
              <SpinningWheel />
            )}
          </>
        )}
      </GameScene>
    </>
  );
};

export default SceneWrapper;
