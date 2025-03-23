import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import React, {
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import gsap from "gsap";
import ActionButton from "./ActionButton";
import { getCardUIData } from "../firebase/uiMethods";
import { getCardsPosition } from "../firebase/gameMethods";

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
      onImageLoaded, // New prop to signal when an image is loaded
    },
    ref
  ) => {
    // Load textures for the card - default front and back textures
    const defaultTexture = useLoader(TextureLoader, "/DAIXIT/card.png");
    const reverse = useLoader(TextureLoader, "/DAIXIT/card.png");
    const [cardImage, setCardImage] = useState(defaultTexture);
    const [imageLoaded, setImageLoaded] = useState(false); // Track if this specific card's image has loaded

    // References for the card mesh and action buttons
    const internalRef = useRef();
    const actionButtonRefs = useRef([]);
    const ownerButtonRef = useRef();

    // Expose the internal ref to parent components
    useImperativeHandle(ref, () => internalRef.current);

    // Load the card's image when imageUrl changes
    useEffect(() => {
      if (imageUrl) {
        const loader = new TextureLoader();
        loader.load(
          imageUrl,
          (texture) => {
            setCardImage(texture);
            setImageLoaded(true);
            // Notify parent that this image has loaded
            if (onImageLoaded) {
              onImageLoaded(imageUrl);
            }
          },
          undefined, // onProgress callback
          (error) => {
            console.error("Error loading texture:", error);
            // Still trigger loaded to avoid blocking the game if an image fails
            setImageLoaded(true);
            if (onImageLoaded) {
              onImageLoaded(imageUrl);
            }
          }
        );
      } else {
        // If no image URL, consider it "loaded" right away
        setImageLoaded(true);
        if (onImageLoaded && imageUrl !== "") {
          onImageLoaded("");
        }
      }
    }, [imageUrl, onImageLoaded]);

    // Animation for when the card is hovered
    // Different hover animations based on the card's direction
    const hoverAnimation = useCallback(() => {
      if (!internalRef.current) return;

      let hoverObject = { duration: 0.2, ease: "power2.in" };

      switch (direction) {
        case "Bottom": {
          hoverObject.z = 0.03 + index * 0.03 + (cardsPosition?.[2] || 0);
          break;
        }
        case "Top": {
          hoverObject.z = -0.12 + index * 0.03 + (cardsPosition?.[2] || 0);
          break;
        }
        case "Left": {
          hoverObject.x = 0.03 + index * 0.03 + (cardsPosition?.[0] || 0);
          break;
        }
        case "Right": {
          hoverObject.x = -0.12 + index * 0.03 + (cardsPosition?.[0] || 0);
          break;
        }
        case "LeftBottom": {
          const pos = getCardsPosition(cardsPosition, index, direction);
          hoverObject.x = pos[0] + 0.03;
          hoverObject.z = pos[2] + 0.03;
          break;
        }
        case "RightTop": {
          const pos = getCardsPosition(cardsPosition, index, direction);
          hoverObject.x = pos[0] - 0.03;
          hoverObject.z = pos[2] - 0.03;
          break;
        }
        case "LeftTop": {
          const pos = getCardsPosition(cardsPosition, index, direction);
          hoverObject.x = pos[0] + 0.03;
          hoverObject.z = pos[2] - 0.03;
          break;
        }
        case "RightBottom": {
          const pos = getCardsPosition(cardsPosition, index, direction);
          hoverObject.x = pos[0] - 0.03;
          hoverObject.z = pos[2] + 0.03;
          break;
        }
      }

      gsap.to(internalRef.current.position, hoverObject);
    }, [direction, index, cardsPosition]);

    // Animation for when the card is no longer hovered
    // Returns the card to its original position
    const unhoverAnimation = useCallback(() => {
      if (!internalRef.current) return;

      const initialPos = getCardsPosition(cardsPosition, index, direction);

      gsap.to(internalRef.current.position, {
        x: initialPos[0],
        y: initialPos[1],
        z: initialPos[2],
        duration: 0.2,
        ease: "power2.out",
      });
    }, [direction, index, cardsPosition]);

    const findCardData = () => {
      if (
        !afterVoteData ||
        !Array.isArray(afterVoteData) ||
        afterVoteData.length === 0
      )
        return null;

      return afterVoteData.find((item) => {
        return item.card && item.card.url === imageUrl;
      });
    };

    // Voting-related data for the card
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
        {/* Card mesh */}
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
          {/* Card geometry and materials */}
          <boxGeometry args={[0.64, 0.896, 0.02]} />
          <meshStandardMaterial attach="material-0" map={reverse} />
          <meshStandardMaterial attach="material-1" map={reverse} />
          <meshStandardMaterial attach="material-2" map={reverse} />
          <meshStandardMaterial attach="material-3" map={reverse} />
          <meshStandardMaterial attach="material-4" map={cardImage} />
          <meshStandardMaterial attach="material-5" map={reverse} />
        </mesh>

        {/* Voting phase UI - shows the card owner and who voted for this card */}
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
