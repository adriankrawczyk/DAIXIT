import { useState, useEffect } from "react";
import TextLabel from "../util/TextLabel";
import { getUserCount } from "../../firebase/playerMethods";
import Button from "../util/Button";
import { getGames, joinToGame, newGame } from "../../firebase/lobbyMethods";
import { useNavigate } from "react-router-dom";
import GameListElement from "../util/GameListElement";

const LobbyPage = ({ setPlayClicked }) => {
  const [userCount, setUserCount] = useState(0);
  const [games, setGames] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchUserCount = async () => {
      const count = await getUserCount();
      setUserCount(count);
    };
    const fetchGames = async () => {
      const newGames = await getGames();
      setGames(newGames);
    };
    const fetch = () => {
      fetchUserCount();
      fetchGames();
    };

    fetch();

    const intervalId = setInterval(() => {
      fetch();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const HandleNewGameClicked = async () => {
    if (isProcessing || localStorage.getItem("currentGame")) {
      return;
    }

    try {
      setIsProcessing(true);
      const gameId = await newGame();
      localStorage.setItem("currentGame", gameId);
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error("Error creating new game:", error);
      setIsProcessing(false);
    }
  };

  const HandleJoinClick = async (gameId) => {
    if (isProcessing || localStorage.getItem("currentGame")) {
      return;
    }

    try {
      setIsProcessing(true);
      await joinToGame(gameId);
      localStorage.setItem("currentGame", gameId);
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error("Error joining game:", error);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <TextLabel position={[0, 0.45, 0.1]} fontSize={16} text={"Lobby:"} />
      <TextLabel
        position={[-0.7, 0.5, 0.1]}
        fontSize={4}
        text={`Currently online: ${userCount}`}
      />
      {games && games.length > 0 ? (
        games.map((game, index) => (
          <GameListElement
            key={game.gameId}
            index={index}
            host={game.host}
            gameId={game.gameId}
            HandleJoinClick={() => HandleJoinClick(game.gameId)}
            disabled={isProcessing}
          />
        ))
      ) : (
        <TextLabel
          position={[0, 0.3, 0.1]}
          fontSize={4}
          text="No games available. Create a new game!"
        />
      )}
      <Button
        position={[0.7, -0.45, 0.1]}
        dimensions={[0.2, 0.1, 0.01]}
        text={isProcessing ? "Joining..." : "New game"}
        handleClick={HandleNewGameClicked}
        disabled={isProcessing}
      />
    </>
  );
};

export default LobbyPage;
