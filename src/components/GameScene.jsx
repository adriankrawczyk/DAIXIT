import React, { useEffect, useState, useRef } from "react";
import Hand from "./objects/Hand";
import OtherPlayerCards from "./objects/OtherPlayerHands";
import StartGameUI from "./objects/startGameUI";
import Input from "./lobby/util/Input";
import SpinningWheel from "./objects/SpinningWheel";
import { fetchGameData, joinToGame } from "./firebase/lobbyMethods";
import { getPosition, updateGameWithData } from "./firebase/gameMethods";
import FirebaseLogger from "./lobby/firebase/firebaseLogger";
import { removePlayerFromGame } from "./firebase/playerMethods";
import { fetchAllPhotos } from "./firebase/gameMethods";
import {
  getCenteredButtonData,
  getLeftTopButtonData,
} from "./firebase/uiMethods";
import ActionButton from "./objects/ActionButton";

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

  const chosenWordLabelRef = useRef();

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
    setChosenWordLabelData(getLeftTopButtonData(dir, false));
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
      const { started, hostUid, chosenWord, votingPhase } = fetchedGameData;
      const playerUid = localStorage.getItem("playerUid");
      const isHost = hostUid === playerUid;
      const players = Object.values(fetchedGameData.players);
      let everyPlayerAcceptedCard = true;
      for (const player of players) {
        if (player.playerUid === playerUid && player.wordMaker)
          setIsThisPlayerWordMaker(true);
        if (!started && !player.inGame && player.playerUid !== playerUid) {
          await removePlayerFromGame(player.playerUid);
        }
        if (!player.chosenCard || !Object.values(player.chosenCard).length)
          everyPlayerAcceptedCard = false;
      }
      if (isHost && started && chosenWord.length && everyPlayerAcceptedCard) {
        await updateGameWithData({ votingPhase: true });
      }
      setChosenWordLabelData(getLeftTopButtonData(direction, votingPhase));
      setVotingPhase(votingPhase);
      setIsThisPlayerHost(isHost);
      setChosenWord(chosenWord);
      setNumberOfPlayers(players.length);
      setGameStarted(started);
    };

    const interval = setInterval(fetchDataAndHostTheGame, 1000);
    return () => clearInterval(interval);
  }, [direction]);
  if (!joined) {
    return <SpinningWheel />;
  }

  return gameStarted ? (
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
        direction={direction}
      />
      <OtherPlayerCards
        setVotingSelectedCardPosition={setVotingSelectedCardPosition}
        setVotingSelectedCardRef={setVotingSelectedCardRef}
        votingSelectedCardRef={votingSelectedCardRef}
        votingSelectedCardPosition={votingSelectedCardPosition}
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
  );
};

export default GameScene;
