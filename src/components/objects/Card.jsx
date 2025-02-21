import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import React, {
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
} from "react";
import gsap from "gsap";

const Card = React.forwardRef(
  (
    {
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
    },
    ref
  ) => {
    const defaultTexture = useLoader(
      TextureLoader,
      "https://storage.googleapis.com/daixit_photos/dixit_20250215200353.png"
    );
    const reverse = useLoader(TextureLoader, "/card.png");
    const [cardImage, setCardImage] = useState(defaultTexture);
    // Create an internal ref to track the mesh
    const internalRef = React.useRef();

    // Expose the internal ref to the parent component
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
      if (direction === "Bottom" || direction === "Top")
        hoverObject.z = index * 0.01 + (cardsPosition?.[2] || 0);
      else hoverObject.x = index * 0.01 + (cardsPosition?.[0] || 0);
      gsap.to(internalRef.current.position, hoverObject);
    }, [direction, index, cardsPosition]);

    return (
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
            internalRef.current
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
            internalRef.current
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
  }
);

export default Card;
