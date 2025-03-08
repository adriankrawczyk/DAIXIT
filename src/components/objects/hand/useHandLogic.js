import { useState, useRef, useEffect } from "react";
import { useSetup } from "../../context/SetupContext";
import {
  setHandInDatabase,
  getHandFromDatabase,
  getRandomCard,
  getCardsPosition,
  calculateCardsLayout,
  updateGameWithData,
} from "../../firebase/gameMethods";
import {
  addAnimationToOtherPlayers,
  updateThisPlayerInGame,
} from "../../firebase/playerMethods";
import {
  addToTable,
  backToHand,
  showCardCloser,
  animateActionButtons,
  rotateOnTable,
  showCardCloserOnVotingPhase,
  animateToPosition,
} from "../../firebase/animations";

const useHandLogic = ({
  numberOfCards,
  fetchedPhotos,
  setFetchedPhotos,
  isThisPlayerWordMaker,
  wordMakerText,
  setVotingSelectedCardPosition,
  setVotingSelectedCardRef,
  votingSelectedCardRef,
  votingSelectedCardPosition,
  setIsVotingSelectedCardThisPlayers,
}) => {
  const [currentHovered, setCurrentHovered] = useState(-1);
  const [currentClicked, setCurrentClicked] = useState(-1);
  const [selectedCard, setSelectedCard] = useState(-1);
  const [inMenu, setInMenu] = useState(false);
  const disableHover = useRef(true);
  const photoUrls = useRef([]);
  const cardsRef = useRef({});
  const [cardsLayout, setCardsLayout] = useState([]);
  // Keep track of the current wordMakerText in a ref to access in closures
  const wordMakerTextRef = useRef(wordMakerText);

  // Update wordMakerText ref when prop changes
  useEffect(() => {
    wordMakerTextRef.current = wordMakerText;
  }, [wordMakerText]);

  const {
    cardsPosition,
    cardsRotation,
    playerPosition,
    direction,
    chosenWord,
    setChosenWord,
    setChosenCard,
    chosenCard,
    votingPhase,
  } = useSetup();

  useEffect(() => {
    async function start() {
      const handFromDatabase = await getHandFromDatabase();
      if (handFromDatabase.length === 0) {
        setStartingHand();
      } else {
        photoUrls.current = handFromDatabase;
        // Force a re-render after setting photoUrls
        setCardsLayout((prev) => [...prev]);
      }
    }

    async function setStartingHand() {
      if (fetchedPhotos.length > 0) {
        const newPhotoUrls = Array.from({ length: numberOfCards }, () => {
          const randomUrl = getRandomCard(fetchedPhotos, setFetchedPhotos);
          setFetchedPhotos(fetchedPhotos.filter((url) => url !== randomUrl));
          return randomUrl;
        });
        photoUrls.current = newPhotoUrls;
        // Force a re-render after setting photoUrls
        setCardsLayout((prev) => [...prev]);
        await setHandInDatabase(newPhotoUrls);
      }
    }

    start();
  }, [numberOfCards, fetchedPhotos, setFetchedPhotos]);

  useEffect(() => {
    if (
      photoUrls.current.length > 0 &&
      Object.keys(cardsRef.current).length === photoUrls.current.length
    ) {
      disableHover.current = false;
      // Force a re-render
      setCurrentHovered((prev) => prev);
    }
  }, [photoUrls.current.length]);

  useEffect(() => {
    if (votingPhase && selectedCard !== -1 && cardsRef.current[selectedCard]) {
      rotateOnTable(cardsRef.current[selectedCard]);
    }
  }, [votingPhase, selectedCard]);

  useEffect(() => {
    setCardsLayout(
      calculateCardsLayout(
        { cardsPosition, cardsRotation, direction },
        numberOfCards
      )
    );
  }, [cardsPosition, cardsRotation, direction, numberOfCards]);

  const handleCardClick = (index) => {
    if (votingPhase) {
      const currentCard = cardsRef.current[index];
      if (index === selectedCard && !votingSelectedCardRef) {
        setVotingSelectedCardPosition({
          x: currentCard.position.x,
          y: currentCard.position.y,
          z: currentCard.position.z,
        });
        showCardCloserOnVotingPhase(currentCard);
        setVotingSelectedCardRef(currentCard);
        setIsVotingSelectedCardThisPlayers(true);
      } else if (
        index === selectedCard &&
        votingSelectedCardRef === currentCard &&
        votingSelectedCardPosition
      ) {
        animateToPosition(currentCard, votingSelectedCardPosition);
        setVotingSelectedCardPosition(null);
        setTimeout(() => {
          setVotingSelectedCardRef(null);
        }, 500);
      }
      return;
    }

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
    if (
      currentClicked !== -1 &&
      selectedCard !== currentClicked &&
      cardsRef.current[currentClicked]
    ) {
      showCardCloser(cardsRef.current[currentClicked], direction);
      animateActionButtons(null, null); // We'll need to pass these refs from the component
      setInMenu(true);
    }
  }, [currentClicked, selectedCard, direction]);

  const handleAddCardOnTable = async (index, addAnimation = true) => {
    if (cardsRef.current[index]) {
      // Use wordMakerTextRef.current to get the latest value
      if (isThisPlayerWordMaker && !chosenWord.length) {
        await updateGameWithData({ chosenWord: wordMakerTextRef.current });
        setChosenWord(wordMakerTextRef.current);
      }
      addToTable(cardsRef.current[index], direction, (value) => {
        disableHover.current = value;
        // Force a re-render
        setCurrentHovered((prev) => prev);
      });
      if (addAnimation)
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
        (value) => {
          disableHover.current = value;
          // Force a re-render
          setCurrentHovered((prev) => prev);
        }
      );
    }
  };

  const acceptClicked = async (url = null, currentIndex = null) => {
    const indexToUse = currentIndex !== null ? currentIndex : currentClicked;
    setSelectedCard(indexToUse);
    handleAddCardOnTable(indexToUse, !url && currentIndex === null);
    const chosenCardObj = {
      index: indexToUse,
      url: url || photoUrls.current[currentClicked],
      playerUid: localStorage.getItem("playerUid"),
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

  // Method to update a card URL
  const updateCardUrl = (index, newUrl) => {
    if (index >= 0 && index < photoUrls.current.length) {
      const updatedUrls = [...photoUrls.current];
      updatedUrls[index] = newUrl;
      photoUrls.current = updatedUrls;
      // Force a re-render
      setCardsLayout((prev) => [...prev]);
    }
  };

  return {
    currentHovered,
    setCurrentHovered,
    currentClicked,
    setCurrentClicked,
    selectedCard,
    setSelectedCard,
    inMenu,
    disableHover,
    photoUrls,
    cardsRef,
    cardsLayout,
    direction,
    chosenWord,
    chosenCard,
    votingPhase,
    handleCardClick,
    handleBackToHand,
    acceptClicked,
    declineClicked,
    assignRef,
    playerPosition,
    cardsPosition,
    updateCardUrl,
  };
};

export default useHandLogic;
