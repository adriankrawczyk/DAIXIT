import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import gsap from "gsap";
import {
  getOtherPlayersData,
  getSetupData,
  calculateCardsLayout,
} from "../firebase/gameMethods";
import { getAnimations } from "../firebase/playerMethods";

const OtherPlayerHand = ({ numberOfCards = 5 }) => {
  const [otherPlayersData, setOtherPlayersData] = useState([]);
  const [otherPlayerHandsData, setOtherPlayerHandsData] = useState([]);
  const [processedAnimations, setProcessedAnimations] = useState(new Set());
  const cardsRef = useRef({});

  const animationPresets = {
    addOnTable: (direction) => {
      const positions = {
        Bottom: { x: 0, z: 1 },
        Top: { x: 0, z: -1 },
        Left: { x: 1, z: 0 },
        Right: { x: -1, z: 0 },
      };
      return {
        position: {
          ...positions[direction],
          y: 0.6,
          duration: 0.5,
          ease: "power2.out",
        },
        rotation: {
          x: Math.PI / 2,
          y: 0,
          z: -Math.PI / 2,
          duration: 0.5,
          ease: "power2.out",
        },
      };
    },
    backToHand: (originalPosition, originalRotation) => ({
      position: {
        x: originalPosition[0],
        y: originalPosition[1],
        z: originalPosition[2],
        duration: 0.5,
        ease: "power2.out",
      },
      rotation: {
        x: originalRotation[0],
        y: originalRotation[1],
        z: originalRotation[2],
        duration: 0.5,
        ease: "power2.out",
      },
    }),
  };

  const handleAnimation = (animation, cardRef) => {
    if (!cardRef?.current) return;

    const { type, direction, playerPosition, index } = animation;
    let animationData;

    if (type === "addOnTable") {
      animationData = animationPresets.addOnTable(direction);
    } else if (type === "backToHand") {
      const playerHand = otherPlayerHandsData.find(
        (hand) => hand.playerPosition === playerPosition
      );
      if (!playerHand) return;
      const { position, rotation } = calculateCardsLayout(
        playerHand,
        numberOfCards
      )[index];
      animationData = animationPresets.backToHand(position, rotation);
    }

    if (animationData) {
      gsap.to(cardRef.current.position, animationData.position);
      gsap.to(cardRef.current.rotation, animationData.rotation);
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
