import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import gsap from "gsap";
import { useSetup } from "../context/SetupContext";
import ActionButton from "./ActionButton";

const CardsComponent = ({ numberOfCards }) => {
  const [currentHovered, setCurrentHovered] = useState(-1);
  const [currentClicked, setCurrentClicked] = useState(-1);

  const [selectedCard, setSelectedCard] = useState(-1);
  const [inMenu, setinMenu] = useState(false);

  const [disableHover, setDisableHover] = useState(false);
  const [photoUrls, setPhotoUrls] = useState([]);


  const acceptButtonRef = useRef();
  const declineButtonRef = useRef();
  const cardsRef = useRef([]);


  const { cardsPosition, cardsRotation } = useSetup();

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
      rotation: [
        -Math.PI / 8 + cardsRotation[0],
        cardsRotation[1],
        Math.PI / 16 + cardsRotation[2],
      ],
    }))
  );

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

  const showCardCloser = (index) => {
    if (cardsRef.current[index]?.current) {

      gsap.to(cardsRef.current[index].current.position, {
        x: 0,
        y: 1.9,
        z: 3.8,
        duration: 0.5,
        ease: "power2.in",
      });

      gsap.to(cardsRef.current[index].current.rotation, {
        x: -Math.PI/15,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: "power2.out",
      });

    }
  }

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

  const pickingCardsButtonsTransition = () => {
    gsap.to(acceptButtonRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.5,
      ease: "power2.inOut",
    });

    gsap.to(declineButtonRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.5,
      ease: "power2.inOut",
    });
  }


  useEffect(() => {
    if (currentClicked !== -1 && selectedCard === -1) {
    showCardCloser(currentClicked)
    pickingCardsButtonsTransition();
    setinMenu(true);
    }
  }, [currentClicked]);


    // chosen card context
  // ACCEPT BUTTON CLICK 
  const acceptClicked = () => {
    setSelectedCard(currentClicked)
    addCardOnTable(currentClicked)
    setCurrentClicked(-1)
    setinMenu(false);
  }


  // DECLINE BUTTON CLICK 
  const declineClicked = () => {
    backToHand(currentClicked)
    setCurrentClicked(-1)
    setinMenu(false);
  }

  return (
    <>
      {cardsLayout.map((item, key) => (
        <Card
          index={key}
          key={key}
          selectedCard={selectedCard}
          inMenu = {inMenu}
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

      {currentClicked !== -1 && selectedCard === -1 && (
      <>
    <ActionButton ref={acceptButtonRef} onClick={acceptClicked} dimensions={[-1.7,1.5,3]} color={"lightgreen"} text={"accept"}/>
    <ActionButton ref={declineButtonRef} onClick={declineClicked} dimensions={[1.7,1.5,3]} color={"red"} text={"decline"}/>
      </>
      )}

      
    </>
  );
};

export default CardsComponent;
