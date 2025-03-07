import { useEffect, useState } from "react";
import { fetchGameData, joinToGame } from "../../firebase/lobbyMethods";
import FirebaseLogger from "../../lobby/firebase/firebaseLogger";
import { getPosition, fetchAllPhotos } from "../../firebase/gameMethods";
import { getSelectedCard } from "../firebaseGameService";
import {
  getCenteredButtonData,
  getLeftTopButtonData,
  getAcceptPositionSetupData,
  getDeclinePositionSetupData,
  getNextRoundButtonData,
} from "../../firebase/uiMethods";
import { rotateOnTable } from "../../firebase/animations";

export const useGameSetup = ({
  handRef,
  joined,
  setJoined,
  direction,
  votingPhase,
  allPhotos,
  setAllPhotos,
  setCameraPosition,
  setCameraLookAt,
  setCameraLookAtMultiplier,
  setDirectionalLightPosition,
  setCardsPosition,
  setCardsRotation,
  setPlayerPosition,
  setDirection,
  refreshCardsExecuted,
}) => {
  const [gameData, setGameData] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [numberOfPlayers, setNumberOfPlayers] = useState(1);
  const [isThisPlayerHost, setIsThisPlayerHost] = useState(false);
  const [isThisPlayerWordMaker, setIsThisPlayerWordMaker] = useState(false);
  const [inputData, setInputData] = useState({});
  const [fetchedPhotos, setFetchedPhotos] = useState([]);
  const [chosenWordLabelData, setChosenWordLabelData] = useState({});
  const [players, setPlayers] = useState([]);
  const [acceptButtonSetupData, setAcceptButtonSetupData] = useState(null);
  const [declineButtonSetupData, setDeclineButtonSetupData] = useState(null);

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
    setChosenWordLabelData(getLeftTopButtonData(dir, votingPhase));
  };

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

  const refreshCards = async () => {
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
  };

  useEffect(() => {
    if (joined && handRef.current && !refreshCardsExecuted.current) {
      refreshCards();
    }
  }, [joined, handRef.current]);

  useEffect(() => {
    setFetchedPhotos(allPhotos);
  }, [allPhotos]);

  useEffect(() => {
    setChosenWordLabelData(getLeftTopButtonData(direction, votingPhase));
    setAcceptButtonSetupData(
      getAcceptPositionSetupData(direction, votingPhase)
    );
    setDeclineButtonSetupData(
      getDeclinePositionSetupData(direction, votingPhase)
    );
  }, [direction, votingPhase]);

  const nextRoundButtonData = getNextRoundButtonData();

  return {
    gameData,
    setGameData,
    players,
    setPlayers,
    numberOfPlayers,
    isThisPlayerHost,
    setIsThisPlayerHost,
    isThisPlayerWordMaker,
    setIsThisPlayerWordMaker,
    gameStarted,
    setGameStarted,
    inputData,
    chosenWordLabelData,
    acceptButtonSetupData,
    declineButtonSetupData,
    nextRoundButtonData,
    fetchedPhotos,
    setFetchedPhotos,
    setGameStarted,
    setPlayers,
  };
};
