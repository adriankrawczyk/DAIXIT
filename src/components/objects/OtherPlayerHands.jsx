import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import gsap from "gsap";
import { getOtherPlayersData, getSetupData } from "../firebase/gameMethods";

const OtherPlayerHand = ({ numberOfCards = 5 }) => {
  const [otherPlayersData, setOtherPlayersData] = useState([]);
  const [otherPlayerHandsData, setOtherPlayerHandsData] = useState([]);
  const cardsRef = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      const players = await getOtherPlayersData();
      setOtherPlayersData(players);

      const handsData = await Promise.all(
        players.map((player) => getSetupData(player.position))
      );

      setOtherPlayerHandsData(handsData);
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateCardsLayout = (playerSetup) => {
    if (!playerSetup) return [];

    const { cardsPosition, cardsRotation } = playerSetup;

    return Array.from({ length: numberOfCards }, (_, i) => ({
      position: [
        (i - 2) / 2 + cardsPosition[0],
        cardsPosition[1],
        i * 0.01 + cardsPosition[2],
      ],
      rotation: cardsRotation,
    }));
  };

  return (
    <>
      {otherPlayerHandsData.map((playerHand, playerIndex) => {
        const cardsLayout = calculateCardsLayout(playerHand);

        return cardsLayout.map((cardLayout, cardIndex) => (
          <Card
            key={`${playerIndex}-${cardIndex}`}
            index={cardIndex}
            cardsRef={cardsRef}
            currentHovered={-1}
            disableHover={true}
            setCurrentHovered={() => {}}
            currentClicked={-1}
            setCurrentClicked={() => {}}
            position={cardLayout.position}
            rotation={cardLayout.rotation}
            imageUrl={playerHand.cards?.[cardIndex] || ""}
            zOffset={playerHand.cardsPosition?.[2] || 0}
            playerPosition={otherPlayersData[playerIndex]?.position || 0}
          />
        ));
      })}
    </>
  );
};

export default OtherPlayerHand;
