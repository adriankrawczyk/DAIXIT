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
      playerUid,
    },
    ref
  ) => {
    const defaultTexture = useLoader(
      TextureLoader,
      "https://storage.googleapis.com/daixit_photos/dixit_20250215200353.png"
    );
    const reverse = useLoader(TextureLoader, "/card.png");
    const [cardImage, setCardImage] = useState(defaultTexture);
    const internalRef = useRef();
    const actionButtonRefs = useRef([]);

    useImperativeHandle(ref, () => internalRef.current);

    useEffect(() => {
      if (imageUrl) {
        const loader = new TextureLoader();
        loader.load(imageUrl, (texture) => {
          setCardImage(texture);
        });
      }
    }, [imageUrl]);

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
      }

      gsap.to(internalRef.current.position, hoverObject);
    }, [direction, index, cardsPosition]);

    const unhoverAnimation = useCallback(() => {
      if (!internalRef.current) return;

      let hoverObject = { duration: 0.2, ease: "power2.out" };
      if (direction === "Bottom" || direction === "Top") {
        hoverObject.z = index * 0.01 + (cardsPosition?.[2] || 0);
      } else {
        hoverObject.x = index * 0.01 + (cardsPosition?.[0] || 0);
      }

      gsap.to(internalRef.current.position, hoverObject);
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

    const cardData = votingPhase ? findCardData() : null;
    const voters = cardData?.voters || [];
    const playerColors = ["blue", "orange", "magenta", "lightgreen"];

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
          voters.map((voter, voterIndex) => (
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
    );
  }
);

export default Card;
