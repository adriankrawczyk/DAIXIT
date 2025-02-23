import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import { useSetup } from "../context/SetupContext";
import {
  setHandInDatabase,
  getHandFromDatabase,
  getRandomCard,
  fetchAllPhotos,
  getCardsPosition,
} from "../firebase/gameMethods";
import { calculateCardsLayout } from "../firebase/gameMethods";
import {
  addAnimationToOtherPlayers,
  updateThisPlayerInGame,
} from "../firebase/playerMethods";
import {
  addToTable,
  backToHand,
  showCardCloser,
  animateActionButtons,
} from "../firebase/animations";
import ActionButton from "./ActionButton";
import {
  getAcceptPositionSetupData,
  getDeclinePositionSetupData,
} from "../firebase/uiMethods";
import { updateGameWithData } from "../firebase/gameMethods";

const Hand = ({
  numberOfCards,
  fetchedPhotos,
  isThisPlayerHost,
  isThisPlayerWordMaker,
  wordMakerText,
}) => {
  const [currentHovered, setCurrentHovered] = useState(-1);
  const [currentClicked, setCurrentClicked] = useState(-1);
  const [selectedCard, setSelectedCard] = useState(-1);
  const [inMenu, setInMenu] = useState(false);
  const [disableHover, setDisableHover] = useState(true);
  const [photoUrls, setPhotoUrls] = useState([]);
  const acceptButtonRef = useRef();
  const declineButtonRef = useRef();
  const cardsRef = useRef({});
  const {
    cardsPosition,
    cardsRotation,
    playerPosition,
    direction,
    chosenWord,
    setChosenWord,
    setChosenCard,
    chosenCard,
  } = useSetup();
  const acceptButtonSetupData = getAcceptPositionSetupData(direction);
  const declineButtonSetupData = getDeclinePositionSetupData(direction);
  const [cardsLayout, setCardsLayout] = useState(
    calculateCardsLayout(
      { cardsPosition, cardsRotation, direction },
      numberOfCards
    )
  );

  useEffect(() => {
    async function start() {
      const handFromDatabase = await getHandFromDatabase();
      if (handFromDatabase.length === 0) {
        setStartingHand();
      } else {
        setPhotoUrls(handFromDatabase);
      }
    }

    async function setStartingHand() {
      if (fetchedPhotos.length > 0) {
        const newPhotoUrls = Array.from({ length: numberOfCards }, () =>
          getRandomCard(fetchedPhotos)
        );
        setPhotoUrls(newPhotoUrls);
        await setHandInDatabase(newPhotoUrls);
      }
    }

    start();
  }, [numberOfCards]);

  useEffect(() => {
    if (
      photoUrls.length > 0 &&
      Object.keys(cardsRef.current).length === photoUrls.length
    ) {
      setDisableHover(false);
    }
  }, [photoUrls]);

  useEffect(() => {
    setCardsLayout(
      calculateCardsLayout(
        { cardsPosition, cardsRotation, direction },
        numberOfCards
      )
    );
  }, [cardsPosition, cardsRotation, direction, numberOfCards]);

  const handleCardClick = (index) => {
    // Prevent interaction with card that's already on the table
    if (index === selectedCard) {
      return;
    }

    // If clicking the same card that's currently shown closer
    if (currentClicked === index) {
      // Return it back to hand position
      handleBackToHand(index);
      // Reset clicked state
      setCurrentClicked(-1);
      // Exit the card menu state
      setInMenu(false);
    }
    // If we're not in menu state and clicking a new card
    else if (!inMenu) {
      // If there's already a card shown closer
      if (currentClicked !== -1) {
        // Return that card back to hand first
        handleBackToHand(currentClicked);
      }
      // Set the newly clicked card
      setCurrentClicked(index);
    }
  };

  useEffect(() => {
    if (currentClicked !== -1 && selectedCard !== currentClicked) {
      showCardCloser(cardsRef.current[currentClicked], direction);
      animateActionButtons(acceptButtonRef.current, declineButtonRef.current);
      setInMenu(true);
    }
  }, [currentClicked]);

  const handleAddCardOnTable = async (index) => {
    if (cardsRef.current[index]) {
      if (isThisPlayerWordMaker && !chosenWord.length) {
        await updateGameWithData({ chosenWord: wordMakerText });
        setChosenWord(wordMakerText);
      }
      addToTable(cardsRef.current[index], direction, setDisableHover);
      await addAnimationToOtherPlayers({
        type: "addOnTable",
        playerPosition,
        index,
        direction,
      });
    }
  };

  const handleBackToHand = async (index) => {
    if (cardsRef.current[index]) {
      await addAnimationToOtherPlayers({
        type: "backToHand",
        playerPosition,
        index,
      });
      const cardsAnimationPosition = getCardsPosition(
        cardsPosition,
        index,
        direction
      );
      backToHand(
        cardsRef.current[index],
        cardsAnimationPosition,
        cardsRotation,
        setDisableHover
      );
    }
  };

  const acceptClicked = async () => {
    setSelectedCard(currentClicked);
    handleAddCardOnTable(currentClicked);
    const chosenCardObj = {
      index: currentClicked,
      url: photoUrls[currentClicked],
    };
    await updateThisPlayerInGame({ chosenCard: chosenCardObj });
    setChosenCard(chosenCardObj);
    setCurrentClicked(-1);
    setInMenu(false);
  };

  const declineClicked = () => {
    handleBackToHand(currentClicked);
    setCurrentClicked(-1);
    setInMenu(false);
  };

  const assignRef = (el, key) => {
    if (el) {
      cardsRef.current[key] = el;
    }
  };

  return (
    <>
      {cardsLayout.map((item, key) => (
        <Card
          index={key}
          key={key}
          selectedCard={selectedCard}
          inMenu={inMenu}
          currentHovered={currentHovered}
          disableHover={disableHover}
          setCurrentHovered={setCurrentHovered}
          currentClicked={currentClicked}
          onCardClick={handleCardClick}
          position={item.position}
          rotation={item.rotation}
          imageUrl={photoUrls[key]}
          cardsPosition={cardsPosition}
          direction={direction}
          playerPosition={playerPosition}
          ref={(el) => assignRef(el, key)}
        />
      ))}
      {currentClicked !== -1 &&
        selectedCard !== currentClicked &&
        ((!isThisPlayerWordMaker &&
          chosenWord.length &&
          Object.values(chosenCard).length === 0) ||
          (isThisPlayerWordMaker &&
            wordMakerText.length &&
            !chosenWord.length)) && (
          <>
            <ActionButton
              ref={acceptButtonRef}
              onClick={acceptClicked}
              buttonSetupData={acceptButtonSetupData}
              color="lightgreen"
              text="accept"
            />
            <ActionButton
              ref={declineButtonRef}
              onClick={declineClicked}
              buttonSetupData={declineButtonSetupData}
              color="red"
              text="cancel"
            />
          </>
        )}
    </>
  );
};

export default Hand;
