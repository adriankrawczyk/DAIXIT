import React, { useEffect, useState, useRef } from "react";
import Hand from "./objects/Hand";
import OtherPlayerCards from "./objects/OtherPlayerHands";
import StartGameUI from "./objects/startGameUI";
import Input from "./lobby/util/Input";
import SpinningWheel from "./objects/SpinningWheel";
import { fetchGameData, joinToGame } from "./firebase/lobbyMethods";
import {
  getOtherPlayerSelectedCards,
  getPosition,
  updateGameWithData,
} from "./firebase/gameMethods";
import FirebaseLogger from "./lobby/firebase/firebaseLogger";
import { rotateOnTable } from "./firebase/animations";
import {
  calculateAndAddPoints,
  removePlayerFromGame,
  updateThisPlayerInGame,
  handleNextRound,
  updatePlayerInGame,
  getSelectedCard,
} from "./firebase/playerMethods";
import { fetchAllPhotos, getCardsPosition } from "./firebase/gameMethods";
import {
  getCenteredButtonData,
  getLeftTopButtonData,
  getAcceptPositionSetupData,
  getDeclinePositionSetupData,
  getNextRoundButtonData,
} from "./firebase/uiMethods";
import { getHandFromDatabase, setHandInDatabase } from "./firebase/gameMethods";
import ActionButton from "./objects/ActionButton";
import { animateToPosition, backToHand } from "./firebase/animations";
import { getRandomCard } from "./firebase/gameMethods";
import { playerUid } from "./firebase/localVariables";
import PointsDisplayer from "./objects/PointsDisplayer";

const GameScene = ({ setupContext }) => {
  // Setup context
  const {
    setCameraPosition,
    setCameraLookAt,
    setCameraLookAtMultiplier,
    setDirectionalLightPosition,
    setCardsPosition,
    setCardsRotation,
    setPlayerPosition,
    setDirection,
    joined,
    setJoined,
    setChosenWord,
    chosenWord,
    setVotingPhase,
    direction,
    votingPhase,
    round,
    setRound,
    cardsPosition,
    cardsRotation,
    setChosenCard,
    allPhotos,
    setAllPhotos,
  } = setupContext;

  // Game state management
  const [gameData, setGameData] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [numberOfPlayers, setNumberOfPlayers] = useState(1);
  const [isThisPlayerHost, setIsThisPlayerHost] = useState(false);
  const [isThisPlayerWordMaker, setIsThisPlayerWordMaker] = useState(false);
  const [inputData, setInputData] = useState({});
  const [fetchedPhotos, setFetchedPhotos] = useState([]);
  const [wordMakerText, setWordMakerText] = useState("");
  const [chosenWordLabelData, setChosenWordLabelData] = useState({});

  // Voting phase state management
  const [votingSelectedCardRef, setVotingSelectedCardRef] = useState(null);
  const [votingSelectedCardPosition, setVotingSelectedCardPosition] =
    useState(null);
  const [isVotingSelectedCardThisPlayers, setIsVotingSelectedCardThisPlayers] =
    useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votingSelectedCardData, setVotingSelectedCardData] = useState({});

  // References for UI elements
  const acceptButtonRef = useRef();
  const declineButtonRef = useRef();
  const handRef = useRef();
  const [selectedCards, setSelectedCards] = useState([]);
  const chosenWordLabelRef = useRef();

  // UI button positioning data
  const [acceptButtonSetupData, setAcceptButtonSetupData] = useState(null);
  const [declineButtonSetupData, setDeclineButtonSetupData] = useState(null);

  // Player and scoring data
  const [players, setPlayers] = useState([]);
  const [pointsAdded, setPointsAdded] = useState(false);
  const [afterVoteData, setAfterVoteData] = useState(null);
  const nextRoundButtonRef = useRef();
  const refreshCardsExecuted = useRef(false);

  // Initialize game setup by fetching position data and camera settings
  const setup = async () => {
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

    // Set up camera and positioning
    setCameraPosition(position);
    setCameraLookAt(lookAt);
    setCameraLookAtMultiplier(multiplier);
    setDirectionalLightPosition(directionalLightPosition);
    setCardsPosition(cardsPosition);
    setCardsRotation(cardsRotation);
    setPlayerPosition(playerPosition);
    setDirection(dir);

    // Initialize UI positioning data
    setInputData(getCenteredButtonData(dir));
    setChosenWordLabelData(getLeftTopButtonData(direction, votingPhase));
  };

  // Effect hook to join the game and set up initial state
  useEffect(() => {
    const join = async () => {
      // Extract game ID from URL
      const gameId = window.location.href.split("/").pop();
      // Initialize Firebase logging
      await FirebaseLogger();
      // Join the game with the extracted ID
      await joinToGame(gameId);
      // Set up game
      await setup();
      // Fetch all available card photos
      const photos = await fetchAllPhotos();
      setAllPhotos(photos);
      setJoined(true);
    };
    join();
  }, []);

  // When refreshing the page / joining when you were already in game, load up card state from database
  const refreshCards = async () => {
    // Prevent duplicate refreshes and check that hand is available
    if (!handRef.current || refreshCardsExecuted.current) return;
    refreshCardsExecuted.current = true;

    // Get any previously selected card from database
    const thisPlayerSelectedCardFromDatabase = await getSelectedCard();

    if (thisPlayerSelectedCardFromDatabase) {
      // Apply the selection if a card was previously selected
      await handRef.current.acceptClicked(
        thisPlayerSelectedCardFromDatabase.url,
        thisPlayerSelectedCardFromDatabase.index
      );
      // Rotate card on table if in voting phase
      if (votingPhase) {
        rotateOnTable(
          handRef.current.cardsRef.current[
            thisPlayerSelectedCardFromDatabase.index
          ]
        );
      }
    }
  };

  // Effect to refresh cards when player joins and hand is available
  useEffect(() => {
    if (joined && handRef.current && !refreshCardsExecuted.current) {
      refreshCards();
    }
  }, [joined, handRef.current]);

  // Update local photos state when allPhotos changes
  useEffect(() => {
    setFetchedPhotos(allPhotos);
  }, [allPhotos]);

  // Main game loop effect - fetches game data and manages game state
  useEffect(() => {
    const fetchDataAndHostTheGame = async () => {
      // Fetch latest game data
      const fetchedGameData = await fetchGameData();
      setGameData(fetchedGameData);

      // Extract game state variables
      const { started, hostUid, chosenWord } = fetchedGameData;
      const votPhase = fetchedGameData.votingPhase;
      const newRound = fetchedGameData.round;
      const afterVotData = fetchedGameData.afterVoteData;
      const isHost = hostUid === playerUid;
      const fetchedPlayers = Object.values(fetchedGameData.players);
      let voted = false;

      // Host-specific logic for player position management
      if (isHost) {
        const positionMap = new Map();
        const playersNeedingUpdate = [];
        let doTheUpdate = false;

        // Ensure players have unique positions
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

        // Update player positions in database if changes were needed
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

      // Track game state flags
      let everyPlayerAcceptedCard = true;
      let everyPlayerHasVoted = votPhase;

      // Process player information
      for (const fetchedPlayer of fetchedPlayers) {
        // Check if this player has voted
        if (
          fetchedPlayer.playerUid === playerUid &&
          typeof fetchedPlayer.votingSelectedCardData === "object"
        ) {
          voted = true;
        }

        // Check if every player has voted (except word maker)
        if (
          !fetchedPlayer.wordMaker &&
          typeof fetchedPlayer.votingSelectedCardData !== "object"
        ) {
          everyPlayerHasVoted = false;
        }

        // Update word maker status for this player
        if (fetchedPlayer.playerUid === playerUid && fetchedPlayer.wordMaker)
          setIsThisPlayerWordMaker(true);

        // Remove players who are no longer in the game
        if (
          !started &&
          !fetchedPlayer.inGame &&
          fetchedPlayer.playerUid !== playerUid
        ) {
          await removePlayerFromGame(fetchedPlayer.playerUid);
        }

        // Check if all players have selected a card
        if (
          !fetchedPlayer.chosenCard ||
          !Object.values(fetchedPlayer.chosenCard).length
        )
          everyPlayerAcceptedCard = false;
      }

      // Host logic for managing game phase transitions
      if (isHost && started && chosenWord.length && everyPlayerAcceptedCard) {
        // If all players have selected cards, move to voting phase
        await updateGameWithData({ votingPhase: true });
      } else if (isHost && votPhase)
        await updateGameWithData({ votingPhase: false });

      // Handle round transitions
      if (newRound && newRound !== round) {
        handleNewRound(newRound);
      }

      // Calculate points at the end of voting if all players have voted
      if (everyPlayerHasVoted && isHost && !pointsAdded) {
        setPointsAdded(true);
        const calculatedPoints = await calculateAndAddPoints();
        await updateGameWithData({
          afterVoteData: calculatedPoints,
        });
      }

      // Update UI positioning based on current game phase
      setChosenWordLabelData(getLeftTopButtonData(direction, votPhase));
      setAcceptButtonSetupData(getAcceptPositionSetupData(direction, votPhase));
      setDeclineButtonSetupData(
        getDeclinePositionSetupData(direction, votPhase)
      );

      // Update state variables with fetched data
      setAfterVoteData(afterVotData);
      setVotingPhase(votPhase);
      setIsThisPlayerHost(isHost);
      setChosenWord(chosenWord);
      setNumberOfPlayers(fetchedPlayers.length);
      setGameStarted(started);
      setPlayers(fetchedPlayers);
      if (voted && !hasVoted) setHasVoted(true);
    };

    // Run fetch on a 1-second interval
    const interval = setInterval(fetchDataAndHostTheGame, 1000);
    return () => clearInterval(interval);
  }, [direction, pointsAdded, round]);

  // Handles the transition to a new round
  const handleNewRound = async (newRound) => {
    // Reset game state for new round
    setRound(newRound);
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

    // Return cards to hand and reset selection
    if (!handRef.current) return;
    const index = handRef.current.selectedCard;
    handRef.current.backToHand(index);
    handRef.current.setSelectedCard(-1);

    // Replace used card with a new one
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
  };

  // Handles accepting a card selection during voting phase
  const handleAcceptOnVotingPhaseClicked = async () => {
    setHasVoted(true);
    // Update player's vote in database
    await updateThisPlayerInGame({ votingSelectedCardData });
    handleDeclineOnVotingPhaseClicked();
  };

  // Get positioning data for decline button
  const declineButtonData = getDeclinePositionSetupData(direction);

  // Handles canceling a card selection during voting phase
  const handleDeclineOnVotingPhaseClicked = () => {
    // Animate card back to its original position
    animateToPosition(votingSelectedCardRef, votingSelectedCardPosition);
    setVotingSelectedCardPosition({});
    setVotingSelectedCardRef(null);
  };

  // Get positioning data for next round button
  const nextRoundButtonData = getNextRoundButtonData();

  // Show loading spinner if not joined or photos not loaded
  if (!joined || !allPhotos.length) {
    return <SpinningWheel />;
  }

  return (
    <>
      {/* Display player points during voting phase */}
      {votingPhase && (
        <PointsDisplayer
          players={players}
          afterVotePhase={typeof afterVoteData === "object"}
        />
      )}

      {/* Show next round button for host after voting is complete */}
      {typeof afterVoteData === "object" && isThisPlayerHost && (
        <ActionButton
          ref={nextRoundButtonRef}
          onClick={handleNextRound}
          buttonSetupData={nextRoundButtonData}
          color="lightgreen"
          text="next round"
          defaultScale={1}
          fontSize={0.2}
        />
      )}

      {/* Main game UI */}
      {gameStarted ? (
        <>
          {/* Word input for the word maker */}
          {isThisPlayerWordMaker && !chosenWord.length && (
            <Input
              position={[
                inputData.position[0],
                inputData.position[1] + 0.5,
                inputData.position[2],
              ]}
              dimensions={[2, 0.5, 0.01]}
              defaultText={"Your special word..."}
              set={setWordMakerText}
              fontSize={18}
              rotation={inputData.rotation}
              textPosition={inputData.textPosition}
              textScale={inputData.textScaleMultiplier}
            />
          )}

          {/* Display the chosen word or waiting message */}
          {(!isThisPlayerWordMaker || chosenWord.length) && (
            <ActionButton
              ref={chosenWordLabelRef}
              onClick={() => {}}
              buttonSetupData={chosenWordLabelData}
              color="lightgray"
              text={chosenWord.length ? chosenWord : "waiting for wordmaker..."}
              defaultScale={1}
              fontSize={0.125}
            />
          )}

          {/* Voting UI buttons for accepting/declining card selection */}
          {votingPhase &&
            votingSelectedCardRef &&
            !isVotingSelectedCardThisPlayers &&
            !hasVoted &&
            !isThisPlayerWordMaker && (
              <>
                <ActionButton
                  ref={acceptButtonRef}
                  onClick={handleAcceptOnVotingPhaseClicked}
                  buttonSetupData={acceptButtonSetupData}
                  color="lightgreen"
                  text="accept"
                  defaultScale={1}
                />
                <ActionButton
                  ref={declineButtonRef}
                  onClick={handleDeclineOnVotingPhaseClicked}
                  buttonSetupData={declineButtonSetupData}
                  color="red"
                  text="cancel"
                  defaultScale={1}
                />
              </>
            )}

          {/* Player's hand of cards */}
          <Hand
            ref={handRef}
            numberOfCards={7}
            fetchedPhotos={fetchedPhotos}
            isThisPlayerHost={isThisPlayerHost}
            isThisPlayerWordMaker={isThisPlayerWordMaker}
            wordMakerText={
              wordMakerText === "Your special word..." ? "" : wordMakerText
            }
            setVotingSelectedCardPosition={setVotingSelectedCardPosition}
            setVotingSelectedCardRef={setVotingSelectedCardRef}
            votingSelectedCardRef={votingSelectedCardRef}
            votingSelectedCardPosition={votingSelectedCardPosition}
            setIsVotingSelectedCardThisPlayers={
              setIsVotingSelectedCardThisPlayers
            }
            direction={direction}
            afterVoteData={afterVoteData}
            setFetchedPhotos={setFetchedPhotos}
          />

          {/* Other players' cards */}
          <OtherPlayerCards
            setVotingSelectedCardPosition={setVotingSelectedCardPosition}
            setVotingSelectedCardRef={setVotingSelectedCardRef}
            votingSelectedCardRef={votingSelectedCardRef}
            votingSelectedCardPosition={votingSelectedCardPosition}
            setIsVotingSelectedCardThisPlayers={
              setIsVotingSelectedCardThisPlayers
            }
            setVotingSelectedCardData={setVotingSelectedCardData}
            direction={direction}
            afterVoteData={afterVoteData}
            selectedCards={selectedCards}
            setSelectedCards={setSelectedCards}
            round={round}
            players={players}
          />
        </>
      ) : (
        // Show lobby/start game UI if game hasn't started
        <StartGameUI
          numberOfPlayers={numberOfPlayers}
          isThisPlayerHost={isThisPlayerHost}
          gameData={gameData}
          setIsThisPlayerWordMaker={setIsThisPlayerWordMaker}
          direction={direction}
        />
      )}
    </>
  );
};

export default GameScene;
