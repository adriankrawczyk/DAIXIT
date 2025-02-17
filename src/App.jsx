import "./App.css";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import Lobby from "./components/lobby/Lobby";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Canvas
              camera={{
                near: 0.001,
                far: 1000,
                aspect: window.innerWidth / window.innerHeight,
                position: [0, 2, 4.4],
              }}
            >
              <Lobby />
            </Canvas>
          }
        />
        <Route
          path="/game/:gameId"
          element={
            <Canvas
              camera={{
                near: 0.001,
                far: 1000,
                aspect: window.innerWidth / window.innerHeight,
                position: [0, 2, 4.4],
              }}
            >
              <Scene />
            </Canvas>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
