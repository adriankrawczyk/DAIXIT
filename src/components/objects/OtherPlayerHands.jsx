import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import {
  getOtherPlayersData,
  getSetupData,
  calculateCardsLayout,
  getOtherPlayerSelectedCards,
} from "../firebase/gameMethods";
import { getAnimations } from "../firebase/playerMethods";
import { addToTable, backToHand, rotateOnTable } from "../firebase/animations";
import { useSetup } from "../context/SetupContext";
import {
  showCardCloserOnVotingPhase,
  animateToPosition,
} from "../firebase/animations";

const OtherPlayerHand = ({
  numberOfCards = 7,
  setVotingSelectedCardPosition,
  setVotingSelectedCardRef,
  votingSelectedCardRef,
  votingSelectedCardPosition,
  setIsVotingSelectedCardThisPlayers,
  setVotingSelectedCardData,
  afterVoteData,
  selectedCards,
  setSelectedCards,
  round,
  players,
}) => {
  const { votingPhase } = useSetup();

  // State management for other players' data and card interactions
  const [otherPlayersData, setOtherPlayersData] = useState([]);
  const [otherPlayerHandsData, setOtherPlayerHandsData] = useState([]);
  const [processedAnimations, setProcessedAnimations] = useState(new Set());
  const [selectedCardsFromDatabase, setSelectedCardsFromDatabase] = useState(
    []
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Image loading tracking
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [requiredImages, setRequiredImages] = useState(new Set());
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [cardsRotated, setCardsRotated] = useState(false);

  // Refs to track component state across renders and store card DOM references
  const cardsRef = useRef({});
  const previousRoundRef = useRef(round);
  const hasRefreshedCardsRef = useRef(false);
  const votingPhaseHandled = useRef(false);
  const rotationTimeoutsRef = useRef([]);

  // Handle image loading notification from Card component
  const handleImageLoaded = (imageUrl) => {
    if (!imageUrl) return;

    setLoadedImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(imageUrl);
      return newSet;
    });
  };

  // Check if all required images are loaded
  useEffect(() => {
    if (requiredImages.size > 0 && loadedImages.size > 0) {
      // Check if all required images are now in the loadedImages set
      let allLoaded = true;
      requiredImages.forEach((url) => {
        if (!loadedImages.has(url)) {
          allLoaded = false;
        }
      });

      if (allLoaded && requiredImages.size === loadedImages.size) {
        console.log(
          "All images are loaded:",
          loadedImages.size,
          "of",
          requiredImages.size
        );
        setAllImagesLoaded(true);
      }
    }
  }, [requiredImages, loadedImages]);

  // Process card animations based on animation type (table placement or return to hand)
  const handleAnimation = (animation, cardRef) => {
    if (!cardRef?.current) return;
    const { type, direction, playerPosition, index } = animation;

    if (type === "addOnTable") {
      setSelectedCards((prev) => [...prev, cardRef.current]);
      // Only add to table but don't rotate - rotation happens after all images load
      addToTable(cardRef.current, direction, null, votingPhase);
    } else if (type === "backToHand") {
      const playerHand = otherPlayerHandsData.find(
        (hand) => hand.playerPosition === playerPosition
      );
      if (!playerHand) return;
      const { position, rotation } = calculateCardsLayout(
        playerHand,
        numberOfCards
      )[index];
      setSelectedCards(
        selectedCards.filter((card) => card !== cardRef.current)
      );
      backToHand(cardRef.current, position, rotation);
    }
  };

  // Initialize component and set up periodic data fetching from Firebase
  useEffect(() => {
    const fetchData = async () => {
      const players = await getOtherPlayersData();
      setOtherPlayersData(players);
      const handsData = await Promise.all(
        players.map((player) => getSetupData(player.position))
      );
      setOtherPlayerHandsData(handsData);
      setIsInitialized(true);
    };

    fetchData();
    const dataInterval = setInterval(fetchData, 1000);
    return () => clearInterval(dataInterval);
  }, []);

  // Load and display other players' selected cards when component initializes
  useEffect(() => {
    const refreshOtherPlayersCards = async () => {
      if (
        !isInitialized ||
        hasRefreshedCardsRef.current ||
        !otherPlayerHandsData.length
      ) {
        return;
      }

      const selectedCardsData = await getOtherPlayerSelectedCards();
      if (selectedCardsData && selectedCardsData.length > 0) {
        // Collect all image URLs that need to be loaded
        const imageUrls = new Set();
        selectedCardsData.forEach((cardData) => {
          if (cardData.url) {
            imageUrls.add(cardData.url);
          }
        });

        // Set the required images
        setRequiredImages(imageUrls);

        // Now add cards to the table but don't rotate yet
        for (const cardData of selectedCardsData) {
          const playerPosition = players.find(
            (player) => player.playerUid === cardData.playerUid
          )?.currentGameData?.position;

          const playerHand = otherPlayerHandsData.find(
            (hand) => hand.playerPosition === playerPosition
          );

          if (playerHand) {
            const cardKey = `${playerHand.playerPosition}-${cardData.index}`;
            const cardRef = cardsRef.current[cardKey];
            if (cardRef?.current) {
              setSelectedCards((prev) => [...prev, cardRef.current]);
              // Add to table but don't rotate yet - rotation happens after all images load
              addToTable(
                cardRef.current,
                playerHand.direction,
                null,
                false // Don't rotate during initial load
              );
            }
          }
        }
      } else {
        // If no cards, mark as all loaded
        setAllImagesLoaded(true);
      }

      hasRefreshedCardsRef.current = true;
    };

    refreshOtherPlayersCards();
  }, [isInitialized, otherPlayerHandsData, players]);

  // Clean up rotation timeouts when component unmounts or round changes
  useEffect(() => {
    return () => {
      // Clear any pending rotation timeouts
      rotationTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      rotationTimeoutsRef.current = [];
    };
  }, [round]);

  // Reset voting phase flag when round changes
  useEffect(() => {
    if (previousRoundRef.current !== round) {
      // Clear any pending rotation timeouts
      rotationTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      rotationTimeoutsRef.current = [];

      votingPhaseHandled.current = false;
      setCardsRotated(false);
      setAllImagesLoaded(false);
      setLoadedImages(new Set());
      setRequiredImages(new Set());
      previousRoundRef.current = round;
    }
  }, [round]);

  // Handle round changes by returning cards to hands and fetching new animations
  useEffect(() => {
    const changeRound = async () => {
      if (previousRoundRef.current !== round) {
        const returnAllCardsToHands = async () => {
          for (const card of selectedCards) {
            for (const playerHand of otherPlayerHandsData) {
              for (let i = 0; i < numberOfCards; i++) {
                const key = `${playerHand.playerPosition}-${i}`;
                if (cardsRef.current[key]?.current === card) {
                  const { position, rotation } = calculateCardsLayout(
                    playerHand,
                    numberOfCards
                  )[i];
                  backToHand(card, position, rotation);
                  await new Promise((resolve) => setTimeout(resolve, 50));
                }
              }
            }
          }

          await new Promise((resolve) => setTimeout(resolve, 300));
          setSelectedCards([]);
        };

        await returnAllCardsToHands();
        await fetchAnimations();
      }
    };

    changeRound();
  }, [round, otherPlayerHandsData, selectedCards]);

  // Handle voting phase transitions by randomizing cards
  useEffect(() => {
    const handleVotingPhase = async () => {
      if (votingPhase && !votingPhaseHandled.current) {
        // Fetch animations and prepare cards
        await fetchAnimations();
        const cards = await getOtherPlayerSelectedCards();

        // Get all card URLs for tracking image loading
        const imageUrls = new Set();
        cards.forEach((cardData) => {
          if (cardData.url) {
            imageUrls.add(cardData.url);
          }
        });

        // Set the required images
        setRequiredImages(imageUrls);

        // Randomize the cards
        setSelectedCardsFromDatabase(
          [...cards].sort(() => Math.random() - 0.5)
        );

        // Mark that we've handled initial voting phase setup
        votingPhaseHandled.current = true;
      }
    };

    handleVotingPhase();
  }, [votingPhase]);

  // Handle card rotation ONLY after all images are loaded
  useEffect(() => {
    if (
      votingPhase &&
      allImagesLoaded &&
      !cardsRotated &&
      selectedCards.length > 0
    ) {
      // Clear any existing timeouts
      rotationTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      rotationTimeoutsRef.current = [];

      // Rotate each card with a delay
      selectedCards.forEach((selectedCard, index) => {
        const timeout = setTimeout(() => {
          rotateOnTable(selectedCard);
        }, (index + 1) * 500);

        // Store timeout IDs for cleanup
        rotationTimeoutsRef.current.push(timeout);
      });

      // Mark cards as rotated so we don't rotate them again
      setCardsRotated(true);
    }
  }, [votingPhase, allImagesLoaded, selectedCards, cardsRotated]);

  // Fetch and process animations from Firebase
  const fetchAnimations = async () => {
    const animations = await getAnimations();

    // Sort animations by timestamp to ensure proper sequence
    const sortedAnimations = animations.sort((a, b) => {
      return (a.timestamp || 0) - (b.timestamp || 0);
    });

    setProcessedAnimations((prev) => {
      const newProcessed = new Set(prev);
      sortedAnimations.forEach((animation) => {
        const animationKey = `${animation.playerPosition}-${animation.index}-${
          animation.type
        }-${animation.timestamp || 0}`;

        if (!newProcessed.has(animationKey)) {
          const cardRef =
            cardsRef.current[`${animation.playerPosition}-${animation.index}`];
          if (cardRef) {
            handleAnimation(animation, cardRef);
            newProcessed.add(animationKey);
          }
        }
      });

      // Limit the size of processed animations set
      if (newProcessed.size > 100) {
        const newProcessedArray = [...newProcessed];
        return new Set(newProcessedArray.slice(-100));
      }

      return newProcessed;
    });
  };

  // Set up periodic animation fetching
  useEffect(() => {
    fetchAnimations();
    const animationInterval = setInterval(fetchAnimations, 1000);
    return () => clearInterval(animationInterval);
  }, [otherPlayerHandsData]);

  // Handle card click during voting phase - showing selected card details or returning to original position
  const handleCardClick = async (cardKey, cardIndex, playerPosition) => {
    const currentCard = cardsRef.current[cardKey].current;

    // Find which card on the table was clicked and get its data
    const getWhichCardIsItOnTable = () => {
      let count = -1;
      for (let i = 0; i < otherPlayerHandsData.length; i++) {
        const playerHand = otherPlayerHandsData[i];
        for (let j = 0; j < numberOfCards; j++) {
          const key = `${playerHand.playerPosition}-${j}`;
          const isSelected = selectedCards.some(
            (card) => card === cardsRef.current[key]?.current
          );
          if (isSelected) count++;
          if (key === cardKey && isSelected) {
            const player = otherPlayersData.find(
              (p) => p.position === playerHand.playerPosition
            );

            const cardData = selectedCardsFromDatabase[count];
            if (cardData && player) {
              return {
                ...cardData,
                playerPosition: player.position,
              };
            }
            return cardData;
          }
        }
      }
      return null;
    };

    const cardData = getWhichCardIsItOnTable();

    // Show card close-up when clicked or return it to table if already selected
    if (!votingSelectedCardRef) {
      setVotingSelectedCardPosition({
        x: currentCard.position.x,
        y: currentCard.position.y,
        z: currentCard.position.z,
      });
      showCardCloserOnVotingPhase(currentCard);
      setVotingSelectedCardRef(currentCard);
      setIsVotingSelectedCardThisPlayers(false);
      if (cardData) {
        setVotingSelectedCardData(cardData);
      }
    } else if (
      votingSelectedCardRef === currentCard &&
      votingSelectedCardPosition
    ) {
      animateToPosition(currentCard, votingSelectedCardPosition);
      setVotingSelectedCardPosition(null);
      setTimeout(() => {
        setVotingSelectedCardRef(null);
      }, 500);
    }
  };

  // Render cards for all other players, handling layout and selection state
  return (
    <>
      {(() => {
        let selectedCardIndex = 0;
        return otherPlayerHandsData.map((playerHand, playerIndex) =>
          calculateCardsLayout(playerHand, numberOfCards).map(
            (cardLayout, cardIndex) => {
              const cardKey = `${playerHand.playerPosition}-${cardIndex}`;
              const isSelected = selectedCards.some(
                (card) => card === cardsRef.current[cardKey]?.current
              );
              const currentIndex = isSelected ? selectedCardIndex++ : -1;
              const cardUrl = isSelected
                ? selectedCardsFromDatabase[currentIndex]?.url
                : "";

              return (
                <Card
                  key={cardKey}
                  index={cardIndex}
                  currentHovered={-1}
                  disableHover={true}
                  setCurrentHovered={() => {}}
                  currentClicked={-1}
                  onCardClick={() => {
                    if (isSelected && votingPhase && cardsRotated)
                      handleCardClick(
                        cardKey,
                        cardIndex,
                        playerHand.playerPosition
                      );
                  }}
                  setCurrentClicked={() => {}}
                  position={cardLayout.position}
                  rotation={cardLayout.rotation}
                  imageUrl={cardUrl}
                  zOffset={playerHand.cardsPosition?.[2] || 0}
                  playerPosition={playerHand.playerPosition}
                  direction={playerHand.direction}
                  cardsPosition={playerHand.cardsPosition}
                  ref={(el) =>
                    el && (cardsRef.current[cardKey] = { current: el })
                  }
                  votingPhase={votingPhase && allImagesLoaded}
                  readyToRotate={allImagesLoaded && cardsRotated}
                  afterVoteData={afterVoteData}
                  playerUid={playerHand.playerUid}
                  votingSelectedCardRef={votingSelectedCardRef}
                  onImageLoaded={handleImageLoaded}
                />
              );
            }
          )
        );
      })()}
    </>
  );
};

export default OtherPlayerHand;
