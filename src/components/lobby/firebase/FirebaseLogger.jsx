import { useEffect } from "react";
import {
  auth,
  signInAnonymously,
  onAuthStateChanged,
} from "../../firebase/firebaseConfig";

import { setPlayerData } from "../../firebase/playerMethods";
import { leaveGame } from "../../firebase/lobbyMethods";
import { setPlayerName } from "../../firebase/playerMethods";
import { useSetup } from "../../context/SetupContext";

const FirebaseLogger = async () => {
  await signInAnonymously(auth).catch((error) =>
    console.error("Auth Error:", error)
  );

  if (!localStorage.getItem("name")) {
    const DEFAULT_PLAYER_NAME =
      "GUEST_" + Math.random().toString(36).slice(0, 5);
    localStorage.setItem("name", DEFAULT_PLAYER_NAME);
    setPlayerName(DEFAULT_PLAYER_NAME);
  }

  const unsubscribe = onAuthStateChanged(auth, async (player) => {
    if (player) {
      await setPlayerData(player.uid);
    }
  });

  return () => unsubscribe();
};

export default FirebaseLogger;
