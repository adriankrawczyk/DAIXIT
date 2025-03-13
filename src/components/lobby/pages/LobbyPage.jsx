import { useState, useEffect, useCallback } from "react";
import TextLabel from "../util/TextLabel";
import { getUserCount } from "../../firebase/playerMethods";
import Button from "../util/Button";
import { getGames, joinToGame, newGame } from "../../firebase/lobbyMethods";
import { useNavigate } from "react-router-dom";
import GameListElement from "../util/GameListElement";
import { debounce } from "lodash";
import { setCurrentGame } from "../../firebase/localVariables";
import FullBackground from "../../background/FullBackground";
import PagesBackground from "../../background/PagesBackground";

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
    if (isProcessing) {
      return;
    }
    setIsProcessing(true);
    try {
      const gameId = await newGame();
      setCurrentGame(gameId);
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error("Error creating new game:", error);
      setIsProcessing(false);
    }
  };

  const DebouncedHandleNewGame = useCallback(
    debounce(HandleNewGameClicked, 300, {
      leading: true,
      trailing: false,
    }),
    [isProcessing]
  );

  const HandleJoinClick = async (gameId) => {
    if (isProcessing) {
      return;
    }
    setIsProcessing(true);
    try {
      setCurrentGame(gameId);
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error("Error joining game:", error);
      setIsProcessing(false);
    }
  };

  const DebouncedHandleJoinClick = useCallback(
    (gameId) =>
      debounce(() => HandleJoinClick(gameId), 300, {
        leading: true,
        trailing: false,
      }),
    [isProcessing]
  );

  return (
    <>
      <TextLabel position={[0, 0.35, 0.1]} fontSize={16} text={"Lobby:"} font={"/DAIXIT/fonts/ELEGANT.ttf"} textColor="#ff9300"/>
      <TextLabel
        position={[0, 0.25, 0.1]}
        fontSize={4}
        text={`Currently online: ${userCount}`}
        textColor="#ff9300"
      />
      {games && games.length > 0 ? (
        games.map((game, index) => (
          <GameListElement
            key={game.gameId}
            index={index}
            host={game.host}
            gameId={game.gameId}
            HandleJoinClick={DebouncedHandleJoinClick(game.gameId)}
            disabled={isProcessing}
          />
        ))
      ) : (
        <TextLabel
          position={[0, 0.15, 0.1]}
          fontSize={4}
          text="No games available. Create a new game!"
        />
      )}
      <Button
        position={[0, 0.04 - games.length * 0.12, 0.1]}
        dimensions={[0.2, 0.1, 0.01]}
        text={isProcessing ? "Joining..." : "New game"}
        handleClick={DebouncedHandleNewGame}
        disabled={isProcessing}
        enabledColor="#ff9300"
        disabledColor="#790079"
      />
    </>
  );
};

export default LobbyPage;
