import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import gsap from "gsap";
import { useSetup } from "../context/SetupContext";

const CardsComponent = ({ numberOfCards }) => {
  const [currentHovered, setCurrentHovered] = useState(-1);
  const [currentClicked, setCurrentClicked] = useState(-1);
  const [disableHover, setDisableHover] = useState(false);
  const [photoUrls, setPhotoUrls] = useState([]);
  const previouslyClickedRef = useRef(-1);
  const { cardsPosition, cardsRotation, playerPosition } = useSetup();

  useEffect(() => {
    const fetchPhotos = async () => {
      const url = "https://storage.googleapis.com/storage/v1/b/daixit_photos/o";
      try {
        const response = await fetch(url);
        const data = await response.json();
        const urls = data.items.map(
          (item) => `https://storage.googleapis.com/daixit_photos/${item.name}`
        );
        const shuffled = urls.sort(() => 0.5 - Math.random());
        setPhotoUrls(shuffled.slice(0, numberOfCards));
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, [numberOfCards]);

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
        x: 0.2,
        y: 0.5,
        z: 0.3,
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
        x: (index - 2) / 2 + 0.2 + cardsPosition[0],
        y: 0.75 + cardsPosition[1],
        z: 3 + index * 0.01 + cardsPosition[2],
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(cardsRef.current[index].current.rotation, {
        x: -Math.PI / 8,
        y: 0,
        z: Math.PI / 16,
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
