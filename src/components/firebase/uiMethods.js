const bottomDefaultObject = {
  rotation: [-Math.PI / 13, 0, 0],
  textPosition: [0, 0, 0.02],
  textScaleMultiplier: [1, 1, 1],
};

const topDefaultObject = {
  rotation: [Math.PI / 13, 0, 0],
  textPosition: [0, 0, -0.02],
  textScaleMultiplier: [-1, 1, 1],
};

const leftDefaultObject = {
  rotation: [0, -Math.PI / 2, 0],
  textPosition: [0, 0, -0.02],
  textScaleMultiplier: [-1, 1, 1],
};

const rightDefaultObject = {
  rotation: [0, Math.PI / 2, 0],
  textPosition: [0, 0, -0.02],
  textScaleMultiplier: [-1, 1, 1],
};

function getAcceptPositionSetupData(direction, votingPhase = false) {
  if (votingPhase) {
    return {
      ...bottomDefaultObject,
      rotation: [-Math.PI / 2, 0, Math.PI / 2],
      position: [0, 3, 1.5],
    };
  }
  switch (direction) {
    case "Bottom":
      return { ...bottomDefaultObject, position: [-1.7, 1.5, 3] };
    case "Top":
      return { ...topDefaultObject, position: [1.7, 1.5, -3] };
    case "Left":
      return { ...leftDefaultObject, position: [3, 1.5, 1.7] };
    case "Right":
      return { ...rightDefaultObject, position: [-3, 1.5, -1.7] };
    default:
      return bottomDefaultObject;
  }
}

function getDeclinePositionSetupData(direction, votingPhase = false) {
  if (votingPhase) {
    return {
      ...bottomDefaultObject,
      rotation: [-Math.PI / 2, 0, Math.PI / 2],
      position: [0, 3, -1.5],
    };
  }
  switch (direction) {
    case "Bottom":
      return { ...bottomDefaultObject, position: [1.7, 1.5, 3] };
    case "Top":
      return { ...topDefaultObject, position: [-1.7, 1.5, -3] };
    case "Left":
      return { ...leftDefaultObject, position: [3, 1.5, -1.7] };
    case "Right":
      return { ...rightDefaultObject, position: [-3, 1.5, 1.7] };
    default:
      return bottomDefaultObject;
  }
}

function getCenteredButtonData(direction) {
  switch (direction) {
    case "Bottom":
      return { ...bottomDefaultObject, position: [0, 1.5, 3] };
    case "Top":
      return { ...topDefaultObject, position: [0, 1.5, -3] };
    case "Left":
      return { ...leftDefaultObject, position: [3, 1.5, 0] };
    case "Right":
      return { ...rightDefaultObject, position: [-3, 1.5, 0] };
    default:
      return bottomDefaultObject;
  }
}
function getLeftTopButtonData(direction, votingPhase = false) {
  if (votingPhase) {
    return {
      ...bottomDefaultObject,
      rotation: [-Math.PI / 2, 0, Math.PI / 2],
      position: [-1.3, 2, 3.3],
    };
  }
  switch (direction) {
    case "Bottom":
      return { ...bottomDefaultObject, position: [-1.6, 2.3, 3] };
    case "Top":
      return { ...topDefaultObject, position: [1.6, 2.3, -3] };
    case "Left":
      return { ...leftDefaultObject, position: [3, 2.3, -1.6] };
    case "Right":
      return { ...rightDefaultObject, position: [-3, 2.3, 1.6] };
    default:
      return bottomDefaultObject;
  }
}

export {
  getAcceptPositionSetupData,
  getDeclinePositionSetupData,
  getCenteredButtonData,
  getLeftTopButtonData,
};
