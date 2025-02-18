import { useEffect } from "react";
import {
  auth,
  signInAnonymously,
  onAuthStateChanged,
} from "../../firebase/firebaseConfig";

import { setPlayerData } from "../../firebase/playerMethods";

const FirebaseLogger = () => {
  useEffect(() => {
    signInAnonymously(auth).catch((error) =>
      console.error("Auth Error:", error)
    );

    const unsubscribe = onAuthStateChanged(auth, async (player) => {
      if (player) {
        await setPlayerData(player.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default FirebaseLogger;
