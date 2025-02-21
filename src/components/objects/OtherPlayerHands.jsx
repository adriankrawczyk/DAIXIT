import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import gsap from "gsap";
import {
  getOtherPlayersData,
  getSetupData,
  calculateCardsLayout,
} from "../firebase/gameMethods";
import { getAnimations } from "../firebase/playerMethods";
import { addToTable, backToHand } from "../firebase/animations";

const OtherPlayerHand = ({ numberOfCards = 5 }) => {
  const [otherPlayersData, setOtherPlayersData] = useState([]);
  const [otherPlayerHandsData, setOtherPlayerHandsData] = useState([]);
  const [processedAnimations, setProcessedAnimations] = useState(new Set());
  const cardsRef = useRef({});

  const handleAnimation = (animation, cardRef) => {
    if (!cardRef?.current) return;

    const { type, direction, playerPosition, index } = animation;

    if (type === "addOnTable") {
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
    const fetchAnimations = async () => {
      const animations = await getAnimations();
      setProcessedAnimations((prev) => {
        const newProcessed = new Set(prev);
        animations.forEach((animation) => {
          const animationKey = `${animation.playerPosition}-${animation.index}-${animation.type}`;
          if (!newProcessed.has(animationKey)) {
            const cardRef =
              cardsRef.current[
                `${animation.playerPosition}-${animation.index}`
              ];
            if (cardRef) {
              handleAnimation(animation, cardRef);
              newProcessed.add(animationKey);
            }
          }
        });
        return newProcessed;
      });
    };

    fetchAnimations();
    const animationInterval = setInterval(fetchAnimations, 1000);
    return () => clearInterval(animationInterval);
  }, [otherPlayerHandsData]);

  return (
    <>
      {otherPlayerHandsData.map((playerHand, playerIndex) =>
        calculateCardsLayout(playerHand, numberOfCards).map(
          (cardLayout, cardIndex) => {
            const cardKey = `${playerHand.playerPosition}-${cardIndex}`;
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
                imageUrl={playerHand.cards?.[cardIndex] || ""}
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
      )}
    </>
  );
};

export default OtherPlayerHand;
