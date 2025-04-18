// Game data for the FruitBox Flex game

// Fruit items with their types and colors
export const fruitItems = [
  {
    id: 1,
    type: "apple",
    name: "Apple",
    color: "red",
  },
  {
    id: 2,
    type: "banana",
    name: "Banana",
    color: "yellow",
  },
  {
    id: 3,
    type: "orange",
    name: "Orange",
    color: "orange",
  },
  {
    id: 4,
    type: "strawberry",
    name: "Strawberry",
    color: "red",
  },
  {
    id: 5,
    type: "grapes",
    name: "Grapes",
    color: "purple",
  },
  {
    id: 6,
    type: "watermelon",
    name: "Watermelon",
    color: "green",
  },
  {
    id: 7,
    type: "pineapple",
    name: "Pineapple",
    color: "yellow",
  },
  {
    id: 8,
    type: "mango",
    name: "Mango",
    color: "orange",
  },
];

// Basket items that will be the targets
export const basketItems = [
  {
    id: 1,
    type: "red",
    name: "Red Basket",
    color: "red",
  },
  {
    id: 2,
    type: "yellow",
    name: "Yellow Basket",
    color: "yellow",
  },
  {
    id: 3,
    type: "orange",
    name: "Orange Basket",
    color: "orange",
  },
  {
    id: 4,
    type: "purple",
    name: "Purple Basket",
    color: "purple",
  },
  {
    id: 5,
    type: "green",
    name: "Green Basket",
    color: "green",
  },
];

// Game levels
export const flexLevels = [
  {
    id: 1,
    title: "Horizontal Centering",
    description:
      "Place the apple in the red basket by centering it horizontally",
    initialCode:
      "#container {\n  display: flex;\n  /* Add your code below */\n\n}",
    fruits: [{ id: 1, type: "apple", color: "red" }],
    baskets: [{ id: 1, type: "red", position: "center" }],
    successConditions: {
      requiredProperties: ["justify-content"],
      requiredValues: ["center"],
    },
    hints: [
      "The justify-content property aligns items horizontally in a flex container",
      "Try using justify-content: center to place items in the center",
    ],
  },
  {
    id: 2,
    title: "Vertical Centering",
    description:
      "Place the banana in the yellow basket by centering it vertically",
    initialCode:
      "#container {\n  display: flex;\n  height: 300px;\n  /* Add your code below */\n\n}",
    fruits: [{ id: 2, type: "banana", color: "yellow" }],
    baskets: [{ id: 2, type: "yellow", position: "middle" }],
    successConditions: {
      requiredProperties: ["align-items"],
      requiredValues: ["center"],
    },
    hints: [
      "The align-items property aligns items vertically in a flex container",
      "Try using align-items: center to place items in the middle",
    ],
  },
  {
    id: 3,
    title: "Perfect Centering",
    description:
      "Place the orange in the orange basket by centering it both horizontally and vertically",
    initialCode:
      "#container {\n  display: flex;\n  height: 300px;\n  /* Add your code below */\n\n}",
    fruits: [{ id: 3, type: "orange", color: "orange" }],
    baskets: [{ id: 3, type: "orange", position: "center-middle" }],
    successConditions: {
      requiredProperties: ["justify-content", "align-items"],
      requiredValues: ["center", "center"],
    },
    hints: [
      "You need to use both justify-content and align-items properties",
      "justify-content controls horizontal alignment",
      "align-items controls vertical alignment",
    ],
  },
  {
    id: 4,
    title: "Row Reverse",
    description:
      "Place the fruits in their matching baskets by reversing their order",
    initialCode:
      "#container {\n  display: flex;\n  /* Add your code below */\n\n}",
    fruits: [
      { id: 1, type: "apple", color: "red" },
      { id: 2, type: "banana", color: "yellow" },
      { id: 3, type: "orange", color: "orange" },
    ],
    baskets: [
      { id: 3, type: "orange", position: "left" },
      { id: 2, type: "yellow", position: "center" },
      { id: 1, type: "red", position: "right" },
    ],
    successConditions: {
      requiredProperties: ["flex-direction"],
      requiredValues: ["row-reverse"],
    },
    hints: [
      "The flex-direction property sets the direction of the flex items",
      "Try using flex-direction: row-reverse to reverse the order",
    ],
  },
  {
    id: 5,
    title: "Space Between",
    description: "Distribute the fruits evenly with space between them",
    initialCode:
      "#container {\n  display: flex;\n  /* Add your code below */\n\n}",
    fruits: [
      { id: 1, type: "apple", color: "red" },
      { id: 2, type: "banana", color: "yellow" },
      { id: 3, type: "orange", color: "orange" },
    ],
    baskets: [
      { id: 1, type: "red", position: "left" },
      { id: 2, type: "yellow", position: "center" },
      { id: 3, type: "orange", position: "right" },
    ],
    successConditions: {
      requiredProperties: ["justify-content"],
      requiredValues: ["space-between"],
    },
    hints: [
      "The justify-content property can distribute items with equal space",
      "Try using justify-content: space-between to create equal space between items",
    ],
  },
  {
    id: 6,
    title: "Wrapping Items",
    description: "Make the fruits wrap to the next line to match their baskets",
    initialCode:
      "#container {\n  display: flex;\n  width: 300px;\n  /* Add your code below */\n\n}",
    fruits: [
      { id: 1, type: "apple", color: "red" },
      { id: 2, type: "banana", color: "yellow" },
      { id: 3, type: "orange", color: "orange" },
      { id: 4, type: "strawberry", color: "red" },
    ],
    baskets: [
      { id: 1, type: "red", position: "top-left" },
      { id: 2, type: "yellow", position: "top-right" },
      { id: 3, type: "orange", position: "bottom-left" },
      { id: 4, type: "red", position: "bottom-right" },
    ],
    successConditions: {
      requiredProperties: ["flex-wrap"],
      requiredValues: ["wrap"],
    },
    hints: [
      "The flex-wrap property controls whether items should wrap to new lines",
      "Try using flex-wrap: wrap to allow items to flow to the next line",
    ],
  },
  {
    id: 7,
    title: "Column Layout",
    description: "Arrange the fruits in a column to match their baskets",
    initialCode:
      "#container {\n  display: flex;\n  height: 400px;\n  /* Add your code below */\n\n}",
    fruits: [
      { id: 1, type: "apple", color: "red" },
      { id: 2, type: "banana", color: "yellow" },
      { id: 3, type: "orange", color: "orange" },
    ],
    baskets: [
      { id: 1, type: "red", position: "top" },
      { id: 2, type: "yellow", position: "middle" },
      { id: 3, type: "orange", position: "bottom" },
    ],
    successConditions: {
      requiredProperties: ["flex-direction"],
      requiredValues: ["column"],
    },
    hints: [
      "The flex-direction property sets the direction of the flex items",
      "Try using flex-direction: column to stack items vertically",
    ],
  },
  {
    id: 8,
    title: "Advanced Layout",
    description: "Create a complex layout with multiple flex properties",
    initialCode:
      "#container {\n  display: flex;\n  height: 400px;\n  /* Add your code below */\n\n}",
    fruits: [
      { id: 1, type: "apple", color: "red" },
      { id: 2, type: "banana", color: "yellow" },
      { id: 3, type: "orange", color: "orange" },
      { id: 5, type: "grapes", color: "purple" },
    ],
    baskets: [
      { id: 1, type: "red", position: "top-left" },
      { id: 2, type: "yellow", position: "top-right" },
      { id: 3, type: "orange", position: "bottom-left" },
      { id: 4, type: "purple", position: "bottom-right" },
    ],
    successConditions: {
      requiredProperties: ["flex-wrap", "justify-content", "align-content"],
      requiredValues: ["wrap", "space-between", "space-between"],
    },
    hints: [
      "You need to use multiple flex properties for this layout",
      "flex-wrap: wrap allows items to flow to multiple lines",
      "justify-content distributes items horizontally",
      "align-content distributes wrapped lines vertically",
    ],
  },
  {
    id: 9,
    title: "Flex Grow",
    description: "Make the banana grow to fill the available space",
    initialCode:
      "#container {\n  display: flex;\n  /* No need to modify container */\n}\n\n/* Add your code to the .flex-item class */\n.flex-item.banana {\n  /* Add your code below */\n\n}",
    fruits: [
      { id: 1, type: "apple", color: "red" },
      { id: 2, type: "banana", color: "yellow" },
      { id: 3, type: "orange", color: "orange" },
    ],
    baskets: [
      { id: 1, type: "red", position: "left" },
      { id: 2, type: "yellow", position: "center" },
      { id: 3, type: "orange", position: "right" },
    ],
    successConditions: {
      requiredProperties: ["flex-grow"],
      requiredValues: ["1"],
    },
    hints: [
      "The flex-grow property defines how much an item can grow",
      "Try using flex-grow: 1 to make the item fill available space",
    ],
  },
  {
    id: 10,
    title: "Flex Shrink",
    description:
      "Make the orange shrink more than other fruits when space is limited",
    initialCode:
      "#container {\n  display: flex;\n  width: 300px; /* Limited space */\n}\n\n/* Add your code to the .flex-item class */\n.flex-item.orange {\n  /* Add your code below */\n\n}",
    fruits: [
      { id: 1, type: "apple", color: "red" },
      { id: 3, type: "orange", color: "orange" },
      { id: 5, type: "grapes", color: "purple" },
    ],
    baskets: [
      { id: 1, type: "red", position: "left" },
      { id: 3, type: "orange", position: "center" },
      { id: 4, type: "purple", position: "right" },
    ],
    successConditions: {
      requiredProperties: ["flex-shrink"],
      requiredValues: ["2"],
    },
    hints: [
      "The flex-shrink property defines how much an item will shrink",
      "Default value is 1. Higher values make items shrink more",
      "Try using flex-shrink: 2 to make the orange shrink more",
    ],
  },
  {
    id: 11,
    title: "Flex Basis",
    description:
      "Set the initial size of the strawberry before it grows or shrinks",
    initialCode:
      "#container {\n  display: flex;\n}\n\n/* Add your code to the .flex-item class */\n.flex-item.strawberry {\n  /* Add your code below */\n\n}",
    fruits: [
      { id: 2, type: "banana", color: "yellow" },
      { id: 4, type: "strawberry", color: "red" },
      { id: 6, type: "watermelon", color: "green" },
    ],
    baskets: [
      { id: 2, type: "yellow", position: "left" },
      { id: 1, type: "red", position: "center" },
      { id: 5, type: "green", position: "right" },
    ],
    successConditions: {
      requiredProperties: ["flex-basis"],
      requiredValues: ["100px"],
    },
    hints: [
      "The flex-basis property sets the initial size of a flex item",
      "Try using flex-basis: 100px to set the initial width",
    ],
  },
  {
    id: 12,
    title: "Flex Shorthand",
    description:
      "Use the flex shorthand property to make the grapes grow twice as much as other fruits",
    initialCode:
      "#container {\n  display: flex;\n}\n\n/* Add your code to the .flex-item class */\n.flex-item.grapes {\n  /* Add your code below */\n\n}",
    fruits: [
      { id: 1, type: "apple", color: "red" },
      { id: 5, type: "grapes", color: "purple" },
      { id: 7, type: "pineapple", color: "yellow" },
    ],
    baskets: [
      { id: 1, type: "red", position: "left" },
      { id: 4, type: "purple", position: "center" },
      { id: 2, type: "yellow", position: "right" },
    ],
    successConditions: {
      requiredProperties: ["flex"],
      requiredValues: ["2"],
    },
    hints: [
      "The flex property is a shorthand for flex-grow, flex-shrink, and flex-basis",
      "Try using flex: 2 to make the item grow twice as much",
    ],
  },
];

// Game sounds - empty strings for now until we have actual sound files
export const flexGameSounds = {
  correct: "",
  wrong: "",
  levelComplete: "",
  gameComplete: "",
};
