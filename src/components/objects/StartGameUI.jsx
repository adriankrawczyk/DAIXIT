import { useSetup } from "../context/SetupContext";
import { getCenteredButtonData } from "../firebase/uiMethods";
import { useRef } from "react";
import ActionButton from "./ActionButton";
import { Text } from "@react-three/drei";
import { updateGameWithData } from "../firebase/gameMethods";
import { updatePlayerInGame } from "../firebase/playerMethods";

const StartGameUI = ({
  numberOfPlayers,
  isThisPlayerHost,
  gameData,
  setIsThisPlayerWordMaker,
}) => {
  const { direction } = useSetup();
  const startButtonRef = useRef();
  const startButtonSetupData = getCenteredButtonData(direction);
  const fontSize = 0.25;
  const handleStartClick = async () => {
    // if (numberOfPlayers < 3) return;
    const players = Object.values(gameData.players);
    const playerUid = localStorage.getItem("playerUid");
    if (
      isThisPlayerHost &&
      !players.some((player) => player.wordMaker === true)
    ) {
      // Set random word maker if there is none
      //   const randomIndex = Math.floor(Math.random() * players.length);
      const randomIndex = players.length - 1;
      const selectedPlayerUid = players[randomIndex].playerUid;
      if (selectedPlayerUid === playerUid) setIsThisPlayerWordMaker(true);
      await updatePlayerInGame(selectedPlayerUid, { wordMaker: true });
    }
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
