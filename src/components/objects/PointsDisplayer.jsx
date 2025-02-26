import { useEffect } from "react";
import { getPointDisplayerData } from "../firebase/uiMethods";
import PointDisplay from "./PointDisplay";
import { useSetup } from "../context/SetupContext";

const PointsDisplayer = ({ players, afterVotePhase }) => {
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
            pointsInThisRound={player.pointsInThisRound}
            key={index}
            afterVotePhase={afterVotePhase}
          />
        );
      })}
    </>
  );
};
export default PointsDisplayer;
