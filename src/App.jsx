import "./App.css";
import { Canvas } from "@react-three/fiber";
import SceneWrapper from "./components/SceneWrapper";
import Lobby from "./components/lobby/Lobby";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { SetupProvider, useSetup } from "./components/context/SetupContext";

const CameraUpdater = () => {
  const { camera } = useThree();
  const { cameraPosition, votingPhase } = useSetup();

  useEffect(() => {
    camera.position.set(...(votingPhase ? [0, 4.5, 0] : cameraPosition));

    camera.updateProjectionMatrix();
  }, [cameraPosition, camera, votingPhase]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  const { cameraPosition } = useSetup();
  return (
    <Canvas
      camera={{
        near: 0.001,
        far: 1000,
        aspect: window.innerWidth / window.innerHeight,
        position: cameraPosition,
      }}
    >
      <CameraUpdater />
      <Routes location={location}>
        <Route path="/" element={<Lobby />} />
        <Route path="/game/:gameId" element={<SceneWrapper />} />
      </Routes>
    </Canvas>
  );
};

const App = () => {
  return (
    <SetupProvider>
      <Router>
        <AppContent />
      </Router>
    </SetupProvider>
  );
};

export default App;
