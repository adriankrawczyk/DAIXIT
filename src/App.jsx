import "./App.css";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import Lobby from "./components/lobby/Lobby";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { CameraProvider, useCamera } from "./components/context/CameraContext";

const CameraUpdater = () => {
  const { camera } = useThree();
  const { cameraPosition } = useCamera();

  useEffect(() => {
    camera.position.set(...cameraPosition);
    camera.updateProjectionMatrix();
  }, [cameraPosition, camera]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  const { cameraPosition } = useCamera();
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
        <Route path="/game/:gameId" element={<Scene />} />
      </Routes>
    </Canvas>
  );
};

const App = () => {
  return (
    <CameraProvider>
      <Router>
        <AppContent />
      </Router>
    </CameraProvider>
  );
};

export default App;
