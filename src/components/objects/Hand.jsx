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

const Hand = ({ numberOfCards }) => {
  const [currentHovered, setCurrentHovered] = useState(-1);
  const [currentClicked, setCurrentClicked] = useState(-1);
  const [disableHover, setDisableHover] = useState(false);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]);
  const previouslyClickedRef = useRef(-1);
  const { cardsPosition, cardsRotation, playerPosition, direction } =
    useSetup();

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
  }, [cardsPosition, cardsRotation]);

  const addCardOnTable = (index) => {
    if (cardsRef.current[index]?.current) {
      setDisableHover(true);
      let hoverObject = {
        y: 0.6,
        duration: 0.5,
        ease: "power2.out",
      };
      switch (direction) {
        case "Bottom": {
          hoverObject.z = 1;
          hoverObject.x = 0;
          break;
        }
        case "Top": {
          hoverObject.z = -1;
          hoverObject.x = 0;
          break;
        }
        case "Left": {
          hoverObject.x = 1;
          hoverObject.z = 0;
          break;
        }
        case "Right": {
          hoverObject.x = -1;
          hoverObject.z = 0;
          break;
        }
      }
      gsap.to(cardsRef.current[index].current.position, hoverObject);
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
      const cardsAnimationPosition = getCardsPosition(
        cardsPosition,
        index,
        direction
      );
      setDisableHover(true);
      gsap.to(cardsRef.current[index].current.position, {
        x: cardsAnimationPosition[0],
        y: cardsAnimationPosition[1],
        z: cardsAnimationPosition[2],
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
          cardsPosition={cardsPosition}
          direction={direction}
          playerPosition={playerPosition}
        />
      ))}
    </>
  );
};

export default Hand;
