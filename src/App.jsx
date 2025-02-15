import "./App.css";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import { OrbitControls } from "@react-three/drei";

const App = () => {
  return (
    <>
      <Canvas
        camera={{
          near: 0.001,
          far: 1000,
          aspect: window.innerWidth / window.innerHeight,
          position: [0, 2, 4.5],
        }}
      >
        <Scene />
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default App;
