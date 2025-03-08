import { useState, useCallback, useEffect } from "react";
import { TextureLoader } from "three";
import gsap from "gsap";
import { getCardsPosition } from "../../firebase/gameMethods";

const useCardLogic = ({
  imageUrl,
  defaultTexture,
  internalRef,
  index,
  cardsPosition,
  direction,
  afterVoteData,
}) => {
  const [cardImage, setCardImage] = useState(defaultTexture);

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
  }, [direction, index, cardsPosition, internalRef]);

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
  }, [direction, index, cardsPosition, internalRef]);

  const findCardData = useCallback(() => {
    if (
      !afterVoteData ||
      !Array.isArray(afterVoteData) ||
      afterVoteData.length === 0
    )
      return null;

    return afterVoteData.find((item) => {
      return item.card && item.card.url === imageUrl;
    });
  }, [afterVoteData, imageUrl]);

  return {
    cardImage,
    hoverAnimation,
    unhoverAnimation,
    findCardData,
  };
};

export default useCardLogic;
