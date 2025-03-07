import { useState } from "react";
import { animateToPosition } from "../../firebase/animations";
import { updateThisPlayerInGame } from "../../firebase/playerMethods";

export const useVotingPhase = ({ handRef, setHasVoted }) => {
  const [votingSelectedCardRef, setVotingSelectedCardRef] = useState(null);
  const [votingSelectedCardPosition, setVotingSelectedCardPosition] =
    useState(null);
  const [isVotingSelectedCardThisPlayers, setIsVotingSelectedCardThisPlayers] =
    useState(false);
  const [votingSelectedCardData, setVotingSelectedCardData] = useState({});
  const [selectedCards, setSelectedCards] = useState([]);

  const handleAcceptOnVotingPhaseClicked = async () => {
    setHasVoted(true);
    await updateThisPlayerInGame({ votingSelectedCardData });
    handleDeclineOnVotingPhaseClicked();
  };

  const handleDeclineOnVotingPhaseClicked = () => {
    animateToPosition(votingSelectedCardRef, votingSelectedCardPosition);
    setVotingSelectedCardPosition({});
    setVotingSelectedCardRef(null);
  };

  return {
    votingSelectedCardRef,
    setVotingSelectedCardRef,
    votingSelectedCardPosition,
    setVotingSelectedCardPosition,
    isVotingSelectedCardThisPlayers,
    setIsVotingSelectedCardThisPlayers,
    votingSelectedCardData,
    setVotingSelectedCardData,
    selectedCards,
    setSelectedCards,
    handleAcceptOnVotingPhaseClicked,
    handleDeclineOnVotingPhaseClicked,
  };
};
