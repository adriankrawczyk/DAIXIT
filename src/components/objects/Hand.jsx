import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Card from "./Card";
import { useSetup } from "../context/SetupContext";
import {
  setHandInDatabase,
  getHandFromDatabase,
  getRandomCard,
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
  rotateOnTable,
  showCardCloserOnVotingPhase,
  animateToPosition,
} from "../firebase/animations";
import ActionButton from "./ActionButton";
import {
  getAcceptPositionSetupData,
  getDeclinePositionSetupData,
} from "../firebase/uiMethods";
import { updateGameWithData } from "../firebase/gameMethods";
import { playerUid } from "../firebase/localVariables";

const Hand = forwardRef(
  (
    {
      numberOfCards,
      fetchedPhotos,
      setFetchedPhotos,
      isThisPlayerHost,
      isThisPlayerWordMaker,
      wordMakerText,
      setVotingSelectedCardPosition,
      setVotingSelectedCardRef,
      votingSelectedCardRef,
      votingSelectedCardPosition,
      setIsVotingSelectedCardThisPlayers,
      afterVoteData,
    },
    ref
  ) => {
    // State for tracking card interactions and display
    const [currentHovered, setCurrentHovered] = useState(-1);
    const [currentClicked, setCurrentClicked] = useState(-1);
    const [selectedCard, setSelectedCard] = useState(-1);
    const [inMenu, setInMenu] = useState(false);
    const [disableHover, setDisableHover] = useState(true);
    const [photoUrls, setPhotoUrls] = useState([]);

    // Refs for DOM elements and animations
    const acceptButtonRef = useRef();
    const declineButtonRef = useRef();
    const cardsRef = useRef({});

    // Setup context provides game state and player position information
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

    // Button position data based on player direction
    const acceptButtonSetupData = getAcceptPositionSetupData(direction);
    const declineButtonSetupData = getDeclinePositionSetupData(direction);

    // Calculate initial layout of cards in hand
    const [cardsLayout, setCardsLayout] = useState(
      calculateCardsLayout(
        { cardsPosition, cardsRotation, direction },
        numberOfCards
      )
    );

    // Expose component methods to parent through ref
    useImperativeHandle(ref, () => ({
      cardsRef,
      setDisableHover,
      backToHand: handleBackToHand,
      acceptClicked,
      setCurrentClicked,
      setSelectedCard,
      selectedCard,
      updateCardUrl,
    }));

    // Initialize hand with cards from database or create new hand if none exists
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
          const newPhotoUrls = Array.from({ length: numberOfCards }, () => {
            const randomUrl = getRandomCard(fetchedPhotos, setFetchedPhotos);
            setFetchedPhotos(fetchedPhotos.filter((url) => url !== randomUrl));
            return randomUrl;
          });
          setPhotoUrls(newPhotoUrls);
          await setHandInDatabase(newPhotoUrls);
        }
      }

      start();
    }, [numberOfCards]);

    // Enable hover effects once all cards are loaded and refs are assigned
    useEffect(() => {
      if (
        photoUrls.length > 0 &&
        Object.keys(cardsRef.current).length === photoUrls.length
      ) {
        setDisableHover(false);
      }
    }, [photoUrls]);

    // Rotate selected card when entering voting phase
    useEffect(() => {
      if (votingPhase) {
        rotateOnTable(cardsRef.current[selectedCard]);
      }
    }, [votingPhase]);

    // Recalculate card layout when position or rotation changes
    useEffect(() => {
      setCardsLayout(
        calculateCardsLayout(
          { cardsPosition, cardsRotation, direction },
          numberOfCards
        )
      );
    }, [cardsPosition, cardsRotation, direction, numberOfCards]);

    // Handle card click events - different behavior in voting vs. normal phase
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

      // Toggle card close-up view when clicking the same card
      if (currentClicked === index) {
        handleBackToHand(index);
        setCurrentClicked(-1);
        setInMenu(false);
      }
      // Handle showing a new card in close-up view
      else if (!inMenu) {
        if (currentClicked !== -1) {
          handleBackToHand(currentClicked);
        }
        setCurrentClicked(index);
      }
    };

    // Show card close-up and action buttons when a card is clicked
    useEffect(() => {
      if (currentClicked !== -1 && selectedCard !== currentClicked) {
        showCardCloser(cardsRef.current[currentClicked], direction);
        animateActionButtons(acceptButtonRef.current, declineButtonRef.current);
        setInMenu(true);
      }
    }, [currentClicked]);

    // Update a specific card's URL in the hand
    const updateCardUrl = (index, newUrl) => {
      if (index >= 0 && index < photoUrls.length) {
        const updatedUrls = [...photoUrls];
        updatedUrls[index] = newUrl;
        setPhotoUrls(updatedUrls);
      }
    };

    // Add card to the table and update game state
    const handleAddCardOnTable = async (index, addAnimation = true) => {
      if (cardsRef.current[index]) {
        // If player is word maker, update the chosen word in game state
        if (isThisPlayerWordMaker && !chosenWord.length) {
          await updateGameWithData({ chosenWord: wordMakerText });
          setChosenWord(wordMakerText);
        }

        // Animate card to table and notify other players
        addToTable(cardsRef.current[index], direction, setDisableHover);
        if (addAnimation)
          await addAnimationToOtherPlayers({
            type: "addOnTable",
            playerPosition,
            index,
            direction,
          });
      }
    };

    // Return card to hand position and update animations for other players
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

    // Handle accept button click to confirm card selection
    const acceptClicked = async (url = null, currentIndex = null) => {
      setSelectedCard(currentIndex || currentClicked);
      handleAddCardOnTable(
        currentIndex || currentClicked,
        !url && !currentIndex
      );
      const chosenCardObj = {
        index: currentIndex || currentClicked,
        url: url || photoUrls[currentClicked],
        playerUid: playerUid,
      };
      await updateThisPlayerInGame({ chosenCard: chosenCardObj });
      setChosenCard(chosenCardObj);
      setCurrentClicked(-1);
      setInMenu(false);
    };

    // Handle decline button click to cancel card selection
    const declineClicked = () => {
      handleBackToHand(currentClicked);
      setCurrentClicked(-1);
      setInMenu(false);
    };

    // Assign ref to card element for direct manipulation
    const assignRef = (el, key) => {
      if (el) {
        cardsRef.current[key] = el;
      }
    };

    // Click animations to be added

    // Render cards and action buttons based on current game state
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
            votingPhase={votingPhase}
            afterVoteData={afterVoteData}
            votingSelectedCardRef={votingSelectedCardRef}
          />
        ))}
        {/* Show action buttons only when a card is clicked and conditions allow selection */}
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
                color="#8fda95"
                text="accept"
                textColor = "#226319"
                strokeColor = "#02580e"
              />
              <ActionButton
                ref={declineButtonRef}
                onClick={declineClicked}
                buttonSetupData={declineButtonSetupData}
                color="#ff7e7e"
                text="cancel"
                textColor = "#740000"
                strokeColor = "#680000"
              />
            </>
          )}
      </>
    );
  }
);

export default Hand;
