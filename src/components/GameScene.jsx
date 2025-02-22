import React, { useEffect, useState } from "react";
import Hand from "./objects/Hand";
import OtherPlayerCards from "./objects/OtherPlayerHands";
import StartGameUI from "./objects/startGameUI";
import Input from "./lobby/util/Input";
import SpinningWheel from "./objects/SpinningWheel";
import { fetchGameData, joinToGame } from "./firebase/lobbyMethods";
import { getPosition } from "./firebase/gameMethods";
import FirebaseLogger from "./lobby/firebase/firebaseLogger";
import { removePlayerFromGame } from "./firebase/playerMethods";
import { fetchAllPhotos } from "./firebase/gameMethods";
import { getCenteredButtonData } from "./firebase/uiMethods";

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
  } = setupContext;

  const [gameData, setGameData] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [numberOfPlayers, setNumberOfPlayers] = useState(1);
  const [isThisPlayerHost, setIsThisPlayerHost] = useState(false);
  const [isThisPlayerWordMaker, setIsThisPlayerWordMaker] = useState(false);
  const [inputData, setInputData] = useState({});
  const [fetchedPhotos, setFetchedPhotos] = useState([]);
  const [wordMakerText, setWordMakerText] = useState("");

  const setup = async (gameId) => {
    const {
      playerPosition,
      position,
      lookAt,
      multiplier,
      directionalLightPosition,
      cardsPosition,
      cardsRotation,
      direction,
    } = await getPosition();

    setCameraPosition(position);
    setCameraLookAt(lookAt);
    setCameraLookAtMultiplier(multiplier);
    setDirectionalLightPosition(directionalLightPosition);
    setCardsPosition(cardsPosition);
    setCardsRotation(cardsRotation);
    setPlayerPosition(playerPosition);
    setDirection(direction);
    setInputData(getCenteredButtonData(direction));
  };

  useEffect(() => {
    const join = async () => {
      const gameId = window.location.href.split("/").pop();
      if (!localStorage.getItem("name")) await FirebaseLogger();
      await joinToGame(gameId);
      await setup(gameId);
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
      const { started, hostUid } = fetchedGameData;
      const playerUid = localStorage.getItem("playerUid");
      setIsThisPlayerHost(hostUid === playerUid);
      const players = Object.values(fetchedGameData.players);
      for (const player of players) {
        if (player.playerUid === playerUid && player.wordMaker)
          setIsThisPlayerWordMaker(true);
        if (!gameStarted && !player.inGame && player.playerUid !== playerUid) {
          await removePlayerFromGame(player.playerUid);
        }
      }

      setNumberOfPlayers(players.length);
      setGameStarted(started);
    };

    const interval = setInterval(() => {
      fetchDataAndHostTheGame();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!joined) {
    return <SpinningWheel />;
  }

  return gameStarted ? (
    <>
      {isThisPlayerWordMaker && (
        <Input
          position={[
            inputData.position[0],
            inputData.position[1] + 0.5,
            inputData.position[2],
          ]}
          dimensions={[2, 0.5, 0.01]}
          defaultText={""}
          set={setWordMakerText}
        />
      )}
      <Hand numberOfCards={5} fetchedPhotos={fetchedPhotos} />
      <OtherPlayerCards />
    </>
  ) : (
    <StartGameUI
      numberOfPlayers={numberOfPlayers}
      isThisPlayerHost={isThisPlayerHost}
      gameData={gameData}
      setIsThisPlayerWordMaker={setIsThisPlayerWordMaker}
    />
  );
};

export default GameScene;
