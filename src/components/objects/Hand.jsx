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
<<<<<<< HEAD

  const [selectedCard, setSelectedCard] = useState(-1);
  const [inMenu, setinMenu] = useState(false);

  const [disableHover, setDisableHover] = useState(false);
=======
  const [disableHover, setDisableHover] = useState(true);
>>>>>>> adb40da6e3590872a55f25833e4fc55c1014beca
  const [photoUrls, setPhotoUrls] = useState([]);


  const acceptButtonRef = useRef();
  const declineButtonRef = useRef();
  const cardsRef = useRef([]);


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
<<<<<<< HEAD
  }, []);
  const calculateCardsLayout = (numberOfCards) => {
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
    }));
  };

  const [cardsLayout, setCardsLayout] = useState(() =>
    calculateCardsLayout(numberOfCards)
  );

  useEffect(() => {
    setCardsLayout(calculateCardsLayout(numberOfCards));
  }, [cardsPosition, cardsRotation, numberOfCards]);

  const addCardOnTable = (index) => {
    if (cardsRef.current[index]?.current) {
      setDisableHover(true);
      gsap.to(cardsRef.current[index].current.position, {
        x: 0,
        y: 0.6,
        z: (playerPosition === 0 ? -1 : 1), // temporary, for 2 players
        duration: 0.5,
        ease: "power2.out",
=======
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
>>>>>>> adb40da6e3590872a55f25833e4fc55c1014beca
      });
    }
  };

<<<<<<< HEAD
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
=======
  const handleBackToHand = async (index) => {
    if (cardsRef.current[index]) {
      await addAnimationToOtherPlayers({
        type: "backToHand",
        playerPosition,
        index,
>>>>>>> adb40da6e3590872a55f25833e4fc55c1014beca
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

<<<<<<< HEAD
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
=======
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
>>>>>>> adb40da6e3590872a55f25833e4fc55c1014beca

  return (
    <>
      {cardsLayout.map((item, key) => (
        <Card
          index={key}
          key={key}
<<<<<<< HEAD
          selectedCard={selectedCard}
          inMenu = {inMenu}
          cardsRef={cardsRef}
=======
>>>>>>> adb40da6e3590872a55f25833e4fc55c1014beca
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

      {currentClicked !== -1 && selectedCard === -1 && (
      <>
    <ActionButton ref={acceptButtonRef} onClick={acceptClicked} dimensions={[-1.7,1.5,3]} color={"lightgreen"} text={"accept"}/>
    <ActionButton ref={declineButtonRef} onClick={declineClicked} dimensions={[1.7,1.5,3]} color={"red"} text={"decline"}/>
      </>
      )}

      
    </>
  );
};

export default Hand;
