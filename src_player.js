import { GRAVITY, MOVE_SPEED, JUMP_SPEED, TILE_SIZE, MAX_HEALTH } from "./src_config.js";

export class Player {
  constructor(x, y, world) {
    this.world = world;
    this.x = x;
    this.y = y;
    this.width = 26;
    this.height = 44;
    this.vx = 0;
    this.vy = 0;
    this.health = MAX_HEALTH;
    this.food = 100;
    this.grounded = false;
    this.facing = 1;
  }

  getRect() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  collidesAt(nextX, nextY) {
    const left = Math.floor(nextX / TILE_SIZE);
    const right = Math.floor((nextX + this.width - 1) / TILE_SIZE);
    const top = Math.floor(nextY / TILE_SIZE);
    const bottom = Math.floor((nextY + this.height - 1) / TILE_SIZE);

    for (let ty = top; ty <= bottom; ty++) {
      for (let tx = left; tx <= right; tx++) {
        if (this.world.isSolid(tx, ty)) return true;
      }
    }
    return false;
  }

  update(keys, dt) {
    const left = keys.has("a") || keys.has("arrowleft");
    const right = keys.has("d") || keys.has("arrowright");
    const jump = keys.has(" ") || keys.has("w") || keys.has("arrowup");

    this.vx = 0;
    if (left) this.vx = -MOVE_SPEED;
    if (right) this.vx = MOVE_SPEED;
    if (this.vx !== 0) this.facing = this.vx > 0 ? 1 : -1;

    const nx = this.x + this.vx * dt;
    if (!this.collidesAt(nx, this.y)) {
      this.x = nx;
    }

    if (jump && this.grounded) {
      this.vy = -JUMP_SPEED;
      this.grounded = false;
    }

    this.vy += GRAVITY * dt;
    const ny = this.y + this.vy * dt;
    if (!this.collidesAt(this.x, ny)) {
      this.y = ny;
      this.grounded = false;
    } else {
      if (this.vy > 0) this.grounded = true;
      this.vy = 0;
    }

    this.x = Math.max(0, Math.min(this.x, 2000));
  }

  draw(ctx, cameraX, cameraY) {
    const px = this.x - cameraX;
    const py = this.y - cameraY;

    ctx.fillStyle = "#1d2a33";
    ctx.fillRect(px, py + 10, this.width, this.height - 10);

    ctx.fillStyle = "#e0a15e";
    ctx.fillRect(px + 4, py, this.width - 8, 12);

    ctx.fillStyle = "#4c7dc8";
    ctx.fillRect(px + 4, py + 12, this.width - 8, 16);

    ctx.fillStyle = "#0f1113";
    ctx.fillRect(px + 3, py + 28, 6, 12);
    ctx.fillRect(px + this.width - 9, py + 28, 6, 12);

    ctx.fillStyle = "#dfe6eb";
    ctx.fillRect(px + (this.facing > 0 ? this.width - 9 : 3), py + 6, 6, 6);
  }
}
