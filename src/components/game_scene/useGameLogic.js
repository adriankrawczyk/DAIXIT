import { useState, useCallback } from "react";
import { fetchGameData, joinToGame } from "../firebase/lobbyMethods";
import {
  getOtherPlayerSelectedCards,
  getPosition,
  updateGameWithData,
  getHandFromDatabase,
  setHandInDatabase,
  getRandomCard,
  getSelectedCard,
  fetchAllPhotos,
} from "../firebase/gameMethods";
import {
  calculateAndAddPoints,
  removePlayerFromGame,
  updateThisPlayerInGame,
  handleNextRound as nextRound,
  updatePlayerInGame,
} from "../firebase/playerMethods";
import {
  getCenteredButtonData,
  getLeftTopButtonData,
  getAcceptPositionSetupData,
  getDeclinePositionSetupData,
  getNextRoundButtonData,
} from "../firebase/uiMethods";
import { animateToPosition, rotateOnTable } from "../firebase/animations";
import FirebaseLogger from "../lobby/firebase/firebaseLogger";

export const useGameLogic = ({
  direction,
  handRef,
  votingPhase,
  fetchedPhotos,
  setFetchedPhotos,
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
  votingSelectedCardRef,
  votingSelectedCardPosition,
  votingSelectedCardData,
  setChosenWordLabelData,
  setAcceptButtonSetupData,
  setDeclineButtonSetupData,
  setIsThisPlayerHost,
  setNumberOfPlayers,
  setGameStarted,
  setPlayers,
  hasVoted,
  pointsAdded,
  round,
  setCameraPosition,
  setCameraLookAt,
  setCameraLookAtMultiplier,
  setDirectionalLightPosition,
  setCardsPosition,
  setCardsRotation,
  setPlayerPosition,
  setDirection,
  setInputData,
  setJoined,
  setAllPhotos,
  refreshCardsExecuted,
}) => {
  // Setup function to initialize camera and position settings
  const setup = useCallback(async () => {
    const pos = await getPosition();
    const {
      playerPosition,
      position,
      lookAt,
      multiplier,
      directionalLightPosition,
      cardsPosition,
      cardsRotation,
    } = pos;
    const dir = pos.direction;
    setCameraPosition(position);
    setCameraLookAt(lookAt);
    setCameraLookAtMultiplier(multiplier);
    setDirectionalLightPosition(directionalLightPosition);
    setCardsPosition(cardsPosition);
    setCardsRotation(cardsRotation);
    setPlayerPosition(playerPosition);
    setDirection(dir);
    setInputData(getCenteredButtonData(dir));
    setChosenWordLabelData(getLeftTopButtonData(dir, votingPhase));
  }, [votingPhase]);

  // Refresh cards when hand ref is available
  const refreshCards = useCallback(async () => {
    if (!handRef.current || refreshCardsExecuted.current) return;
    refreshCardsExecuted.current = true;
    const thisPlayerSelectedCardFromDatabase = await getSelectedCard();

    if (thisPlayerSelectedCardFromDatabase) {
      await handRef.current.acceptClicked(
        thisPlayerSelectedCardFromDatabase.url,
        thisPlayerSelectedCardFromDatabase.index
      );
      if (votingPhase) {
        rotateOnTable(
          handRef.current.cardsRef.current[
            thisPlayerSelectedCardFromDatabase.index
          ]
        );
      }
    }
  }, [handRef, votingPhase, refreshCardsExecuted]);

  // Handle new round when round changes
  const handleNewRound = useCallback(async () => {
    setRound((prev) => prev + 1);
    setPointsAdded(false);
    setVotingPhase(false);
    setHasVoted(false);
    setAfterVoteData(null);
    setVotingSelectedCardRef(null);
    setVotingSelectedCardPosition(null);
    setIsVotingSelectedCardThisPlayers(false);
    setVotingSelectedCardData({});
    setIsThisPlayerWordMaker(false);
    setWordMakerText("");
    setChosenWord("");
    setChosenCard({});

    if (!handRef.current) return;
    const index = handRef.current.selectedCard;
    handRef.current.backToHand(index);
    handRef.current.setSelectedCard(-1);

    if (fetchedPhotos.length > 0) {
      const currentHand = await getHandFromDatabase();
      if (currentHand && currentHand.length > 0) {
        const newCard = getRandomCard(fetchedPhotos, setFetchedPhotos);
        setFetchedPhotos(fetchedPhotos.filter((url) => url !== newCard));
        const updatedHand = [...currentHand];
        updatedHand[index] = newCard;
        await setHandInDatabase(updatedHand);
        handRef.current.updateCardUrl(index, newCard);
      }
    }

    // Call the imported handleNextRound function
    await nextRound();
  }, [handRef, fetchedPhotos, setFetchedPhotos]);

  // Handle accept button click in voting phase
  const handleAcceptOnVotingPhaseClicked = useCallback(async () => {
    setHasVoted(true);
    await updateThisPlayerInGame({ votingSelectedCardData });
    handleDeclineOnVotingPhaseClicked();
  }, [votingSelectedCardData]);

  // Handle decline button click in voting phase
  const handleDeclineOnVotingPhaseClicked = useCallback(() => {
    animateToPosition(votingSelectedCardRef, votingSelectedCardPosition);
    setVotingSelectedCardPosition({});
    setVotingSelectedCardRef(null);
  }, [votingSelectedCardRef, votingSelectedCardPosition]);

  // Fetch game data and update game state
  const fetchDataAndHostTheGame = useCallback(async () => {
    const fetchedGameData = await fetchGameData();
    const { started, hostUid, chosenWord } = fetchedGameData;
    const votPhase = fetchedGameData.votingPhase;
    const newRound = fetchedGameData.round;
    const afterVotData = fetchedGameData.afterVoteData;
    const playerUid = localStorage.getItem("playerUid");
    const isHost = hostUid === playerUid;
    const fetchedPlayers = Object.values(fetchedGameData.players);
    let voted = false;

    // Check and fix player positions if needed (host only)
    if (isHost) {
      const positionMap = new Map();
      const playersNeedingUpdate = [];
      let doTheUpdate = false;

      fetchedPlayers.forEach((player) => {
        let originalPosition = player.position;

        while (positionMap.has(player.position)) {
          doTheUpdate = true;
          player.position++;
        }

        positionMap.set(player.position, player.playerUid);
        if (player.position !== originalPosition) {
          playersNeedingUpdate.push({
            playerUid: player.playerUid,
            newPosition: player.currentGameData.position,
          });
        }
      });

      if (doTheUpdate && playersNeedingUpdate.length > 0) {
        await Promise.all(
          playersNeedingUpdate.map((playerUpdate) =>
            updatePlayerInGame(playerUpdate.playerUid, {
              position: playerUpdate.newPosition,
            })
          )
        );
      }
    }

    // Check player states
    let everyPlayerAcceptedCard = true;
    let everyPlayerHasVoted = votPhase;

    for (const fetchedPlayer of fetchedPlayers) {
      // Check if this player has voted
      if (
        fetchedPlayer.playerUid === playerUid &&
        typeof fetchedPlayer.votingSelectedCardData === "object"
      ) {
        voted = true;
      }

      // Check if all non-wordmaker players have voted
      if (
        !fetchedPlayer.wordMaker &&
        typeof fetchedPlayer.votingSelectedCardData !== "object"
      ) {
        everyPlayerHasVoted = false;
      }

      // Check if this player is the wordmaker
      if (fetchedPlayer.playerUid === playerUid && fetchedPlayer.wordMaker)
        setIsThisPlayerWordMaker(true);

      // Remove players who left the game
      if (
        !started &&
        !fetchedPlayer.inGame &&
        fetchedPlayer.playerUid !== playerUid
      ) {
        await removePlayerFromGame(fetchedPlayer.playerUid);
      }

      // Check if all players have chosen a card
      if (
        !fetchedPlayer.chosenCard ||
        !Object.values(fetchedPlayer.chosenCard).length
      )
        everyPlayerAcceptedCard = false;
    }

    // Update game phase if needed (host only)
    if (isHost && started && chosenWord.length && everyPlayerAcceptedCard) {
      await updateGameWithData({ votingPhase: true });
    } else if (isHost && votPhase && !everyPlayerHasVoted) {
      await updateGameWithData({ votingPhase: false });
    }

    // Handle round change
    if (newRound && newRound !== round) {
      await handleNewRound(newRound);
    }

    // Calculate points after all players have voted
    if (everyPlayerHasVoted && isHost && !pointsAdded) {
      setPointsAdded(true);
      const calculatedPoints = await calculateAndAddPoints();
      await updateGameWithData({
        afterVoteData: calculatedPoints,
      });
    }

    // Update UI elements
    setChosenWordLabelData(getLeftTopButtonData(direction, votPhase));
    setAcceptButtonSetupData(getAcceptPositionSetupData(direction, votPhase));
    setDeclineButtonSetupData(getDeclinePositionSetupData(direction, votPhase));
    setAfterVoteData(afterVotData);
    setVotingPhase(votPhase);
    setIsThisPlayerHost(isHost);
    setChosenWord(chosenWord);
    setNumberOfPlayers(fetchedPlayers.length);
    setGameStarted(started);
    setPlayers(fetchedPlayers);

    if (voted && !hasVoted) setHasVoted(true);
  }, [direction, pointsAdded, round, hasVoted, handleNewRound]);

  return {
    setup,
    refreshCards,
    handleNewRound,
    handleAcceptOnVotingPhaseClicked,
    handleDeclineOnVotingPhaseClicked,
    nextRoundButtonData: getNextRoundButtonData(),
    fetchDataAndHostTheGame,
  };
};
