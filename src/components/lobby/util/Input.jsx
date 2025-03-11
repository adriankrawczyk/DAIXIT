import { useState, useRef, useEffect } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import TextLabel from "./TextLabel";
import * as THREE from "three";
import { setPlayerName } from "../../firebase/playerMethods";

const Input = ({
  position,
  dimensions,
  set,
  defaultText,
  fontSize,
  textPosition,
  textScale,
  rotation,
  texture,
  textColor = "black",
}) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const meshRef = useRef();

  // loading the texture
  const usedTexture = useLoader(THREE.TextureLoader, `/DAIXIT/${texture}`);

  useEffect(() => {
    setText(defaultText);
  }, [defaultText]);

  useEffect(() => {
    if (!isFocused) return;

    const handleKeyDown = (event) => {
      if (event.key === "Backspace") {
        setText((prev) => prev.slice(0, -1));
      } else if (event.key.length === 1) {
        setText((prev) => prev + event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused]);

  useEffect(() => {
    set(text);
  }, [text]);

  const handleInputFocus = (e) => {
    e.stopPropagation();
    if (text === defaultText) setText("");

    setIsFocused(true);
    const tempInput = document.createElement("input");
    tempInput.style.position = "fixed";
    tempInput.style.opacity = "0";
    tempInput.style.height = "1px";
    tempInput.style.width = "1px";
    tempInput.style.pointerEvents = "none";
    tempInput.value = text === defaultText ? "" : text;

    document.body.appendChild(tempInput);
    tempInput.focus();

    const handleMobileInput = () => {
      setText(tempInput.value);
    };

    tempInput.addEventListener("input", handleMobileInput);

    const handleBlur = () => {
      document.body.removeChild(tempInput);
      setIsFocused(false);
    };

    tempInput.addEventListener("blur", handleBlur);
  };

  const handlePointerMissed = () => {
    setIsFocused(false);
  };

  return (
    <mesh
      ref={meshRef}
      rotation={rotation}
      position={position}
      onClick={handleInputFocus}
      onPointerMissed={handlePointerMissed}
    >
      <TextLabel
        position={textPosition}
        fontSize={fontSize}
        text={text.slice(Math.max(0, text.length - 16), text.length)} // dodac opcje scrollowania w lewo
        anchorX="center"
        anchorY="middle"
        textScale={textScale}
        textColor={textColor}
      />
      {/* <boxGeometry args={dimensions} /> */}
      <planeGeometry args={dimensions} />
      {/* <meshBasicMaterial color={isFocused ? "lightgreen" : "white"} /> */}
      <meshStandardMaterial
        transparent={true}
        map={usedTexture}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default Input;
