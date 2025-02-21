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
import { addAnimationToOtherPlayers } from "../firebase/playerMethods";
import {
  addToTable,
  backToHand,
  showCardCloser,
  animateActionButtons,
} from "../firebase/animations";
import ActionButton from "./ActionButton";

const Hand = ({ numberOfCards }) => {
  const [currentHovered, setCurrentHovered] = useState(-1);
  const [currentClicked, setCurrentClicked] = useState(-1);
  const [selectedCard, setSelectedCard] = useState(-1);
  const [inMenu, setInMenu] = useState(false);
  const [disableHover, setDisableHover] = useState(true);
  const [photoUrls, setPhotoUrls] = useState([]);
  const acceptButtonRef = useRef();
  const declineButtonRef = useRef();
  const cardsRef = useRef({});
  const { cardsPosition, cardsRotation, playerPosition, direction } =
    useSetup();
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
        setStartingHand(); // If there is not hand in database, create it
      } else {
        setPhotoUrls(handFromDatabase); // If there is hand in database, load it
      }
    }

    async function setStartingHand() {
      // Get 5 starting cards and set them in database
      const fetchedPhotos = await fetchAllPhotos();
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

  // Enable hover after cards are loaded
  useEffect(() => {
    if (
      photoUrls.length > 0 &&
      Object.keys(cardsRef.current).length === photoUrls.length
    ) {
      setDisableHover(false);
    }
  }, [photoUrls]);

  // Update the card positions etc when setup is loaded
  useEffect(() => {
    setCardsLayout(
      calculateCardsLayout(
        { cardsPosition, cardsRotation, direction },
        numberOfCards
      )
    );
  }, [cardsPosition, cardsRotation, direction, numberOfCards]);

  const handleCardClick = (index) => {
    // Main logic
    if (selectedCard === -1) {
      // Card is clicked
      if (currentClicked === index) {
        // Clicking same card again, return it to hand
        handleBackToHand(index);
        setCurrentClicked(-1);
        setInMenu(false);
      } else if (!inMenu) {
        // First time clicking this
        setCurrentClicked(index);
      }
    } else {
      // A card is already selected
      if (index === selectedCard) {
        // Clicking selected card, return it to hand
        handleBackToHand(index);
        setSelectedCard(-1);
      } else if (index !== selectedCard) {
        // Clicking different card, return old card and select new one
        handleBackToHand(selectedCard);
        setSelectedCard(-1);
        setCurrentClicked(index);
      }
    }
  };

  useEffect(() => {
    // Handle showing card closer on click
    if (currentClicked !== -1 && selectedCard === -1) {
      showCardCloser(cardsRef.current[currentClicked]);
      animateActionButtons(acceptButtonRef.current, declineButtonRef.current);
      setInMenu(true);
    }
  }, [currentClicked]);

  const handleAddCardOnTable = async (index) => {
    if (cardsRef.current[index]) {
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

  const acceptClicked = () => {
    setSelectedCard(currentClicked);
    handleAddCardOnTable(currentClicked);
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

      {currentClicked !== -1 && selectedCard === -1 && (
        <>
          <ActionButton
            ref={acceptButtonRef}
            onClick={acceptClicked}
            dimensions={[-1.7, 1.5, 3]}
            color="lightgreen"
            text="accept"
          />
          <ActionButton
            ref={declineButtonRef}
            onClick={declineClicked}
            dimensions={[1.7, 1.5, 3]}
            color="red"
            text="decline"
          />
        </>
      )}
    </>
  );
};

export default Hand;
