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

const leftBottomDefaultObject = {
  rotation: [0, Math.PI / 4, 0],
  textPosition: [0, 0, 0.01],
  textScaleMultiplier: [1, 1, -1],
};

const leftTopDefaultObject = {
  rotation: [0, -Math.PI / 4, 0],
  textPosition: [0, 0, -0.01],
  textScaleMultiplier: [-1, 1, 1],
};

const rightTopDefaultObject = {
  rotation: [0, Math.PI / 4, 0],
  textPosition: [0, 0, -0.01],
  textScaleMultiplier: [-1, 1, 1],
};

const rightBottomDefaultObject = {
  rotation: [0, Math.PI / 4, 0],
  textPosition: [0, 0, 0.01],
  textScaleMultiplier: [-1, 1, -1],
};

const offsetFactor = 0.707;

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
    case "LeftBottom":
      return {
        ...leftBottomDefaultObject,
        position: [offsetFactor * 2, 1.7, offsetFactor * 4.5],
      };
    case "LeftTop":
      return {
        ...leftBottomDefaultObject,
        position: [offsetFactor * 4.5, 1.7, -offsetFactor * 2],

        rotation: [0, Math.PI * 0.75, 0],
      };
    case "RightTop":
      return {
        ...leftBottomDefaultObject,
        position: [-offsetFactor * 2, 1.7, -offsetFactor * 4.5],
      };
    case "RightBottom":
      return {
        ...leftBottomDefaultObject,
        position: [-offsetFactor * 2, 1.7, offsetFactor * 4.5],
      };
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
    case "LeftBottom":
      return {
        ...leftBottomDefaultObject,
        position: [offsetFactor * 4.5, 1.7, offsetFactor * 2],
      };
    case "LeftTop":
      return {
        ...leftBottomDefaultObject,
        position: [offsetFactor * 2, 1.7, -offsetFactor * 4.5],

        rotation: [0, Math.PI * 0.75, 0],
      };
    case "RightTop":
      return {
        ...leftBottomDefaultObject,
        position: [-offsetFactor * 4.5, 1.7, -offsetFactor * 2],
      };
    case "RightBottom":
      return {
        ...leftBottomDefaultObject,
        position: [-offsetFactor * 4.5, 1.7, offsetFactor * 2],
      };
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
    case "LeftBottom":
      return { ...leftBottomDefaultObject, position: [2.1, 1.5, 2.1] };
    case "LeftTop":
      return { ...leftTopDefaultObject, position: [2.1, 1.5, -2.1] };
    case "RightTop":
      return { ...rightTopDefaultObject, position: [-2.1, 1.5, -2.1] };
    case "RightBottom":
      return { ...rightBottomDefaultObject, position: [-2.1, 1.5, 2.1] };
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
    case "LeftBottom":
      return { ...leftBottomDefaultObject, position: [2.1, 2.3, 2.1] };
    case "LeftTop":
      return { ...leftTopDefaultObject, position: [2.1, 2.3, -2.1] };
    case "RightTop":
      return { ...rightTopDefaultObject, position: [-2.1, 2.3, -2.1] };
    case "RightBottom":
      return { ...rightBottomDefaultObject, position: [-2.1, 2.3, 2.1] };
    default:
      return bottomDefaultObject;
  }
}

function getNextRoundButtonData() {
  return {
    ...bottomDefaultObject,
    rotation: [-Math.PI / 2, 0, Math.PI / 2],
    position: [-1.5, 2, 0],
  };
}

function getPointDisplayerData(direction, playerPosition, votingPhase = false) {
  let basePosition;
  let horizontalSpacing = 0.75;
  let verticalSpacing = 0.5;

  let row = Math.floor(playerPosition / 2);
  let col = playerPosition % 2;

  const playerColors = [
    "blue",
    "orange",
    "magenta",
    "lightgreen",
    "cyan",
    "yellow",
    "purple",
    "gold",
  ];
  const color = playerColors[playerPosition];

  if (votingPhase) {
    const basePosition = [1, 2, 3.5];
    row = Math.floor(playerPosition / 2);
    col = playerPosition % 2;

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

    case "LeftBottom":
      basePosition = [2.5, 1, 2.5];
      return {
        ...leftBottomDefaultObject,
        position: [
          basePosition[0] - col * horizontalSpacing,
          basePosition[1] - row * verticalSpacing,
          basePosition[2] - col * horizontalSpacing,
        ],
        color,
      };

    case "LeftTop":
      basePosition = [2.5, 1, -2.5];
      return {
        ...leftTopDefaultObject,
        position: [
          basePosition[0] - col * horizontalSpacing,
          basePosition[1] - row * verticalSpacing,
          basePosition[2] + col * horizontalSpacing,
        ],
        color,
      };

    case "RightTop":
      basePosition = [-2.5, 1, -2.5];
      return {
        ...rightTopDefaultObject,
        position: [
          basePosition[0] + col * horizontalSpacing,
          basePosition[1] - row * verticalSpacing,
          basePosition[2] + col * horizontalSpacing,
        ],
        color,
      };

    case "RightBottom":
      basePosition = [-2.5, 1, 2.5];
      return {
        ...rightBottomDefaultObject,
        position: [
          basePosition[0] + col * horizontalSpacing,
          basePosition[1] - row * verticalSpacing,
          basePosition[2] - col * horizontalSpacing,
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

function getCardUIData(cardPosition, index, votersLength) {
  const result = {
    ...bottomDefaultObject,
    rotation: [-Math.PI / 2, 0, Math.PI / 2],
  };

  switch (votersLength) {
    case -1:
      result.position = [
        cardPosition.x - 0.6,
        cardPosition.y + 0.01,
        cardPosition.z,
      ];
      break;
    case 0:
      result.position = [cardPosition.x, cardPosition.y + 0.01, cardPosition.z];
      break;
    case 1:
      result.position = [cardPosition.x, cardPosition.y + 0.01, cardPosition.z];
      break;
    case 2:
      const twoVoterOffset = 0.4;
      result.position = [
        cardPosition.x - twoVoterOffset / 2 + twoVoterOffset * index,
        cardPosition.y + 0.01,
        cardPosition.z,
      ];
      break;
    default:
      const width = 0.3 * (votersLength - 1);
      const startX = cardPosition.x - width / 2;
      result.position = [
        startX + 0.3 * index,
        cardPosition.y + 0.01,
        cardPosition.z,
      ];
      break;
  }

  return result;
}

export {
  getAcceptPositionSetupData,
  getDeclinePositionSetupData,
  getCenteredButtonData,
  getLeftTopButtonData,
  getPointDisplayerData,
  getCardUIData,
  getNextRoundButtonData,
};
