import { useEffect } from "react";
import {
  auth,
  signInAnonymously,
  onAuthStateChanged,
} from "../../firebase/firebaseConfig";

import { setPlayerData } from "../../firebase/playerMethods";
import { leaveGame } from "../../firebase/lobbyMethods";

const FirebaseLogger = () => {
  useEffect(() => {
    signInAnonymously(auth).catch((error) =>
      console.error("Auth Error:", error)
    );

    const unsubscribe = onAuthStateChanged(auth, async (player) => {
      if (player) {
        await setPlayerData(player.uid);
        const currentGame = localStorage.getItem("currentGame");
        if (currentGame) {
          leaveGame(currentGame, player.uid);
          localStorage.setItem("currentGame", "");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default FirebaseLogger;
