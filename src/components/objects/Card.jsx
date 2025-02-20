import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Card = ({
  cardsRef,
  position,
  rotation,
  inMenu,
  selectedCard,
  currentHovered,
  disableHover,
  setCurrentHovered,
  currentClicked,
  setCurrentClicked,
  imageUrl,
  index,
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
    gsap.to(currentCardRef.current.position, {
      z: 3.03 + index * 0.03,
      duration: 0.2,
      ease: "power2.in",
    });
  };

  const unhoverAnimation = () => {
    gsap.to(currentCardRef.current.position, {
      z: 3 + index * 0.01,
      duration: 0.2,
      ease: "power2.out",
    });
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
          currentHovered !== index &&
          selectedCard !== index
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
          selectedCard !== index
        ) {
          unhoverAnimation();
          setCurrentHovered(-1);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!inMenu){
        setCurrentClicked(index); // changed the logic here!
        }
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
