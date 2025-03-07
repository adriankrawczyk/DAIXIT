import {
  getHandFromDatabase,
  setHandInDatabase,
  getRandomCard,
} from "../../firebase/gameMethods";
import {
  updateThisPlayerInGame,
  handleNextRound as firebaseHandleNextRound,
} from "../../firebase/playerMethods";
import { animateToPosition } from "../../firebase/animations";

export const useGameActions = ({
  handRef,
  votingSelectedCardRef,
  votingSelectedCardPosition,
  setVotingSelectedCardPosition,
  setVotingSelectedCardRef,
  votingSelectedCardData,
  setHasVoted,
  fetchedPhotos,
  setFetchedPhotos,
}) => {
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

  const handleNextRound = async () => {
    await firebaseHandleNextRound();
  };

  const refreshPlayerHand = async (index) => {
    if (fetchedPhotos.length > 0) {
      const currentHand = await getHandFromDatabase();
      if (currentHand && currentHand.length > 0) {
        const newCard = getRandomCard(fetchedPhotos, setFetchedPhotos);
        setFetchedPhotos(fetchedPhotos.filter((url) => url !== newCard));
        const updatedHand = [...currentHand];
        updatedHand[index] = newCard;
        await setHandInDatabase(updatedHand);
        if (handRef.current) {
          handRef.current.updateCardUrl(index, newCard);
        }
        return newCard;
      }
    }
    return null;
  };

  return {
    handleAcceptOnVotingPhaseClicked,
    handleDeclineOnVotingPhaseClicked,
    handleNextRound,
    refreshPlayerHand,
  };
};
