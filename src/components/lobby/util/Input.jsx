import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import TextLabel from "./TextLabel";

const Input = ({ position, dimensions, set }) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const prevName = localStorage.getItem("name");
    if (prevName) setText(prevName);
  }, []);

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

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        setIsFocused(true);
      }}
      onPointerMissed={() => setIsFocused(false)}
    >
      <TextLabel
        position={[0, 0, 0.01]}
        fontSize={6}
        text={text}
        anchorX="center"
        anchorY="middle"
      />
      <boxGeometry args={dimensions} />
      <meshBasicMaterial color={isFocused ? "lightgray" : "white"} />
    </mesh>
  );
};

export default Input;
