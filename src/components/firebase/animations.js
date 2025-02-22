import gsap from "gsap";

export const showCardCloser = (cardRef, direction) => {
  if (!cardRef) return;

  let positionObject = { duration: 0.5, ease: "power2.in" };
  let rotationObject = { duration: 0.5, ease: "power2.out" };

  switch (direction) {
    case "Bottom": {
      Object.assign(positionObject, { x: 0, y: 1.9, z: 3.8 });
      Object.assign(rotationObject, { x: -Math.PI / 15, y: 0, z: 0 });
      break;
    }
    case "Top": {
      Object.assign(positionObject, { x: 0, y: 1.9, z: -3.8 });
      Object.assign(rotationObject, { x: Math.PI / 15, y: Math.PI, z: 0 });
      break;
    }
    case "Left": {
      Object.assign(positionObject, { x: 3.8, y: 1.9, z: 0 });
      Object.assign(rotationObject, { x: 0, y: Math.PI / 2, z: 0 });
      break;
    }
    case "Right": {
      Object.assign(positionObject, { x: -3.8, y: 1.9, z: 0 });
      Object.assign(rotationObject, { x: 0, y: -Math.PI / 2, z: 0 });
      break;
    }
  }

  gsap.to(cardRef.position, positionObject);
  gsap.to(cardRef.rotation, rotationObject);
};

export const animateActionButtons = (acceptButtonRef, declineButtonRef) => {
  if (!acceptButtonRef || !declineButtonRef) return;

  gsap.to(acceptButtonRef.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: 0.5,
    ease: "power2.inOut",
  });

  gsap.to(declineButtonRef.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: 0.5,
    ease: "power2.inOut",
  });
};

export const addToTable = (cardRef, direction, setDisableHover = null) => {
  if (!cardRef) return;

  const positions = {
    Bottom: { x: 0, z: 1 },
    Top: { x: 0, z: -1 },
    Left: { x: 1, z: 0 },
    Right: { x: -1, z: 0 },
  };

  if (setDisableHover) setDisableHover(true);

  gsap.to(cardRef.position, {
    x: positions[direction].x,
    y: 0.6,
    z: positions[direction].z,
    duration: 0.5,
    ease: "power2.out",
  });

  gsap.to(cardRef.rotation, {
    x: Math.PI / 2,
    y: 0,
    z: -Math.PI / 2,
    duration: 0.5,
    ease: "power2.out",
  });

  if (setDisableHover) {
    gsap.delayedCall(0.5, () => setDisableHover(false));
  }
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
    duration: 0.5,
    ease: "power2.out",
  });

  gsap.to(cardRef.rotation, {
    x: rotation[0],
    y: rotation[1],
    z: rotation[2],
    duration: 0.5,
    ease: "power2.out",
  });

  if (setDisableHover) {
    gsap.delayedCall(0.5, () => setDisableHover(false));
  }
};
