import { createContext, useContext, useEffect, useState } from "react";

const CameraContext = createContext();

export const CameraProvider = ({ children }) => {
  const [cameraPosition, setCameraPosition] = useState([0, 2, 4.4]);
  const [cameraLookAt, setCameraLookAt] = useState([0, 0, -5]);
  const [cameraLookAtMultiplier, setCameraLookAtMultiplier] = useState([
    1, 1, 1,
  ]);
  const [directionalLightPosition, setDirectionalLightPosition] = useState([
    0, 2, 2.4,
  ]);
  return (
    <CameraContext.Provider
      value={{
        cameraPosition,
        setCameraPosition,
        cameraLookAt,
        setCameraLookAt,
        cameraLookAtMultiplier,
        setCameraLookAtMultiplier,
        directionalLightPosition,
        setDirectionalLightPosition,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => useContext(CameraContext);
