import { useEffect, useState } from "react";
import { updateGameWithData } from "../../firebase/gameMethods";
import {
  calculateAndAddPoints,
  removePlayerFromGame,
  updatePlayerInGame,
} from "../../firebase/playerMethods";
import { fetchGameData } from "../../firebase/lobbyMethods";

export const useGameState = ({
  gameData,
  players,
  isThisPlayerHost,
  setIsThisPlayerHost,
  setIsThisPlayerWordMaker,
  setVotingPhase,
  votingPhase,
  setChosenWord,
  direction,
  round,
  setRound,
  setGameData,
  setGameStarted,
  setPlayers,
}) => {
  // Initialize state variables inside the hook
  const [wordMakerText, setWordMakerText] = useState("");
  const [afterVoteData, setAfterVoteData] = useState(null);
  const [pointsAdded, setPointsAdded] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [lastProcessedRound, setLastProcessedRound] = useState(null);

  useEffect(() => {
    const fetchDataAndUpdateGame = async () => {
      try {
        // Get the latest game data
        const fetchedGameData = await fetchGameData();
        setGameData(fetchedGameData);

        // Extract relevant game information
        const {
          started,
          hostUid,
          chosenWord,
          votingPhase: votPhase,
          round: newRound,
          afterVoteData: afterVotData,
          players: fetchedPlayers = {},
        } = fetchedGameData;

        // Get current player's ID
        const playerUid = localStorage.getItem("playerUid");
        const isHost = hostUid === playerUid;

        // Convert players object to array
        const playersArray = Object.values(fetchedPlayers);
        let voted = false;

        // Handle player positioning (host only)
        if (isHost) {
          await handlePlayerPositioning(playersArray);
        }

        // Check if we need to handle a new round
        if (
          newRound &&
          (lastProcessedRound === null || newRound !== lastProcessedRound)
        ) {
          console.log(
            "New round detected:",
            newRound,
            "Last processed:",
            lastProcessedRound
          );
          // This will dispatch the event to trigger handleNewRound in the parent component
          window.dispatchEvent(
            new CustomEvent("newRound", { detail: { round: newRound } })
          );
          setLastProcessedRound(newRound);
        }

        // Process player statuses
        const { everyPlayerAcceptedCard, everyPlayerHasVoted, userHasVoted } =
          processPlayerStatuses(
            playersArray,
            playerUid,
            votPhase,
            started,
            setIsThisPlayerWordMaker
          );

        // Update game phase if needed (host only)
        if (isHost) {
          await updateGamePhase(
            started,
            chosenWord,
            everyPlayerAcceptedCard,
            votPhase
          );

          // Calculate points if voting is complete
          if (everyPlayerHasVoted && !pointsAdded) {
            await calculatePoints();
          }
        }

        // Update local state with fetched data
        updateLocalState(
          afterVotData,
          votPhase,
          isHost,
          started,
          playersArray,
          chosenWord,
          userHasVoted
        );
      } catch (error) {
        console.error("Error in fetchDataAndUpdateGame:", error);
      }
    };

    const handlePlayerPositioning = async (players) => {
      const positionMap = new Map();
      const playersNeedingUpdate = [];
      let doTheUpdate = false;

      players.forEach((player) => {
        let originalPosition = player.position;

        while (positionMap.has(player.position)) {
          doTheUpdate = true;
          player.position++;
        }

        positionMap.set(player.position, player.playerUid);
        if (player.position !== originalPosition) {
          playersNeedingUpdate.push({
            playerUid: player.playerUid,
            newPosition: player.position,
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
    };

    const processPlayerStatuses = (
      players,
      currentPlayerUid,
      isVotingPhase,
      gameStarted,
      setIsWordMaker
    ) => {
      let everyPlayerAcceptedCard = true;
      let everyPlayerHasVoted = isVotingPhase;
      let userHasVoted = false;

      for (const player of players) {
        // Check if current player has voted
        if (
          player.playerUid === currentPlayerUid &&
          typeof player.votingSelectedCardData === "object"
        ) {
          userHasVoted = true;
        }

        // Check if player is word maker
        if (player.playerUid === currentPlayerUid && player.wordMaker) {
          setIsWordMaker(true);
        }

        // Check if all players have voted
        if (
          !player.wordMaker &&
          typeof player.votingSelectedCardData !== "object"
        ) {
          everyPlayerHasVoted = false;
        }

        // Remove inactive players
        if (
          !gameStarted &&
          !player.inGame &&
          player.playerUid !== currentPlayerUid
        ) {
          removePlayerFromGame(player.playerUid);
        }

        // Check if all players have chosen a card
        if (!player.chosenCard || !Object.values(player.chosenCard).length) {
          everyPlayerAcceptedCard = false;
        }
      }

      return { everyPlayerAcceptedCard, everyPlayerHasVoted, userHasVoted };
    };

    const updateGamePhase = async (
      gameStarted,
      word,
      allCardsAccepted,
      currentVotingPhase
    ) => {
      // Move to voting phase when all cards are chosen
      if (
        gameStarted &&
        word.length &&
        allCardsAccepted &&
        !currentVotingPhase
      ) {
        await updateGameWithData({ votingPhase: true });
      }
    };

    const calculatePoints = async () => {
      setPointsAdded(true);
      const calculatedPoints = await calculateAndAddPoints();
      await updateGameWithData({
        afterVoteData: calculatedPoints,
      });
    };

    const updateLocalState = (
      afterVotData,
      votPhase,
      isHost,
      started,
      fetchedPlayers,
      word,
      voted
    ) => {
      setAfterVoteData(afterVotData);
      setVotingPhase(votPhase);
      setIsThisPlayerHost(isHost);
      setGameStarted(started);
      setPlayers(fetchedPlayers);
      setChosenWord(word);

      if (voted && !hasVoted) {
        setHasVoted(true);
      }
    };

    const interval = setInterval(fetchDataAndUpdateGame, 1000);
    return () => clearInterval(interval);
  }, [direction, pointsAdded, round, lastProcessedRound]);

  // Return state variables to preserve the hook's interface
  return {
    wordMakerText,
    setWordMakerText,
    afterVoteData,
    setAfterVoteData,
    pointsAdded,
    setPointsAdded,
    hasVoted,
    setHasVoted,
  };
};
