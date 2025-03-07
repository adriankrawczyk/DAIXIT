import { fetchGameData, joinToGame } from "../firebase/lobbyMethods";

import {
  getOtherPlayerSelectedCards,
  getPosition,
  updateGameWithData,
  fetchAllPhotos,
  getCardsPosition,
  getHandFromDatabase,
  setHandInDatabase,
  getRandomCard,
} from "../firebase/gameMethods";

import {
  calculateAndAddPoints,
  removePlayerFromGame,
  updateThisPlayerInGame,
  handleNextRound,
  updatePlayerInGame,
  getSelectedCard,
} from "../firebase/playerMethods";

import {
  getCenteredButtonData,
  getLeftTopButtonData,
  getAcceptPositionSetupData,
  getDeclinePositionSetupData,
  getNextRoundButtonData,
} from "../firebase/uiMethods";

import {
  animateToPosition,
  backToHand,
  rotateOnTable,
} from "../firebase/animations";

export {
  fetchGameData,
  joinToGame,
  getOtherPlayerSelectedCards,
  getPosition,
  updateGameWithData,
  fetchAllPhotos,
  getCardsPosition,
  getHandFromDatabase,
  setHandInDatabase,
  getRandomCard,
  getSelectedCard,
  calculateAndAddPoints,
  removePlayerFromGame,
  updateThisPlayerInGame,
  handleNextRound,
  updatePlayerInGame,
  getCenteredButtonData,
  getLeftTopButtonData,
  getAcceptPositionSetupData,
  getDeclinePositionSetupData,
  getNextRoundButtonData,
  animateToPosition,
  backToHand,
  rotateOnTable,
};
