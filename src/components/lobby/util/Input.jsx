import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
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
  const ref = useRef();
  const hiddenInputRef = useRef();

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
  const handleInputFocus = () => {
    setIsFocused(true);
    // Focus the hidden input to bring up the virtual keyboard on mobile
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  // Handle blur event
  const handleInputBlur = () => {
    setIsFocused(false);
  };

  // Handle input change from virtual keyboard
  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  return (
    <>
      {/* Hidden input element to capture mobile keyboard input */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: isFocused ? "auto" : "none",
        }}
      >
        <input
          ref={hiddenInputRef}
          type="text"
          value={text}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          autoFocus={isFocused}
          style={{ opacity: 0, height: "1px", width: "1px" }}
        />
      </div>

      <mesh
        ref={ref}
        rotation={rotation}
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          handleInputFocus();
        }}
        onPointerMissed={handleInputBlur}
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
    </>
  );
};

export default Input;
