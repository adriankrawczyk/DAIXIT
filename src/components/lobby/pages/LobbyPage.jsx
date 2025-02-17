import { useState, useEffect } from "react";
import TextLabel from "../util/TextLabel";
import { getUserCount } from "../../firebase/playerMethods";
import Button from "../util/Button";
import { newGame } from "../../firebase/lobbyMethods";
import { useNavigate } from "react-router-dom";

const LobbyPage = () => {
  const [userCount, setUserCount] = useState(0);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchUserCount = async () => {
      const count = await getUserCount();
      setUserCount(count);
    };
    fetchUserCount();
    const intervalId = setInterval(fetchUserCount, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const HandleNewGameClicked = async () => {
    const game = await newGame();
    navigate(`/game/${game}`);
  };

  return (
    <>
      <TextLabel position={[0, 0.45, 0.1]} fontSize={16} text={"Lobby:"} />
      <TextLabel
        position={[-0.7, 0.5, 0.1]}
        fontSize={4}
        text={`Currently online: ${userCount}`}
      />
      <Button
        position={[0.7, -0.45, 0.1]}
        dimensions={[0.2, 0.1, 0.01]}
        text="New game"
        handleClick={HandleNewGameClicked}
      />
    </>
  );
};

export default LobbyPage;
