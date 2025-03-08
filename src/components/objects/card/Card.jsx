import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import React, { useEffect, useRef, useImperativeHandle } from "react";
import ActionButton from "../ActionButton";
import { getCardUIData } from "../../firebase/uiMethods";
import useCardLogic from "./useCardLogic";

const Card = React.forwardRef(
  (
    {
      position,
      rotation,
      inMenu,
      selectedCard,
      currentHovered,
      disableHover,
      setCurrentHovered,
      currentClicked,
      onCardClick,
      imageUrl,
      index,
      cardsPosition,
      playerPosition,
      direction,
      votingPhase,
      afterVoteData,
      votingSelectedCardRef,
    },
    ref
  ) => {
    const defaultTexture = useLoader(TextureLoader, "/DAIXIT/card.png");
    const reverse = useLoader(TextureLoader, "/DAIXIT/card.png");
    const internalRef = useRef();
    const actionButtonRefs = useRef([]);
    const ownerButtonRef = useRef();

    useImperativeHandle(ref, () => internalRef.current);

    const { cardImage, hoverAnimation, unhoverAnimation, findCardData } =
      useCardLogic({
        imageUrl,
        defaultTexture,
        internalRef,
        index,
        cardsPosition,
        direction,
        afterVoteData,
      });

    const cardData = votingPhase ? findCardData() : null;
    const voters = cardData?.voters || [];
    const playerColors = [
      "blue",
      "orange",
      "magenta",
      "lightgreen",
      "cyan",
      "yellow",
      "purple",
      "gold",
    ];
    const isCorrectCard = cardData?.isCorrectCard || false;
    const ownerName = cardData?.playerName || "Unknown";
    const ownerButtonData = getCardUIData(
      internalRef.current?.position || position,
      -1,
      -1
    );

    return (
      <>
        <mesh
          position={position}
          ref={internalRef}
          rotation={rotation}
          onPointerEnter={(e) => {
            e.stopPropagation();
            if (
              !disableHover &&
              currentClicked !== index &&
              currentHovered !== index &&
              selectedCard !== index &&
              internalRef.current &&
              !votingPhase
            ) {
              hoverAnimation();
              setCurrentHovered(index);
            }
          }}
          onPointerLeave={(e) => {
            e.stopPropagation();
            if (
              !disableHover &&
              currentClicked !== index &&
              currentHovered === index &&
              selectedCard !== index &&
              internalRef.current
            ) {
              unhoverAnimation();
              setCurrentHovered(-1);
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            onCardClick(index);
          }}
        >
          <boxGeometry args={[0.64, 0.896, 0.02]} />
          <meshStandardMaterial attach="material-0" map={reverse} />
          <meshStandardMaterial attach="material-1" map={reverse} />
          <meshStandardMaterial attach="material-2" map={reverse} />
          <meshStandardMaterial attach="material-3" map={reverse} />
          <meshStandardMaterial attach="material-4" map={cardImage} />
          <meshStandardMaterial attach="material-5" map={reverse} />
        </mesh>

        {votingPhase &&
          cardData &&
          votingSelectedCardRef !== internalRef.current && (
            <>
              <ActionButton
                ref={ownerButtonRef}
                onClick={() => {}}
                buttonSetupData={ownerButtonData}
                color={isCorrectCard ? "green" : "red"}
                text={ownerName}
                defaultScale={0.5}
              />

              {voters.map((voter, voterIndex) => (
                <ActionButton
                  key={`voter-${voterIndex}`}
                  ref={(el) => (actionButtonRefs.current[voterIndex] = el)}
                  onClick={() => {}}
                  buttonSetupData={getCardUIData(
                    internalRef.current?.position || position,
                    voterIndex,
                    voters.length
                  )}
                  color={playerColors[voter.position || 0]}
                  text={voter.name || "Voter"}
                  defaultScale={0.5}
                />
              ))}
            </>
          )}
      </>
    );
  }
);

export default Card;
