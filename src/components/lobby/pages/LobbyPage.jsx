import { useState, useEffect } from "react";
import TextLabel from "../util/TextLabel";
import { getUserCount } from "../../firebase/playerMethods";

const LobbyPage = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      const count = await getUserCount();
      setUserCount(count);
    };
    fetchUserCount();
    const intervalId = setInterval(fetchUserCount, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <TextLabel position={[0, 0.45, 0.1]} fontSize={16} text={"Lobby:"} />
      <TextLabel
        position={[-0.7, 0.5, 0.1]}
        fontSize={4}
        text={`Currently online: ${userCount}`}
      />
    </>
  );
};

export default LobbyPage;
