import {
  getHandFromDatabase,
  setHandInDatabase,
  getRandomCard,
} from "../../firebase/gameMethods";
import { handleNextRound as firebaseNextRound } from "../../firebase/playerMethods";

export const useRoundManagement = ({
  setRound,
  setPointsAdded,
  setVotingPhase,
  setHasVoted,
  setAfterVoteData,
  setVotingSelectedCardRef,
  setVotingSelectedCardPosition,
  setIsVotingSelectedCardThisPlayers,
  setVotingSelectedCardData,
  setIsThisPlayerWordMaker,
  setWordMakerText,
  setChosenWord,
  setChosenCard,
  handRef,
  fetchedPhotos,
  setFetchedPhotos,
}) => {
  const handleNewRound = async (newRound) => {
    setRound(newRound);
    setPointsAdded(false); // Reset points added flag
    setHasVoted(false); // Reset voting status
    setVotingPhase(false);
    setAfterVoteData(null);
    setVotingSelectedCardRef(null);
    setVotingSelectedCardPosition(null);
    setIsVotingSelectedCardThisPlayers(false);
    setVotingSelectedCardData({});
    setIsThisPlayerWordMaker(false);
    setWordMakerText("");
    setChosenWord("");
    setChosenCard({});

    if (!handRef.current) {
      return;
    }

    const index = handRef.current.selectedCard;
    if (index !== -1) {
      handRef.current.backToHand(index);
      handRef.current.setSelectedCard(-1);
    }

    if (fetchedPhotos.length > 0) {
      const currentHand = await getHandFromDatabase();
      if (currentHand && currentHand.length > 0) {
        const newCard = getRandomCard(fetchedPhotos, setFetchedPhotos);
        if (newCard) {
          setFetchedPhotos(fetchedPhotos.filter((url) => url !== newCard));
          const updatedHand = [...currentHand];
          updatedHand[index] = newCard;
          await setHandInDatabase(updatedHand);
          handRef.current.updateCardUrl(index, newCard);
        }
      }
    }
  };

  const handleNextRound = async () => {
    return await firebaseNextRound();
  };

  return {
    handleNewRound,
    handleNextRound,
  };
};
