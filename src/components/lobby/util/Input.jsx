import { useState, useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import TextLabel from "./TextLabel";
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
}) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const meshRef = useRef();
  const { gl } = useThree();

  useEffect(() => {
    setText(defaultText);
  }, [defaultText]);

  useEffect(() => {
    if (!isFocused) return;

    // For desktop keyboard input
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

  // Handle focus and show virtual keyboard on mobile
  const handleInputFocus = (e) => {
    e.stopPropagation();
    setIsFocused(true);

    // Create and focus a temporary input element for mobile
    const tempInput = document.createElement("input");
    tempInput.style.position = "fixed";
    tempInput.style.opacity = "0";
    tempInput.style.height = "1px";
    tempInput.style.width = "1px";
    tempInput.style.pointerEvents = "none";
    tempInput.value = text;

    document.body.appendChild(tempInput);
    tempInput.focus();

    // Handle input from mobile keyboard
    const handleMobileInput = () => {
      setText(tempInput.value);
    };

    tempInput.addEventListener("input", handleMobileInput);

    // Remove the temporary input when done
    const handleBlur = () => {
      document.body.removeChild(tempInput);
      setIsFocused(false);
    };

    tempInput.addEventListener("blur", handleBlur);
  };

  // Handle pointer missed event
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
        text={text}
        anchorX="center"
        anchorY="middle"
        textScale={textScale}
      />
      <boxGeometry args={dimensions} />
      <meshBasicMaterial color={isFocused ? "lightgray" : "white"} />
    </mesh>
  );
};

export default Input;
