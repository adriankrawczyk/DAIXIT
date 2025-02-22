import { useSetup } from "../context/SetupContext";
import { getStartButtonData } from "../firebase/uiMethods";
import { useRef } from "react";
import ActionButton from "./ActionButton";
import { Text } from "@react-three/drei";
import { updateGameWithData } from "../firebase/gameMethods";

const StartGameUI = ({ numberOfPlayers, isThisPlayerHost }) => {
  const { direction } = useSetup();
  const startButtonRef = useRef();
  const startButtonSetupData = getStartButtonData(direction);
  const fontSize = 0.25;
  const handleStartClick = async () => {
    if (numberOfPlayers < 3) return;
    await updateGameWithData({ started: true });
  };
  return (
    <>
      <Text
        scale={[
          startButtonSetupData.textScaleMultiplier[0] * fontSize,
          startButtonSetupData.textScaleMultiplier[1] * fontSize,
          startButtonSetupData.textScaleMultiplier[2] * fontSize,
        ]}
        position={[
          startButtonSetupData.position[0],
          startButtonSetupData.position[1] + 0.5,
          startButtonSetupData.position[2],
        ]}
        rotation={startButtonSetupData.rotation}
      >
        {numberOfPlayers === 1
          ? `1 player in game`
          : `${numberOfPlayers} players in game`}
      </Text>
      {isThisPlayerHost && (
        <ActionButton
          defaultScale={1}
          ref={startButtonRef}
          onClick={handleStartClick}
          buttonSetupData={startButtonSetupData}
          color={numberOfPlayers >= 3 ? "green" : "red"}
          text="start"
        />
      )}
    </>
  );
};
export default StartGameUI;
