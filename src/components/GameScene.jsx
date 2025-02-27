import React, { useEffect, useState, useRef } from "react";
import Hand from "./objects/Hand";
import OtherPlayerCards from "./objects/OtherPlayerHands";
import StartGameUI from "./objects/startGameUI";
import Input from "./lobby/util/Input";
import SpinningWheel from "./objects/SpinningWheel";
import { fetchGameData, joinToGame } from "./firebase/lobbyMethods";
import { getPosition, updateGameWithData } from "./firebase/gameMethods";
import FirebaseLogger from "./lobby/firebase/firebaseLogger";
import {
  calculateAndAddPoints,
  removePlayerFromGame,
  updateThisPlayerInGame,
  handleNextRound,
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

import PointsDisplayer from "./objects/PointsDisplayer";

const GameScene = ({ setupContext }) => {
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
  } = setupContext;

  const [gameData, setGameData] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [numberOfPlayers, setNumberOfPlayers] = useState(1);
  const [isThisPlayerHost, setIsThisPlayerHost] = useState(false);
  const [isThisPlayerWordMaker, setIsThisPlayerWordMaker] = useState(false);
  const [inputData, setInputData] = useState({});
  const [fetchedPhotos, setFetchedPhotos] = useState([]);
  const [wordMakerText, setWordMakerText] = useState("");
  const [chosenWordLabelData, setChosenWordLabelData] = useState({});
  const [votingSelectedCardRef, setVotingSelectedCardRef] = useState(null);
  const [votingSelectedCardPosition, setVotingSelectedCardPosition] =
    useState(null);
  const [isVotingSelectedCardThisPlayers, setIsVotingSelectedCardThisPlayers] =
    useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votingSelectedCardData, setVotingSelectedCardData] = useState({});
  const acceptButtonRef = useRef();
  const declineButtonRef = useRef();
  const handRef = useRef();
  const [selectedCards, setSelectedCards] = useState([]);

  const chosenWordLabelRef = useRef();
  const [acceptButtonSetupData, setAcceptButtonSetupData] = useState(null);
  const [declineButtonSetupData, setDeclineButtonSetupData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [pointsAdded, setPointsAdded] = useState(false);
  const [afterVoteData, setAfterVoteData] = useState(null);
  const nextRoundButtonRef = useRef();

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
    setCameraPosition(position);
    setCameraLookAt(lookAt);
    setCameraLookAtMultiplier(multiplier);
    setDirectionalLightPosition(directionalLightPosition);
    setCardsPosition(cardsPosition);
    setCardsRotation(cardsRotation);
    setPlayerPosition(playerPosition);
    setDirection(dir);
    setInputData(getCenteredButtonData(dir));
    setChosenWordLabelData(getLeftTopButtonData(direction, votingPhase));
  };

  useEffect(() => {
    const join = async () => {
      const gameId = window.location.href.split("/").pop();
      if (!localStorage.getItem("name")) await FirebaseLogger();
      await joinToGame(gameId);
      await setup();
      setJoined(true);
      const allPhotos = await fetchAllPhotos();
      setFetchedPhotos(allPhotos);
    };
    join();
  }, []);

  useEffect(() => {
    const fetchDataAndHostTheGame = async () => {
      const fetchedGameData = await fetchGameData();
      setGameData(fetchedGameData);
      const { started, hostUid, chosenWord } = fetchedGameData;
      const votPhase = fetchedGameData.votingPhase;
      const newRound = fetchedGameData.round;
      const afterVotData = fetchedGameData.afterVoteData;
      const playerUid = localStorage.getItem("playerUid");
      const isHost = hostUid === playerUid;
      const fetchedPlayers = Object.values(fetchedGameData.players);
      let everyPlayerAcceptedCard = true;
      let everyPlayerHasVoted = votPhase;
      for (const fetchedPlayer of fetchedPlayers) {
        if (
          !fetchedPlayer.wordMaker &&
          typeof fetchedPlayer.votingSelectedCardData !== "object"
        ) {
          everyPlayerHasVoted = false;
        }
        if (fetchedPlayer.playerUid === playerUid && fetchedPlayer.wordMaker)
          setIsThisPlayerWordMaker(true);
        if (
          !started &&
          !fetchedPlayer.inGame &&
          fetchedPlayer.playerUid !== playerUid
        ) {
          await removePlayerFromGame(fetchedPlayer.playerUid);
        }
        if (
          !fetchedPlayer.chosenCard ||
          !Object.values(fetchedPlayer.chosenCard).length
        )
          everyPlayerAcceptedCard = false;
      }
      if (isHost && started && chosenWord.length && everyPlayerAcceptedCard) {
        await updateGameWithData({ votingPhase: true });
      } else if (isHost && votPhase)
        await updateGameWithData({ votingPhase: false });
      if (afterVotData && votPhase && newRound !== round) {
        handleNewRound(newRound);
      }
      if (everyPlayerHasVoted && isHost && !pointsAdded) {
        setPointsAdded(true);
        const calculatedPoints = await calculateAndAddPoints();
        await updateGameWithData({
          afterVoteData: calculatedPoints,
        });
      }

      setChosenWordLabelData(getLeftTopButtonData(direction, votPhase));
      setAcceptButtonSetupData(getAcceptPositionSetupData(direction, votPhase));
      setDeclineButtonSetupData(
        getDeclinePositionSetupData(direction, votPhase)
      );
      setAfterVoteData(afterVotData);
      setVotingPhase(votPhase);
      setIsThisPlayerHost(isHost);
      setChosenWord(chosenWord);
      setNumberOfPlayers(fetchedPlayers.length);
      setGameStarted(started);
      setPlayers(fetchedPlayers);
    };

    const interval = setInterval(fetchDataAndHostTheGame, 1000);
    return () => clearInterval(interval);
  }, [direction, pointsAdded, round]);

  const handleNewRound = async (newRound) => {
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
    setSelectedCards([]);
    setChosenCard({});
    handRef.current.backToHand(handRef.current.selectedCard);
    handRef.current.setSelectedCard(-1);
    if (fetchedPhotos.length > 0) {
      const currentHand = await getHandFromDatabase();
      if (currentHand && currentHand.length > 0) {
        const newCard = getRandomCard(fetchedPhotos);
        const updatedHand = [...currentHand];
        updatedHand[index] = newCard;
        await setHandInDatabase(updatedHand);
        handRef.current.updateCardUrl(index, newCard);
      }
    }
  };

  const handleAcceptOnVotingPhaseClicked = async () => {
    setHasVoted(true);
    await updateThisPlayerInGame({ votingSelectedCardData });
    handleDeclineOnVotingPhaseClicked();
  };

  const declineButtonData = getDeclinePositionSetupData(direction);

  const handleDeclineOnVotingPhaseClicked = () => {
    animateToPosition(votingSelectedCardRef, votingSelectedCardPosition);
    setVotingSelectedCardPosition({});
    setVotingSelectedCardRef(null);
  };

  const nextRoundButtonData = getNextRoundButtonData();

  if (!joined) {
    return <SpinningWheel />;
  }

  return (
    <>
      <PointsDisplayer
        players={players}
        afterVotePhase={typeof afterVoteData === "object"}
      />
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
      {gameStarted ? (
        <>
          {isThisPlayerWordMaker && !chosenWord.length && (
            <Input
              position={[
                inputData.position[0],
                inputData.position[1] + 0.5,
                inputData.position[2],
              ]}
              dimensions={[2, 0.5, 0.01]}
              defaultText={""}
              set={setWordMakerText}
              fontSize={18}
              rotation={inputData.rotation}
              textPosition={inputData.textPosition}
              textScale={inputData.textScaleMultiplier}
            />
          )}
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
          <Hand
            ref={handRef}
            numberOfCards={5}
            fetchedPhotos={fetchedPhotos}
            isThisPlayerHost={isThisPlayerHost}
            isThisPlayerWordMaker={isThisPlayerWordMaker}
            wordMakerText={wordMakerText}
            setVotingSelectedCardPosition={setVotingSelectedCardPosition}
            setVotingSelectedCardRef={setVotingSelectedCardRef}
            votingSelectedCardRef={votingSelectedCardRef}
            votingSelectedCardPosition={votingSelectedCardPosition}
            setIsVotingSelectedCardThisPlayers={
              setIsVotingSelectedCardThisPlayers
            }
            direction={direction}
            afterVoteData={afterVoteData}
          />
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
          />
        </>
      ) : (
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
