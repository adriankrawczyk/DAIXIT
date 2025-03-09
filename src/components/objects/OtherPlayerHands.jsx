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

  // Refs to track component state across renders and store card DOM references
  const cardsRef = useRef({});
  const previousRoundRef = useRef(round);
  const hasRefreshedCardsRef = useRef(false);
  const votingPhaseHandled = useRef(false);

  // Process card animations based on animation type (table placement or return to hand)
  const handleAnimation = (animation, cardRef) => {
    if (!cardRef?.current) return;
    const { type, direction, playerPosition, index } = animation;

    if (type === "addOnTable") {
      setSelectedCards((prev) => [...prev, cardRef.current]);
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
        for (const cardData of selectedCardsData) {
          const playerPosition = players.find(
            (player) => player.playerUid === cardData.playerUid
          ).currentGameData.position;
          const playerHand = otherPlayerHandsData.find(
            (hand) => hand.playerPosition === playerPosition
          );
          if (playerHand) {
            const cardKey = `${playerHand.playerPosition}-${cardData.index}`;
            const cardRef = cardsRef.current[cardKey];
            if (cardRef?.current) {
              setSelectedCards((prev) => [...prev, cardRef.current]);
              addToTable(
                cardRef.current,
                playerHand.direction,
                null,
                votingPhase
              );

              if (votingPhase) {
                rotateOnTable(cardRef.current);
              }
            }
          }
        }
      }

      hasRefreshedCardsRef.current = true;
    };

    refreshOtherPlayersCards();
  }, [isInitialized, otherPlayerHandsData, votingPhase]);

  // Reset voting phase flag when round changes
  useEffect(() => {
    if (previousRoundRef.current !== round) {
      votingPhaseHandled.current = false;
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
        previousRoundRef.current = round;
      }
    };

    changeRound();
  }, [round, otherPlayerHandsData, selectedCards]);

  // Handle voting phase transitions by randomizing and rotating cards on table
  useEffect(() => {
    const handleVotingPhase = async () => {
      if (votingPhase && votingPhaseHandled.current !== true) {
        await fetchAnimations();
        const cards = await getOtherPlayerSelectedCards();
        setSelectedCardsFromDatabase(
          [...cards].sort(() => Math.random() - 0.5)
        );
        selectedCards.forEach((selectedCard, index) => {
          setTimeout(() => {
            rotateOnTable(selectedCard);
          }, (index + 1) * 500);
        });
        votingPhaseHandled.current = true;
      }
    };
    handleVotingPhase();
  }, [votingPhase]);

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
              return (
                <Card
                  key={cardKey}
                  index={cardIndex}
                  currentHovered={-1}
                  disableHover={true}
                  setCurrentHovered={() => {}}
                  currentClicked={-1}
                  onCardClick={() => {
                    if (isSelected && votingPhase)
                      handleCardClick(
                        cardKey,
                        cardIndex,
                        playerHand.playerPosition
                      );
                  }}
                  setCurrentClicked={() => {}}
                  position={cardLayout.position}
                  rotation={cardLayout.rotation}
                  imageUrl={
                    isSelected
                      ? selectedCardsFromDatabase[currentIndex]?.url
                      : ""
                  }
                  zOffset={playerHand.cardsPosition?.[2] || 0}
                  playerPosition={playerHand.playerPosition}
                  direction={playerHand.direction}
                  cardsPosition={playerHand.cardsPosition}
                  ref={(el) =>
                    el && (cardsRef.current[cardKey] = { current: el })
                  }
                  votingPhase={votingPhase}
                  afterVoteData={afterVoteData}
                  playerUid={playerHand.playerUid}
                  votingSelectedCardRef={votingSelectedCardRef}
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
