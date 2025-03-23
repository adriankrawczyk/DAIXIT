import gsap from "gsap";

const ANIMATION_DEFAULTS = {
  DURATION: 0.5,
  EASE_IN: "power2.in",
  EASE_OUT: "power2.out",
  EASE_INOUT: "power2.inOut",
};

const POSITION_CONSTANTS = {
  Y: 1.9,
  DIAGONAL_Y: 1.8,
  Z: 5.4,
  X: 5.4,
  DIAGONAL: 3.6,
  Y_TABLE: 0.6,
  Y_VOTING: 3.85,
  Z_TABLE: 2.5,
  X_TABLE: 2.5,
  DIAGONAL_TABLE: 1.75,
};

const ROTATION_CONSTANTS = {
  X: Math.PI / 15,
  Y: Math.PI,
  Y_HALF: Math.PI / 2,
  Y_QUARTER: Math.PI / 4,
  Y_THREE_QUARTERS: (3 * Math.PI) / 4,
  X_TABLE: Math.PI / 2,
};

export const showCardCloser = (cardRef, direction) => {
  if (!cardRef) return;

  let positionObject = {
    duration: ANIMATION_DEFAULTS.DURATION,
    ease: ANIMATION_DEFAULTS.EASE_IN,
  };
  let rotationObject = {
    duration: ANIMATION_DEFAULTS.DURATION,
    ease: ANIMATION_DEFAULTS.EASE_OUT,
  };

  switch (direction) {
    case "Bottom": {
      Object.assign(positionObject, {
        x: 0,
        y: POSITION_CONSTANTS.Y,
        z: POSITION_CONSTANTS.Z,
      });
      Object.assign(rotationObject, { x: -ROTATION_CONSTANTS.X, y: 0, z: 0 });
      break;
    }
    case "Top": {
      Object.assign(positionObject, {
        x: 0,
        y: POSITION_CONSTANTS.Y,
        z: -POSITION_CONSTANTS.Z,
      });
      Object.assign(rotationObject, {
        x: ROTATION_CONSTANTS.X,
        y: ROTATION_CONSTANTS.Y,
        z: 0,
      });
      break;
    }
    case "Left": {
      Object.assign(positionObject, {
        x: POSITION_CONSTANTS.X,
        y: POSITION_CONSTANTS.Y,
        z: 0,
      });
      Object.assign(rotationObject, {
        x: 0,
        y: ROTATION_CONSTANTS.Y_HALF,
        z: 0,
      });
      break;
    }
    case "Right": {
      Object.assign(positionObject, {
        x: -POSITION_CONSTANTS.X,
        y: POSITION_CONSTANTS.Y,
        z: 0,
      });
      Object.assign(rotationObject, {
        x: 0,
        y: -ROTATION_CONSTANTS.Y_HALF,
        z: 0,
      });
      break;
    }
    case "LeftBottom": {
      Object.assign(positionObject, {
        x: POSITION_CONSTANTS.DIAGONAL,
        y: POSITION_CONSTANTS.DIAGONAL_Y,
        z: POSITION_CONSTANTS.DIAGONAL,
      });
      Object.assign(rotationObject, {
        x: 0,
        y: ROTATION_CONSTANTS.Y_QUARTER,
        z: 0,
      });
      break;
    }
    case "RightBottom": {
      Object.assign(positionObject, {
        x: -POSITION_CONSTANTS.DIAGONAL,
        y: POSITION_CONSTANTS.DIAGONAL_Y,
        z: POSITION_CONSTANTS.DIAGONAL,
      });
      Object.assign(rotationObject, {
        x: 0,
        y: -ROTATION_CONSTANTS.Y_QUARTER,
        z: 0,
      });
      break;
    }
    case "LeftTop": {
      Object.assign(positionObject, {
        x: POSITION_CONSTANTS.DIAGONAL,
        y: POSITION_CONSTANTS.DIAGONAL_Y,
        z: -POSITION_CONSTANTS.DIAGONAL,
      });
      Object.assign(rotationObject, {
        x: 0,
        y: ROTATION_CONSTANTS.Y_THREE_QUARTERS,
        z: 0,
      });
      break;
    }
    case "RightTop": {
      Object.assign(positionObject, {
        x: -POSITION_CONSTANTS.DIAGONAL,
        y: POSITION_CONSTANTS.DIAGONAL_Y,
        z: -POSITION_CONSTANTS.DIAGONAL,
      });
      Object.assign(rotationObject, {
        x: 0,
        y: -ROTATION_CONSTANTS.Y_THREE_QUARTERS,
        z: 0,
      });
      break;
    }
  }

  gsap.to(cardRef.position, positionObject);
  gsap.to(cardRef.rotation, rotationObject);
};

export const animateActionButtons = (acceptButtonRef, declineButtonRef) => {
  if (!acceptButtonRef || !declineButtonRef) return;

  const scaleConfig = {
    x: 1,
    y: 1,
    z: 1,
    duration: ANIMATION_DEFAULTS.DURATION,
    ease: ANIMATION_DEFAULTS.EASE_INOUT,
  };

  gsap.to(acceptButtonRef.scale, scaleConfig);
  gsap.to(declineButtonRef.scale, scaleConfig);
};

export const addToTable = (
  cardRef,
  direction,
  onComplete = null,
  votingPhase = false
) => {
  if (!cardRef) return;
  const positions = {
    Bottom: { x: 0, z: POSITION_CONSTANTS.Z_TABLE },
    Top: { x: 0, z: -POSITION_CONSTANTS.Z_TABLE },
    Left: { x: POSITION_CONSTANTS.X_TABLE, z: 0 },
    Right: { x: -POSITION_CONSTANTS.X_TABLE, z: 0 },
    LeftBottom: {
      x: POSITION_CONSTANTS.DIAGONAL_TABLE,
      z: POSITION_CONSTANTS.DIAGONAL_TABLE,
    },
    RightBottom: {
      x: -POSITION_CONSTANTS.DIAGONAL_TABLE,
      z: POSITION_CONSTANTS.DIAGONAL_TABLE,
    },
    LeftTop: {
      x: POSITION_CONSTANTS.DIAGONAL_TABLE,
      z: -POSITION_CONSTANTS.DIAGONAL_TABLE,
    },
    RightTop: {
      x: -POSITION_CONSTANTS.DIAGONAL_TABLE,
      z: -POSITION_CONSTANTS.DIAGONAL_TABLE,
    },
  };

  // For backward compatibility, check if onComplete is a function or a setDisableHover function
  const setDisableHover = typeof onComplete === "function" ? null : onComplete;

  if (setDisableHover) setDisableHover(true);

  // Create a timeline to sequence animations
  const timeline = gsap.timeline({
    onComplete: () => {
      // Call the onComplete callback if it's a function (not a setDisableHover)
      if (typeof onComplete === "function" && onComplete !== setDisableHover) {
        onComplete();
      }

      // Handle setDisableHover if it exists
      if (setDisableHover) {
        setDisableHover(false);
      }
    },
  });

  // Add animations to the timeline
  timeline.to(
    cardRef.position,
    {
      x: positions[direction].x,
      y: POSITION_CONSTANTS.Y_TABLE,
      z: positions[direction].z,
      duration: ANIMATION_DEFAULTS.DURATION,
      ease: ANIMATION_DEFAULTS.EASE_OUT,
    },
    0
  );

  timeline.to(
    cardRef.rotation,
    {
      x: ROTATION_CONSTANTS.X_TABLE,
      y: 0,
      z: -ROTATION_CONSTANTS.X_TABLE,
      duration: ANIMATION_DEFAULTS.DURATION,
      ease: ANIMATION_DEFAULTS.EASE_OUT,
    },
    0
  );

  // We've removed the automatic rotation for voting phase as it's now handled separately

  return timeline;
};

export const showCardCloserOnVotingPhase = (cardRef) => {
  gsap.to(cardRef.position, {
    x: 0,
    y: POSITION_CONSTANTS.Y_VOTING,
    z: 0,
    duration: ANIMATION_DEFAULTS.DURATION,
    ease: ANIMATION_DEFAULTS.EASE_OUT,
  });
};

export const animateToPosition = (cardRef, position) => {
  gsap.to(cardRef.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration: ANIMATION_DEFAULTS.DURATION,
    ease: ANIMATION_DEFAULTS.EASE_OUT,
  });
};

export const rotateOnTable = (cardRef) => {
  if (!cardRef) return;

  const isAlreadyRotated =
    Math.abs(cardRef.rotation.x + ROTATION_CONSTANTS.X_TABLE) < 0.01 &&
    Math.abs(cardRef.rotation.y) < 0.01 &&
    Math.abs(cardRef.rotation.z - ROTATION_CONSTANTS.X_TABLE) < 0.01;

  if (isAlreadyRotated) return;

  gsap.to(cardRef.rotation, {
    x: -ROTATION_CONSTANTS.X_TABLE,
    y: 0,
    z: ROTATION_CONSTANTS.X_TABLE,
    duration: ANIMATION_DEFAULTS.DURATION,
    ease: ANIMATION_DEFAULTS.EASE_OUT,
  });
};
export const backToHand = (
  cardRef,
  position,
  rotation,
  setDisableHover = null
) => {
  if (!cardRef) return;

  if (setDisableHover) setDisableHover(true);

  gsap.to(cardRef.position, {
    x: position[0],
    y: position[1],
    z: position[2],
    duration: ANIMATION_DEFAULTS.DURATION,
    ease: ANIMATION_DEFAULTS.EASE_OUT,
  });

  gsap.to(cardRef.rotation, {
    x: rotation[0],
    y: rotation[1],
    z: rotation[2],
    duration: ANIMATION_DEFAULTS.DURATION,
    ease: ANIMATION_DEFAULTS.EASE_OUT,
  });

  if (setDisableHover) {
    gsap.delayedCall(ANIMATION_DEFAULTS.DURATION, () => setDisableHover(false));
  }
};
