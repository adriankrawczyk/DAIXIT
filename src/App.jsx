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

const AppContent = () => {
  const location = useLocation();

  return (
    <Canvas
      camera={{
        near: 0.001,
        far: 1000,
        aspect: window.innerWidth / window.innerHeight,
        position: [0, 2, 4.4],
      }}
    >
      <Routes location={location}>
        <Route path="/" element={<Lobby />} />
        <Route path="/game/:gameId" element={<Scene />} />
      </Routes>
    </Canvas>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
