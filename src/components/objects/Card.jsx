import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Card = ({
  cardsRef,
  position,
  rotation,
  currentHovered,
  disableHover,
  setCurrentHovered,
  currentClicked,
  setCurrentClicked,
  imageUrl,
  index,
  cardsPosition,
  playerPosition,
  direction,
}) => {
  const defaultTexture = useLoader(
    TextureLoader,
    "https://storage.googleapis.com/daixit_photos/dixit_20250215200353.png"
  );
  const reverse = useLoader(TextureLoader, "/card.png");
  const [cardImage, setCardImage] = useState(defaultTexture);

  useEffect(() => {
    if (imageUrl) {
      const loader = new TextureLoader();
      loader.load(imageUrl, (texture) => {
        setCardImage(texture);
      });
    }
  }, [imageUrl]);

  const currentCardRef = useRef();
  cardsRef.current[index] = currentCardRef;

  const hoverAnimation = () => {
    let hoverObject = { duration: 0.2, ease: "power2.in" };
    switch (direction) {
      case "Bottom": {
        hoverObject.z = 0.03 + index * 0.03 + cardsPosition[2];
        break;
      }
      case "Top": {
        hoverObject.z = -0.12 + index * 0.03 + cardsPosition[2];
        break;
      }
      case "Left": {
        hoverObject.x = 0.03 + index * 0.03 + cardsPosition[0];
        break;
      }
      case "Right": {
        hoverObject.x = -0.12 + index * 0.03 + cardsPosition[0];
      }
    }
    gsap.to(currentCardRef.current.position, hoverObject);
  };

  const unhoverAnimation = () => {
    let hoverObject = { duration: 0.2, ease: "power2.out" };
    if (direction === "Bottom" || direction === "Top")
      hoverObject.z = index * 0.01 + cardsPosition[2];
    else hoverObject.x = index * 0.01 + cardsPosition[0];
    gsap.to(currentCardRef.current.position, hoverObject);
  };

  return (
    <mesh
      position={position}
      ref={currentCardRef}
      rotation={rotation}
      onPointerEnter={(e) => {
        e.stopPropagation();
        if (
          !disableHover &&
          currentClicked !== index &&
          currentHovered !== index
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
          currentHovered === index
        ) {
          unhoverAnimation();
          setCurrentHovered(-1);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        setCurrentClicked(currentClicked === index ? -1 : index);
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
  );
};

export default Card;
