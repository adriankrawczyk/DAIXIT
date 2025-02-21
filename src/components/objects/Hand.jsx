import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import gsap from "gsap";
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
import { addToTable, backToHand } from "../firebase/animations";

const Hand = ({ numberOfCards }) => {
  const [currentHovered, setCurrentHovered] = useState(-1);
  const [currentClicked, setCurrentClicked] = useState(-1);
  const [disableHover, setDisableHover] = useState(true);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]);
  const previouslyClickedRef = useRef(-1);
  const { cardsPosition, cardsRotation, playerPosition, direction } =
    useSetup();
  const cardsRef = useRef({});
  const cardsLoadedCount = useRef(0);

  useEffect(() => {
    async function start() {
      const handFromDatabase = await getHandFromDatabase();
      if (handFromDatabase.length === 0) setStartingHand();
      else setPhotoUrls(handFromDatabase);
    }
    async function setStartingHand() {
      const fetchedPhotos = await fetchAllPhotos();
      setAllPhotos(fetchedPhotos);

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
      setTimeout(() => setDisableHover(false), 300);
    }
  }, [photoUrls, cardsLoadedCount.current]);

  const [cardsLayout, setCardsLayout] = useState(
    calculateCardsLayout(
      { cardsPosition, cardsRotation, direction },
      numberOfCards
    )
  );

  useEffect(() => {
    setCardsLayout(
      calculateCardsLayout(
        { cardsPosition, cardsRotation, direction },
        numberOfCards
      )
    );
  }, [cardsPosition, cardsRotation, direction, numberOfCards]);

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

  useEffect(() => {
    if (previouslyClickedRef.current !== -1) {
      handleBackToHand(previouslyClickedRef.current);
    }

    if (currentClicked !== -1) {
      handleAddCardOnTable(currentClicked);
      previouslyClickedRef.current = currentClicked;
    } else {
      previouslyClickedRef.current = -1;
    }
  }, [currentClicked]);

  const assignRef = (el, key) => {
    if (el) {
      cardsRef.current[key] = el;
      cardsLoadedCount.current++;
    } else if (cardsRef.current[key]) {
      delete cardsRef.current[key];
      cardsLoadedCount.current--;
    }
  };

  return (
    <>
      {cardsLayout.map((item, key) => (
        <Card
          index={key}
          key={key}
          currentHovered={currentHovered}
          disableHover={disableHover}
          setCurrentHovered={setCurrentHovered}
          currentClicked={currentClicked}
          setCurrentClicked={setCurrentClicked}
          position={item.position}
          rotation={item.rotation}
          imageUrl={photoUrls[key]}
          cardsPosition={cardsPosition}
          direction={direction}
          playerPosition={playerPosition}
          ref={(el) => assignRef(el, key)}
        />
      ))}
    </>
  );
};

export default Hand;
