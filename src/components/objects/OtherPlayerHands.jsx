import { useEffect, useState } from "react";
import { getOtherPlayersData } from "../firebase/gameMethods";

const OtherPlayerCards = () => {
  const [otherPlayersData, setOtherPlayersData] = useState([]);
  useEffect(() => {
    const interval = setInterval(async () => {
      setOtherPlayersData(await getOtherPlayersData());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <></>;
};

export default OtherPlayerCards;
