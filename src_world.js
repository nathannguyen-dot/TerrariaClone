import { BLOCKS, TILE_SIZE, WORLD_WIDTH, WORLD_HEIGHT, BLOCK_COLORS } from "./config.js";

export class World {
  constructor() {
    this.tiles = this.generateWorld();
    this.entities = [];
  }

  generateWorld() {
    const tiles = Array.from({ length: WORLD_HEIGHT }, () =>
      Array(WORLD_WIDTH).fill(BLOCKS.AIR)
    );

    for (let x = 0; x < WORLD_WIDTH; x++) {
      const terrainHeight = Math.floor(
        26 +
        Math.sin(x * 0.22) * 4 +
        Math.sin(x * 0.08) * 5
      );

      for (let y = 0; y < WORLD_HEIGHT; y++) {
        if (y < terrainHeight) {
          tiles[y][x] = BLOCKS.STONE;
        }
        if (y >= terrainHeight && y < terrainHeight + 5) {
          tiles[y][x] = BLOCKS.DIRT;
        }
        if (y === terrainHeight) {
          tiles[y][x] = BLOCKS.GRASS;
        }
        if (y >= terrainHeight + 5 && y < WORLD_HEIGHT - 4) {
          if (Math.random() < 0.08) tiles[y][x] = BLOCKS.ORE;
        }
      }
    }

    for (let x = 4; x < WORLD_WIDTH - 4; x++) {
      const treeChance = Math.random();
      if (treeChance > 0.98) {
        const treeBase = this.getSurfaceY(x) - 1;
        if (treeBase > 5) {
          const trunkHeight = 4 + Math.floor(Math.random() * 3);
          for (let y = treeBase - trunkHeight; y < treeBase; y++) {
            tiles[y][x] = BLOCKS.WOOD;
          }
          for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -3; dy <= 1; dy++) {
              const tx = x + dx;
              const ty = treeBase - trunkHeight + dy;
              if (Math.abs(dx) + Math.abs(dy) < 6) {
                if (ty >= 0 && ty < WORLD_HEIGHT && tx >= 0 && tx < WORLD_WIDTH) {
                  if (tiles[ty][tx] === BLOCKS.AIR) tiles[ty][tx] = BLOCKS.LEAVES;
                }
              }
            }
          }
        }
      }
    }

    for (let y = WORLD_HEIGHT - 4; y < WORLD_HEIGHT; y++) {
      for (let x = 0; x < WORLD_WIDTH; x++) {
        tiles[y][x] = BLOCKS.WATER;
      }
    }

    for (let x = 0; x < WORLD_WIDTH; x++) {
      tiles[WORLD_HEIGHT - 1][x] = BLOCKS.BEDROCK;
    }

    return tiles;
  }

  getSurfaceY(x) {
    for (let y = 0; y < WORLD_HEIGHT; y++) {
      if (this.tiles[y][x] !== BLOCKS.AIR) return y;
    }
    return WORLD_HEIGHT - 1;
  }

  getTile(x, y) {
    if (x < 0 || x >= WORLD_WIDTH || y < 0 || y >= WORLD_HEIGHT) return BLOCKS.BEDROCK;
    return this.tiles[y][x];
  }

  setTile(x, y, value) {
    if (x < 0 || x >= WORLD_WIDTH || y < 0 || y >= WORLD_HEIGHT) return;
    this.tiles[y][x] = value;
  }

  isSolid(x, y) {
    return this.getTile(x, y) !== BLOCKS.AIR && this.getTile(x, y) !== BLOCKS.WATER;
  }

  worldToTile(x, y) {
    return {
      x: Math.floor(x / TILE_SIZE),
      y: Math.floor(y / TILE_SIZE)
    };
  }

  draw(ctx, cameraX, cameraY, width, height) {
    const startX = Math.max(0, Math.floor(cameraX / TILE_SIZE));
    const endX = Math.min(WORLD_WIDTH, Math.ceil((cameraX + width) / TILE_SIZE) + 1);
    const startY = Math.max(0, Math.floor(cameraY / TILE_SIZE));
    const endY = Math.min(WORLD_HEIGHT, Math.ceil((cameraY + height) / TILE_SIZE) + 1);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const block = this.tiles[y][x];
        if (block === BLOCKS.AIR) continue;

        const screenX = x * TILE_SIZE - cameraX;
        const screenY = y * TILE_SIZE - cameraY;

        ctx.fillStyle = BLOCK_COLORS[block];
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

        if (block === BLOCKS.GRASS) {
          ctx.fillStyle = "#6bd06e";
          ctx.fillRect(screenX, screenY, TILE_SIZE, 6);
        }

        if (block === BLOCKS.WOOD) {
          ctx.fillStyle = "#704a24";
          ctx.fillRect(screenX + 10, screenY, 12, TILE_SIZE);
          ctx.fillStyle = "#5b8d3d";
          ctx.fillRect(screenX - 4, screenY + 4, TILE_SIZE + 8, 10);
        }

        if (block === BLOCKS.WATER) {
          ctx.fillStyle = "rgba(63, 135, 213, 0.62)";
          ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  }
}