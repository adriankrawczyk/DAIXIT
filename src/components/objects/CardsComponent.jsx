import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import gsap from "gsap";
import { useSetup } from "../context/SetupContext";
import {
  setHandInDatabase,
  getHandFromDatabase,
  getRandomCard,
  fetchAllPhotos,
} from "../firebase/gameMethods";

const CardsComponent = ({ numberOfCards }) => {
  const [currentHovered, setCurrentHovered] = useState(-1);
  const [currentClicked, setCurrentClicked] = useState(-1);
  const [disableHover, setDisableHover] = useState(false);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]);
  const previouslyClickedRef = useRef(-1);
  const { cardsPosition, cardsRotation, playerPosition } = useSetup();

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
  }, []);

  const cardsRef = useRef([]);

  const calculateCardsLayout = () => {
    return Array.from({ length: numberOfCards }, (_, i) => ({
      position: [
        (i - 2) / 2 + cardsPosition[0],
        cardsPosition[1],
        i * 0.01 + cardsPosition[2],
      ],
      rotation: cardsRotation,
    }));
  };

  const [cardsLayout, setCardsLayout] = useState(calculateCardsLayout());

  useEffect(() => {
    setCardsLayout(calculateCardsLayout());
  }, [cardsPosition, cardsRotation]);

  const addCardOnTable = (index) => {
    if (cardsRef.current[index]?.current) {
      setDisableHover(true);
      gsap.to(cardsRef.current[index].current.position, {
        x: 0,
        y: 0.6,
        z: 3 * playerPosition === 0 ? 1 : -1, // temporary, for 2 players
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(cardsRef.current[index].current.rotation, {
        x: Math.PI / 2,
        y: 0,
        z: -Math.PI / 2,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.delayedCall(0.5, () => setDisableHover(false));
    }
  };

  const backToHand = (index) => {
    if (cardsRef.current[index]?.current) {
      setDisableHover(true);
      gsap.to(cardsRef.current[index].current.position, {
        x: (index - 2) / 2 + cardsPosition[0],
        y: cardsPosition[1],
        z: index * 0.01 + cardsPosition[2],
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(cardsRef.current[index].current.rotation, {
        x: cardsRotation[0],
        y: cardsRotation[1],
        z: cardsRotation[2],
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.delayedCall(0.5, () => setDisableHover(false));
    }
  };

  useEffect(() => {
    if (previouslyClickedRef.current !== -1) {
      backToHand(previouslyClickedRef.current);
    }

    if (currentClicked !== -1) {
      addCardOnTable(currentClicked);
      backToHand(previouslyClickedRef.current);
      previouslyClickedRef.current = currentClicked;
    } else {
      backToHand(currentClicked);
      previouslyClickedRef.current = -1;
    }
  }, [currentClicked]);

  return (
    <>
      {cardsLayout.map((item, key) => (
        <Card
          index={key}
          key={key}
          cardsRef={cardsRef}
          currentHovered={currentHovered}
          disableHover={disableHover}
          setCurrentHovered={setCurrentHovered}
          currentClicked={currentClicked}
          setCurrentClicked={setCurrentClicked}
          position={item.position}
          rotation={item.rotation}
          imageUrl={photoUrls[key]}
          zOffset={cardsPosition[2]}
          playerPosition={playerPosition}
        />
      ))}
    </>
  );
};

export default CardsComponent;
