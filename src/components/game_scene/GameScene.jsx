import React, { useEffect, useRef, useState } from "react";
import Hand from "../objects/hand/Hand";
import OtherPlayerCards from "../objects/otherPlayerHands/OtherPlayerHands";
import StartGameUI from "../objects/startGameUI";
import Input from "../lobby/util/Input";
import SpinningWheel from "../objects/SpinningWheel";
import PointsDisplayer from "../objects/PointsDisplayer";
import ActionButton from "../objects/ActionButton";
import { useGameLogic } from "./useGameLogic";
import { fetchAllPhotos } from "../firebase/gameMethods";
import { joinToGame } from "../firebase/lobbyMethods";
import FirebaseLogger from "../lobby/firebase/firebaseLogger";

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
    allPhotos,
    setAllPhotos,
  } = setupContext;

  // Refs
  const handRef = useRef();
  const chosenWordLabelRef = useRef();
  const acceptButtonRef = useRef();
  const declineButtonRef = useRef();
  const nextRoundButtonRef = useRef();
  const refreshCardsExecuted = useRef(false);

  // State variables
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
  const [acceptButtonSetupData, setAcceptButtonSetupData] = useState(null);
  const [declineButtonSetupData, setDeclineButtonSetupData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [pointsAdded, setPointsAdded] = useState(false);
  const [afterVoteData, setAfterVoteData] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);

  const {
    setup,
    refreshCards,
    handleNewRound,
    handleAcceptOnVotingPhaseClicked,
    handleDeclineOnVotingPhaseClicked,
    nextRoundButtonData,
    fetchDataAndHostTheGame,
  } = useGameLogic({
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
    setGameData,
    gameData,
  });

  // Initial setup when component mounts
  useEffect(() => {
    const join = async () => {
      const gameId = window.location.href.split("/").pop();
      if (!localStorage.getItem("name")) await FirebaseLogger();
      await joinToGame(gameId);
      await setup();
      const photos = await fetchAllPhotos();
      setAllPhotos(photos);
      setJoined(true);
    };
    join();
  }, []);

  // Refresh cards when hand ref is available
  useEffect(() => {
    if (joined && handRef.current && !refreshCardsExecuted.current) {
      refreshCards();
    }
  }, [joined, handRef.current]);

  // Update fetched photos when allPhotos changes
  useEffect(() => {
    setFetchedPhotos(allPhotos);
  }, [allPhotos]);

  // Fetch game data periodically
  useEffect(() => {
    const interval = setInterval(fetchDataAndHostTheGame, 1000);
    return () => clearInterval(interval);
  }, [direction, pointsAdded, round, hasVoted]);

  // Loading state
  if (!joined || !allPhotos.length) {
    return <SpinningWheel />;
  }

  return (
    <>
      {votingPhase && (
        <PointsDisplayer
          players={players}
          afterVotePhase={typeof afterVoteData === "object"}
        />
      )}

      {typeof afterVoteData === "object" && isThisPlayerHost && (
        <ActionButton
          ref={nextRoundButtonRef}
          onClick={handleNewRound}
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
              defaultText={"Your special word..."}
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
