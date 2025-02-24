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

const OtherPlayerHand = ({ numberOfCards = 5 }) => {
  const { votingPhase } = useSetup();
  const [otherPlayersData, setOtherPlayersData] = useState([]);
  const [otherPlayerHandsData, setOtherPlayerHandsData] = useState([]);
  const [processedAnimations, setProcessedAnimations] = useState(new Set());
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedCardsFromDatabase, setSelectedCardsFromDatabase] = useState(
    []
  );
  const cardsRef = useRef({});

  const handleAnimation = (animation, cardRef) => {
    if (!cardRef?.current) return;

    const { type, direction, playerPosition, index } = animation;
    if (type === "addOnTable") {
      setSelectedCards((prev) => [...prev, cardRef.current]);
      addToTable(cardRef.current, direction);
    } else if (type === "backToHand") {
      const playerHand = otherPlayerHandsData.find(
        (hand) => hand.playerPosition === playerPosition
      );
      if (!playerHand) return;

      const { position, rotation } = calculateCardsLayout(
        playerHand,
        numberOfCards
      )[index];

      backToHand(cardRef.current, position, rotation);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const players = await getOtherPlayersData();
      setOtherPlayersData(players);
      setOtherPlayerHandsData(
        await Promise.all(
          players.map((player) => getSetupData(player.position))
        )
      );
    };

    fetchData();
    const dataInterval = setInterval(fetchData, 1000);
    return () => clearInterval(dataInterval);
  }, []);

  useEffect(() => {
    const handleVotingPhase = async () => {
      if (votingPhase) {
        await fetchAnimations();
        const cards = await getOtherPlayerSelectedCards();
        setSelectedCardsFromDatabase(
          [...cards].sort(() => Math.random() - 0.5)
        );
        selectedCards.forEach((selectedCard, index) => {
          setTimeout(() => {
            rotateOnTable(selectedCard);
          }, index * 300);
        });
      }
    };
    handleVotingPhase();
  }, [votingPhase]);

  const fetchAnimations = async () => {
    const animations = await getAnimations();

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

      if (newProcessed.size > 100) {
        const newProcessedArray = [...newProcessed];
        return new Set(newProcessedArray.slice(-100));
      }

      return newProcessed;
    });
  };

  useEffect(() => {
    fetchAnimations();
    const animationInterval = setInterval(fetchAnimations, 1000);
    return () => clearInterval(animationInterval);
  }, [otherPlayerHandsData]);

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
