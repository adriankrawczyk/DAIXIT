const bottomDefaultObject = {
  rotation: [-Math.PI / 13, 0, 0],
  textPosition: [0, 0, 0.01],
  textScaleMultiplier: [1, 1, 1],
};

const topDefaultObject = {
  rotation: [Math.PI / 13, 0, 0],
  textPosition: [0, 0, -0.01],
  textScaleMultiplier: [-1, 1, 1],
};

const leftDefaultObject = {
  rotation: [0, -Math.PI / 2, 0],
  textPosition: [0, 0, -0.01],
  textScaleMultiplier: [-1, 1, 1],
};

const rightDefaultObject = {
  rotation: [0, Math.PI / 2, 0],
  textPosition: [0, 0, -0.01],
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
      return { ...bottomDefaultObject, position: [-1.7, 2.3, 3] };
    case "Top":
      return { ...topDefaultObject, position: [1.7, 2.3, -3] };
    case "Left":
      return { ...leftDefaultObject, position: [3, 2.3, 1.7] };
    case "Right":
      return { ...rightDefaultObject, position: [-3, 2.3, -1.7] };
    default:
      return bottomDefaultObject;
  }
}

function getPointDisplayerData(direction, playerPosition, votingPhase = false) {
  let basePosition;
  let horizontalSpacing = 0.75;
  let verticalSpacing = 0.5;

  let row = Math.floor(playerPosition / 2);
  let col = playerPosition % 2;

  const playerColors = ["blue", "orange", "magenta", "lightgreen"];
  const color = playerColors[playerPosition];

  if (votingPhase) {
    const basePosition = [1, 2, 3.5];
    return {
      ...bottomDefaultObject,
      rotation: [-Math.PI / 2, 0, Math.PI / 2],
      position: [
        basePosition[0] + (col * horizontalSpacing) / 1.5,
        basePosition[1],
        basePosition[2] - row * verticalSpacing * 1.5,
      ],
      color,
    };
  }

  switch (direction) {
    case "Bottom":
      basePosition = [-2.5, 1, 3];
      return {
        ...bottomDefaultObject,
        position: [
          basePosition[0] + col * horizontalSpacing,
          basePosition[1] - row * verticalSpacing,
          basePosition[2],
        ],
        rotation: [0, 0, 0],
        color,
      };

    case "Top":
      basePosition = [2.5, 1, -3];
      return {
        ...topDefaultObject,
        position: [
          basePosition[0] - col * horizontalSpacing,
          basePosition[1] - row * verticalSpacing,
          basePosition[2],
        ],
        rotation: [0, 0, 0],
        color,
      };

    case "Left":
      basePosition = [3, 1, 2.5];
      return {
        ...leftDefaultObject,
        position: [
          basePosition[0],
          basePosition[1] - row * verticalSpacing,
          basePosition[2] - col * horizontalSpacing,
        ],
        color,
      };

    case "Right":
      basePosition = [-3, 1, -2.5];
      return {
        ...rightDefaultObject,
        position: [
          basePosition[0],
          basePosition[1] - row * verticalSpacing,
          basePosition[2] + col * horizontalSpacing,
        ],
        color,
      };

    default:
      basePosition = [-2.5, 1, 3];
      return {
        ...bottomDefaultObject,
        position: [
          basePosition[0] + col * horizontalSpacing,
          basePosition[1] - row * verticalSpacing,
          basePosition[2],
        ],
        color,
      };
  }
}

function getCardUIData(cardPosition, index) {
  return {
    ...bottomDefaultObject,
    rotation: [-Math.PI / 2, 0, Math.PI / 2],
    position: [
      cardPosition.x - 0.3 + 0.3 * index,
      cardPosition.y + 0.1,
      cardPosition.z,
    ],
  };
}
export {
  getAcceptPositionSetupData,
  getDeclinePositionSetupData,
  getCenteredButtonData,
  getLeftTopButtonData,
  getPointDisplayerData,
  getCardUIData,
};
