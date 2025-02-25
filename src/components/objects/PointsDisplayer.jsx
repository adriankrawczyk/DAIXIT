import { useEffect } from "react";
import { getPointDisplayerData } from "../firebase/uiMethods";
import PointDisplay from "./PointDisplay";
import { useSetup } from "../context/SetupContext";

const PointsDisplayer = ({ players }) => {
  const { direction, votingPhase } = useSetup();
  return (
    <>
      {players.map((player, index) => {
        const setupData = getPointDisplayerData(
          direction,
          player.currentGameData.position,
          votingPhase
        );
        return (
          <PointDisplay
            setupData={setupData}
            playerName={player.name}
            points={player.points}
            key={index}
          />
        );
      })}
    </>
  );
};
export default PointsDisplayer;
