import { createContext, useContext, useEffect, useState } from "react";

const SetupContext = createContext();

export const SetupProvider = ({ children }) => {
  const [cameraPosition, setCameraPosition] = useState([0, 2, 4.4]);
  const [cameraLookAt, setCameraLookAt] = useState([0, 0, -5]);
  const [cameraLookAtMultiplier, setCameraLookAtMultiplier] = useState([
    1, 1, 1,
  ]);
  const [directionalLightPosition, setDirectionalLightPosition] = useState([
    0, 2, 2.4,
  ]);
  const [cardsPosition, setCardsPosition] = useState([0, 0, 0]);
  const [cardsRotation, setCardsRotation] = useState([0, 0, 0]);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [direction, setDirection] = useState("Bottom");
  const [joined, setJoined] = useState(false);
  return (
    <SetupContext.Provider
      value={{
        cameraPosition,
        setCameraPosition,
        cameraLookAt,
        setCameraLookAt,
        cameraLookAtMultiplier,
        setCameraLookAtMultiplier,
        directionalLightPosition,
        setDirectionalLightPosition,
        cardsPosition,
        setCardsPosition,
        cardsRotation,
        setCardsRotation,
        playerPosition,
        setPlayerPosition,
        direction,
        setDirection,
        joined,
        setJoined,
      }}
    >
      {children}
    </SetupContext.Provider>
  );
};

export const useSetup = () => useContext(SetupContext);
