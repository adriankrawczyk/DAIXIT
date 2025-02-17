import { useState, useEffect } from "react";
import NamePage from "../pages/NamePage";
import LobbyPage from "../pages/LobbyPage";

const BoardBackground = () => {
  return (
    <>
      <boxGeometry args={[2, 1.25, 0.02]} />
      <meshBasicMaterial color="gray" />
    </>
  );
};

const Board = () => {
  const [playClicked, setPlayClicked] = useState(false);

  useEffect(() => {
    // Function to handle the back button press
    const handleBackButton = (event) => {
      if (playClicked) {
        // Prevent the default back navigation
        event.preventDefault();
        // Update the state to go back to the NamePage
        setPlayClicked(false);
      }
    };

    // Add the event listener for the popstate event
    window.addEventListener("popstate", handleBackButton);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [playClicked]); // Re-run the effect when playClicked changes

  return (
    <mesh position={[0, 1.9, 3.5]} rotation={[-Math.PI / 16, 0, 0]}>
      <BoardBackground />
      {playClicked ? (
        <LobbyPage setPlayClicked={setPlayClicked} />
      ) : (
        <NamePage setPlayClicked={setPlayClicked} />
      )}
    </mesh>
  );
};

export default Board;
