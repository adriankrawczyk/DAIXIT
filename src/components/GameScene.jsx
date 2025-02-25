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
  removePlayerFromGame,
  updateThisPlayerInGame,
} from "./firebase/playerMethods";
import { fetchAllPhotos } from "./firebase/gameMethods";
import {
  getCenteredButtonData,
  getLeftTopButtonData,
  getAcceptPositionSetupData,
  getDeclinePositionSetupData,
} from "./firebase/uiMethods";
import ActionButton from "./objects/ActionButton";
import { animateToPosition } from "./firebase/animations";
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
  const [votingSelectedCardPosition, setVotingSelectedCardPosition] = useState(
    {}
  );
  const [isVotingSelectedCardThisPlayers, setIsVotingSelectedCardThisPlayers] =
    useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votingSelectedCardData, setVotingSelectedCardData] = useState({});
  const acceptButtonRef = useRef();
  const declineButtonRef = useRef();

  const chosenWordLabelRef = useRef();
  const [acceptButtonSetupData, setAcceptButtonSetupData] = useState(null);
  const [declineButtonSetupData, setDeclineButtonSetupData] = useState(null);
  const [players, setPlayers] = useState([]);

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
      }
      if (everyPlayerHasVoted) {
        console.log("a");
      }
      setChosenWordLabelData(getLeftTopButtonData(direction, votPhase));
      setAcceptButtonSetupData(getAcceptPositionSetupData(direction, votPhase));
      setDeclineButtonSetupData(
        getDeclinePositionSetupData(direction, votPhase)
      );
      setVotingPhase(votPhase);
      setIsThisPlayerHost(isHost);
      setChosenWord(chosenWord);
      setNumberOfPlayers(fetchedPlayers.length);
      setGameStarted(started);
      setPlayers(fetchedPlayers);
    };

    const interval = setInterval(fetchDataAndHostTheGame, 1000);
    return () => clearInterval(interval);
  }, [direction]);

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

  if (!joined) {
    return <SpinningWheel />;
  }

  return (
    <>
      <PointsDisplayer players={players} />
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
