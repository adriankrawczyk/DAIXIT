import { useState, useEffect } from "react";
import TextLabel from "../util/TextLabel";
import { getUserCount } from "../../firebase/firebaseConfig";

const LobbyPage = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      const count = await getUserCount();
      setUserCount(count);
    };

    fetchUserCount();
  }, []);

  return (
    <>
      <TextLabel position={[0, 0.45, 0.1]} fontSize={16} text={"Lobby:"} />
      <TextLabel
        position={[0, 0, 0.1]}
        fontSize={16}
        text={`Currently online: ${userCount}`}
      />
    </>
  );
};

export default LobbyPage;
