const ROTATION_HALF_PI = Math.PI / 2;
const ROTATION_QUARTER_PI = Math.PI / 4;
const ROTATION_THIRTEENTH_PI = Math.PI / 13;
const TEXT_POSITION_OFFSET = 0.01;
const BUTTON_HEIGHT = 1.5;
const CORNER_BUTTON_HEIGHT = 1.7;
const VOTING_BUTTON_HEIGHT = 3;
const VOTING_POSITION_OFFSET = 1.5;
const STANDARD_DISTANCE = 4.5;
const CORNER_DISTANCE = 3;
const SIDE_OFFSET = 1.7;
const OFFSET_FACTOR = 0.707;
const LEFT_TOP_BUTTON_HEIGHT = 2.3;
const VOTING_LEFT_TOP_X = -1.5;
const VOTING_LEFT_TOP_Y = 2;
const VOTING_LEFT_TOP_Z = 3.3;
const NEXT_ROUND_X = -1.5;
const NEXT_ROUND_Y = 2;
const NEXT_ROUND_Z = 0;
const POINTS_BASE_Y = 1;
const POINTS_DISPLAY_OFFSET = 2.5;
const HORIZONTAL_SPACING = 0.75;
const VERTICAL_SPACING = 0.5;
const VOTING_BASE_X = 1.25;
const VOTING_BASE_Y = 2;
const VOTING_BASE_Z = 3.5;
const VOTING_HORIZONTAL_SPACING = HORIZONTAL_SPACING / 1.5;
const VOTING_VERTICAL_SPACING = VERTICAL_SPACING * 1.5;
const CARD_UI_DEFAULT_OFFSET = 0.01;
const CARD_UI_NEGATIVE_OFFSET = -0.6;
const TWO_VOTER_OFFSET = 0.4;
const MULTI_VOTER_SPACING = 0.3;
const SMALLER_OFFSET_MULTIPLIER = 3;
const BIGGER_OFFSET_MULTIPLIER = 6;

const NORMAL_MULTIPLIER = [1, 1, 1];
const REVERSE_X_MULTIPLIER = [-1, 1, 1];
const REVERSE_Z_MULTIPLIER = [1, 1, -1];

const bottomDefaultObject = {
  rotation: [-ROTATION_THIRTEENTH_PI, 0, 0],
  textPosition: [0, 0, TEXT_POSITION_OFFSET],
  textScaleMultiplier: NORMAL_MULTIPLIER,
};

const topDefaultObject = {
  rotation: [ROTATION_THIRTEENTH_PI, 0, 0],
  textPosition: [0, 0, -TEXT_POSITION_OFFSET],
  textScaleMultiplier: REVERSE_X_MULTIPLIER,
};

const leftDefaultObject = {
  rotation: [0, -ROTATION_HALF_PI, 0],
  textPosition: [0, 0, -TEXT_POSITION_OFFSET],
  textScaleMultiplier: REVERSE_X_MULTIPLIER,
};

const rightDefaultObject = {
  rotation: [0, ROTATION_HALF_PI, 0],
  textPosition: [0, 0, -TEXT_POSITION_OFFSET],
  textScaleMultiplier: REVERSE_X_MULTIPLIER,
};

const leftBottomDefaultObject = {
  rotation: [0, ROTATION_QUARTER_PI, 0],
  textPosition: [0, 0, TEXT_POSITION_OFFSET],
  textScaleMultiplier: REVERSE_Z_MULTIPLIER,
};

const leftTopDefaultObject = {
  rotation: [0, -ROTATION_QUARTER_PI, 0],
  textPosition: [0, 0, -TEXT_POSITION_OFFSET],
  textScaleMultiplier: REVERSE_X_MULTIPLIER,
};

const rightTopDefaultObject = {
  rotation: [0, ROTATION_QUARTER_PI, 0],
  textPosition: [0, 0, -TEXT_POSITION_OFFSET],
  textScaleMultiplier: REVERSE_X_MULTIPLIER,
};

const rightBottomDefaultObject = {
  rotation: [0, -ROTATION_QUARTER_PI, 0],
  textPosition: [0, 0, TEXT_POSITION_OFFSET],
  textScaleMultiplier: REVERSE_Z_MULTIPLIER,
};

const votingPhaseCommonSettings = {
  ...bottomDefaultObject,
  rotation: [-ROTATION_HALF_PI, 0, ROTATION_HALF_PI],
};

const PLAYER_COLORS = [
  "blue",
  "orange",
  "magenta",
  "lightgreen",
  "cyan",
  "yellow",
  "purple",
  "gold",
];

function getAcceptPositionSetupData(direction, votingPhase = false) {
  if (votingPhase) {
    return {
      ...votingPhaseCommonSettings,
      position: [0, VOTING_BUTTON_HEIGHT, VOTING_POSITION_OFFSET],
    };
  }

  switch (direction) {
    case "Bottom":
      return {
        ...bottomDefaultObject,
        position: [-SIDE_OFFSET, BUTTON_HEIGHT, STANDARD_DISTANCE],
      };
    case "Top":
      return {
        ...topDefaultObject,
        position: [SIDE_OFFSET, BUTTON_HEIGHT, -STANDARD_DISTANCE],
      };
    case "Left":
      return {
        ...leftDefaultObject,
        position: [STANDARD_DISTANCE, BUTTON_HEIGHT, SIDE_OFFSET],
      };
    case "Right":
      return {
        ...rightDefaultObject,
        position: [-STANDARD_DISTANCE, BUTTON_HEIGHT, -SIDE_OFFSET],
      };
    case "LeftBottom":
      return {
        ...leftBottomDefaultObject,
        position: [
          OFFSET_FACTOR * SMALLER_OFFSET_MULTIPLIER,
          CORNER_BUTTON_HEIGHT,
          OFFSET_FACTOR * BIGGER_OFFSET_MULTIPLIER,
        ],
      };
    case "LeftTop":
      return {
        ...leftTopDefaultObject,
        position: [
          OFFSET_FACTOR * BIGGER_OFFSET_MULTIPLIER,
          CORNER_BUTTON_HEIGHT,
          -OFFSET_FACTOR * SMALLER_OFFSET_MULTIPLIER,
        ],
      };
    case "RightTop":
      return {
        ...rightTopDefaultObject,
        position: [
          -OFFSET_FACTOR * SMALLER_OFFSET_MULTIPLIER,
          CORNER_BUTTON_HEIGHT,
          -OFFSET_FACTOR * BIGGER_OFFSET_MULTIPLIER,
        ],
      };
    case "RightBottom":
      return {
        ...rightBottomDefaultObject,
        position: [
          -OFFSET_FACTOR * BIGGER_OFFSET_MULTIPLIER,
          CORNER_BUTTON_HEIGHT,
          OFFSET_FACTOR * SMALLER_OFFSET_MULTIPLIER,
        ],
      };
    default:
      return bottomDefaultObject;
  }
}

function getDeclinePositionSetupData(direction, votingPhase = false) {
  if (votingPhase) {
    return {
      ...votingPhaseCommonSettings,
      position: [0, VOTING_BUTTON_HEIGHT, -VOTING_POSITION_OFFSET],
    };
  }

  switch (direction) {
    case "Bottom":
      return {
        ...bottomDefaultObject,
        position: [SIDE_OFFSET, BUTTON_HEIGHT, STANDARD_DISTANCE],
      };
    case "Top":
      return {
        ...topDefaultObject,
        position: [-SIDE_OFFSET, BUTTON_HEIGHT, -STANDARD_DISTANCE],
      };
    case "Left":
      return {
        ...leftDefaultObject,
        position: [STANDARD_DISTANCE, BUTTON_HEIGHT, -SIDE_OFFSET],
      };
    case "Right":
      return {
        ...rightDefaultObject,
        position: [-STANDARD_DISTANCE, BUTTON_HEIGHT, SIDE_OFFSET],
      };
    case "LeftBottom":
      return {
        ...leftBottomDefaultObject,
        position: [
          OFFSET_FACTOR * BIGGER_OFFSET_MULTIPLIER,
          CORNER_BUTTON_HEIGHT,
          OFFSET_FACTOR * SMALLER_OFFSET_MULTIPLIER,
        ],
      };
    case "LeftTop":
      return {
        ...leftTopDefaultObject,
        position: [
          OFFSET_FACTOR * SMALLER_OFFSET_MULTIPLIER,
          CORNER_BUTTON_HEIGHT,
          -OFFSET_FACTOR * BIGGER_OFFSET_MULTIPLIER,
        ],
      };
    case "RightTop":
      return {
        ...rightTopDefaultObject,
        position: [
          -OFFSET_FACTOR * BIGGER_OFFSET_MULTIPLIER,
          CORNER_BUTTON_HEIGHT,
          -OFFSET_FACTOR * SMALLER_OFFSET_MULTIPLIER,
        ],
      };
    case "RightBottom":
      return {
        ...rightBottomDefaultObject,
        position: [
          -OFFSET_FACTOR * SMALLER_OFFSET_MULTIPLIER,
          CORNER_BUTTON_HEIGHT,
          OFFSET_FACTOR * BIGGER_OFFSET_MULTIPLIER,
        ],
      };
    default:
      return bottomDefaultObject;
  }
}

function getCenteredButtonData(direction) {
  switch (direction) {
    case "Bottom":
      return {
        ...bottomDefaultObject,
        position: [0, BUTTON_HEIGHT, STANDARD_DISTANCE],
      };
    case "Top":
      return {
        ...topDefaultObject,
        position: [0, BUTTON_HEIGHT, -STANDARD_DISTANCE],
      };
    case "Left":
      return {
        ...leftDefaultObject,
        position: [STANDARD_DISTANCE, BUTTON_HEIGHT, 0],
      };
    case "Right":
      return {
        ...rightDefaultObject,
        position: [-STANDARD_DISTANCE, BUTTON_HEIGHT, 0],
      };
    case "LeftBottom":
      return {
        ...leftBottomDefaultObject,
        position: [CORNER_DISTANCE, BUTTON_HEIGHT, CORNER_DISTANCE],
      };
    case "LeftTop":
      return {
        ...leftTopDefaultObject,
        position: [CORNER_DISTANCE, BUTTON_HEIGHT, -CORNER_DISTANCE],
      };
    case "RightTop":
      return {
        ...rightTopDefaultObject,
        position: [-CORNER_DISTANCE, BUTTON_HEIGHT, -CORNER_DISTANCE],
      };
    case "RightBottom":
      return {
        ...rightBottomDefaultObject,
        position: [-CORNER_DISTANCE, BUTTON_HEIGHT, CORNER_DISTANCE],
      };
    default:
      return bottomDefaultObject;
  }
}

function getLeftTopButtonData(direction, votingPhase = false) {
  if (votingPhase) {
    return {
      ...votingPhaseCommonSettings,
      position: [VOTING_LEFT_TOP_X, VOTING_LEFT_TOP_Y, VOTING_LEFT_TOP_Z],
    };
  }

  switch (direction) {
    case "Bottom":
      return {
        ...bottomDefaultObject,
        position: [-SIDE_OFFSET * 2, LEFT_TOP_BUTTON_HEIGHT, STANDARD_DISTANCE],
      };
    case "Top":
      return {
        ...topDefaultObject,
        position: [SIDE_OFFSET, LEFT_TOP_BUTTON_HEIGHT, -STANDARD_DISTANCE],
      };
    case "Left":
      return {
        ...leftDefaultObject,
        position: [STANDARD_DISTANCE, LEFT_TOP_BUTTON_HEIGHT, SIDE_OFFSET],
      };
    case "Right":
      return {
        ...rightDefaultObject,
        position: [-STANDARD_DISTANCE, LEFT_TOP_BUTTON_HEIGHT, -SIDE_OFFSET],
      };
    case "LeftBottom":
      return {
        ...leftBottomDefaultObject,
        position: [CORNER_DISTANCE, LEFT_TOP_BUTTON_HEIGHT, CORNER_DISTANCE],
      };
    case "LeftTop":
      return {
        ...leftTopDefaultObject,
        position: [CORNER_DISTANCE, LEFT_TOP_BUTTON_HEIGHT, -CORNER_DISTANCE],
      };
    case "RightTop":
      return {
        ...rightTopDefaultObject,
        position: [-CORNER_DISTANCE, LEFT_TOP_BUTTON_HEIGHT, -CORNER_DISTANCE],
      };
    case "RightBottom":
      return {
        ...rightBottomDefaultObject,
        position: [-CORNER_DISTANCE, LEFT_TOP_BUTTON_HEIGHT, CORNER_DISTANCE],
      };
    default:
      return bottomDefaultObject;
  }
}

function getNextRoundButtonData() {
  return {
    ...votingPhaseCommonSettings,
    position: [NEXT_ROUND_X, NEXT_ROUND_Y, NEXT_ROUND_Z],
  };
}

function getPointDisplayerData(direction, playerPosition, votingPhase = false) {
  let basePosition;
  let row = Math.floor(playerPosition / 2);
  let col = playerPosition % 2;
  const color = PLAYER_COLORS[playerPosition];

  if (votingPhase) {
    return {
      ...votingPhaseCommonSettings,
      position: [
        VOTING_BASE_X + col * VOTING_HORIZONTAL_SPACING,
        VOTING_BASE_Y,
        VOTING_BASE_Z - row * VOTING_VERTICAL_SPACING,
      ],
      color,
    };
  }

  switch (direction) {
    case "Bottom":
      basePosition = [-POINTS_DISPLAY_OFFSET, POINTS_BASE_Y, STANDARD_DISTANCE];
      return {
        ...bottomDefaultObject,
        position: [
          basePosition[0] + col * HORIZONTAL_SPACING,
          basePosition[1] - row * VERTICAL_SPACING,
          basePosition[2],
        ],
        rotation: [0, 0, 0],
        color,
      };

    case "Top":
      basePosition = [POINTS_DISPLAY_OFFSET, POINTS_BASE_Y, -STANDARD_DISTANCE];
      return {
        ...topDefaultObject,
        position: [
          basePosition[0] - col * HORIZONTAL_SPACING,
          basePosition[1] - row * VERTICAL_SPACING,
          basePosition[2],
        ],
        rotation: [0, 0, 0],
        color,
      };

    case "Left":
      basePosition = [STANDARD_DISTANCE, POINTS_BASE_Y, POINTS_DISPLAY_OFFSET];
      return {
        ...leftDefaultObject,
        position: [
          basePosition[0],
          basePosition[1] - row * VERTICAL_SPACING,
          basePosition[2] - col * HORIZONTAL_SPACING,
        ],
        color,
      };

    case "Right":
      basePosition = [
        -STANDARD_DISTANCE,
        POINTS_BASE_Y,
        -POINTS_DISPLAY_OFFSET,
      ];
      return {
        ...rightDefaultObject,
        position: [
          basePosition[0],
          basePosition[1] - row * VERTICAL_SPACING,
          basePosition[2] + col * HORIZONTAL_SPACING,
        ],
        color,
      };

    case "LeftBottom":
      basePosition = [
        POINTS_DISPLAY_OFFSET,
        POINTS_BASE_Y,
        POINTS_DISPLAY_OFFSET,
      ];
      return {
        ...leftBottomDefaultObject,
        position: [
          basePosition[0] - col * HORIZONTAL_SPACING,
          basePosition[1] - row * VERTICAL_SPACING,
          basePosition[2] - col * HORIZONTAL_SPACING,
        ],
        color,
      };

    case "LeftTop":
      basePosition = [
        POINTS_DISPLAY_OFFSET,
        POINTS_BASE_Y,
        -POINTS_DISPLAY_OFFSET,
      ];
      return {
        ...leftTopDefaultObject,
        position: [
          basePosition[0] - col * HORIZONTAL_SPACING,
          basePosition[1] - row * VERTICAL_SPACING,
          basePosition[2] + col * HORIZONTAL_SPACING,
        ],
        color,
      };

    case "RightTop":
      basePosition = [
        -POINTS_DISPLAY_OFFSET,
        POINTS_BASE_Y,
        -POINTS_DISPLAY_OFFSET,
      ];
      return {
        ...rightTopDefaultObject,
        position: [
          basePosition[0] + col * HORIZONTAL_SPACING,
          basePosition[1] - row * VERTICAL_SPACING,
          basePosition[2] + col * HORIZONTAL_SPACING,
        ],
        color,
      };

    case "RightBottom":
      basePosition = [
        -POINTS_DISPLAY_OFFSET,
        POINTS_BASE_Y,
        POINTS_DISPLAY_OFFSET,
      ];
      return {
        ...rightBottomDefaultObject,
        position: [
          basePosition[0] + col * HORIZONTAL_SPACING,
          basePosition[1] - row * VERTICAL_SPACING,
          basePosition[2] - col * HORIZONTAL_SPACING,
        ],
        color,
      };

    default:
      basePosition = [-POINTS_DISPLAY_OFFSET, POINTS_BASE_Y, STANDARD_DISTANCE];
      return {
        ...bottomDefaultObject,
        position: [
          basePosition[0] + col * HORIZONTAL_SPACING,
          basePosition[1] - row * VERTICAL_SPACING,
          basePosition[2],
        ],
        color,
      };
  }
}

function getCardUIData(cardPosition, index, votersLength) {
  const result = {
    ...votingPhaseCommonSettings,
  };

  switch (votersLength) {
    case -1:
      result.position = [
        cardPosition.x + CARD_UI_NEGATIVE_OFFSET,
        cardPosition.y + CARD_UI_DEFAULT_OFFSET,
        cardPosition.z,
      ];
      break;
    case 0:
    case 1:
      result.position = [
        cardPosition.x,
        cardPosition.y + CARD_UI_DEFAULT_OFFSET,
        cardPosition.z,
      ];
      break;
    case 2:
      result.position = [
        cardPosition.x - TWO_VOTER_OFFSET / 2 + TWO_VOTER_OFFSET * index,
        cardPosition.y + CARD_UI_DEFAULT_OFFSET,
        cardPosition.z,
      ];
      break;
    default:
      const width = MULTI_VOTER_SPACING * (votersLength - 1);
      const startX = cardPosition.x - width / 2;
      result.position = [
        startX + MULTI_VOTER_SPACING * index,
        cardPosition.y + CARD_UI_DEFAULT_OFFSET,
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
