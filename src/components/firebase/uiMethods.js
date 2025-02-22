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

function getAcceptPositionSetupData(direction) {
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

function getDeclinePositionSetupData(direction) {
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

export {
  getAcceptPositionSetupData,
  getDeclinePositionSetupData,
  getCenteredButtonData,
};
