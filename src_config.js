export const TILE_SIZE = 32;
export const WORLD_WIDTH = 220;
export const WORLD_HEIGHT = 70;
export const GRAVITY = 1700;
export const MOVE_SPEED = 220;
export const JUMP_SPEED = 520;
export const MAX_HEALTH = 100;

export const BLOCKS = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  SAND: 4,
  WOOD: 5,
  LEAVES: 6,
  WATER: 7,
  ORE: 8,
  BEDROCK: 9
};

export const BLOCK_COLORS = {
  [BLOCKS.AIR]: null,
  [BLOCKS.GRASS]: "#59b95f",
  [BLOCKS.DIRT]: "#8a5a38",
  [BLOCKS.STONE]: "#7a7f89",
  [BLOCKS.SAND]: "#d8c57f",
  [BLOCKS.WOOD]: "#8a5f3b",
  [BLOCKS.LEAVES]: "#3d8b54",
  [BLOCKS.WATER]: "#3f87d5",
  [BLOCKS.ORE]: "#d1a761",
  [BLOCKS.BEDROCK]: "#3b3d42"
};

export const HOTBAR = [BLOCKS.DIRT, BLOCKS.GRASS, BLOCKS.STONE, BLOCKS.WOOD, BLOCKS.SAND];
export const BLOCK_NAME = {
  [BLOCKS.GRASS]: "Grass",
  [BLOCKS.DIRT]: "Dirt",
  [BLOCKS.STONE]: "Stone",
  [BLOCKS.WOOD]: "Wood",
  [BLOCKS.SAND]: "Sand"
};