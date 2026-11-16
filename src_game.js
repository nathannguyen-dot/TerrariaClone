import { HOTBAR, BLOCK_NAME, MAX_HEALTH, TILE_SIZE } from "./config.js";
import { World } from "./world.js";
import { Player } from "./player.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const world = new World();
const player = new Player(180, 150, world);

const keys = new Set();
const mouse = { x: 0, y: 0, left: false, right: false };

let selectedSlot = 0;
let timeOfDay = 0;
let lastTime = 0;
let cameraX = 0;
let cameraY = 0;
let actionCooldown = 0;

const hudStats = document.getElementById("stats");

function updateCamera() {
  cameraX = Math.max(0, player.x - canvas.width / 2 + player.width / 2);
  cameraY = Math.max(0, player.y - canvas.height / 2 + player.height / 2);
}

function pointerToWorld(event) {
  const rect = canvas.getBoundingClientRect();
  const px = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const py = ((event.clientY - rect.top) / rect.height) * canvas.height;
  return {
    x: px + cameraX,
    y: py + cameraY
  };
}

function placeBlockAt(tileX, tileY, block) {
  if (tileX < 0 || tileX >= 220 || tileY < 0 || tileY >= 70) return;
  if (world.getTile(tileX, tileY) !== 0) return;

  const px = player.x + player.width / 2;
  const py = player.y + player.height / 2;
  const bx = tileX * TILE_SIZE + TILE_SIZE / 2;
  const by = tileY * TILE_SIZE + TILE_SIZE / 2;

  if (Math.hypot(px - bx, py - by) < 90) return;

  world.setTile(tileX, tileY, block);
}

function mineBlockAt(tileX, tileY) {
  if (tileX < 0 || tileX >= 220 || tileY < 0 || tileY >= 70) return;
  const block = world.getTile(tileX, tileY);
  if (block === 0 || block === 9) return;

  const px = player.x + player.width / 2;
  const py = player.y + player.height / 2;
  const bx = tileX * TILE_SIZE + TILE_SIZE / 2;
  const by = tileY * TILE_SIZE + TILE_SIZE / 2;

  if (Math.hypot(px - bx, py - by) < 90) return;

  world.setTile(tileX, tileY, 0);
}

function handleInteractions() {
  if (actionCooldown > 0) return;
  if (!mouse.left && !mouse.right) return;

  const tileX = Math.floor((mouse.x + cameraX) / TILE_SIZE);
  const tileY = Math.floor((mouse.y + cameraY) / TILE_SIZE);

  if (mouse.left) {
    mineBlockAt(tileX, tileY);
    actionCooldown = 0.12;
  }

  if (mouse.right) {
    const block = HOTBAR[selectedSlot];
    placeBlockAt(tileX, tileY, block);
    actionCooldown = 0.12;
  }
}

function updateHud() {
  const dayNames = ["Dawn", "Day", "Dusk", "Night"];
  const timeLabel = dayNames[Math.floor(timeOfDay / 6) % dayNames.length];
  hudStats.textContent = `Health: ${player.health} | Food: ${player.food} | Time: ${timeLabel}`;
}

function update(dt) {
  timeOfDay += dt * 8;
  player.update(keys, dt);
  updateCamera();
  handleInteractions();
  actionCooldown = Math.max(0, actionCooldown - dt);
  updateHud();
}

function drawSky() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  const cycle = (Math.sin(timeOfDay * 0.8) + 1) / 2;
  gradient.addColorStop(0, `rgba(${Math.floor(80 + cycle * 90)}, ${Math.floor(150 + cycle * 60)}, ${Math.floor(210 + cycle * 30)}, 1)`);
  gradient.addColorStop(1, `rgba(${Math.floor(150 + cycle * 60)}, ${Math.floor(210 + cycle * 40)}, ${Math.floor(140 + cycle * 50)}, 1)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSelection() {
  const tileX = Math.floor((mouse.x + cameraX) / TILE_SIZE);
  const tileY = Math.floor((mouse.y + cameraY) / TILE_SIZE);

  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 2;
  ctx.strokeRect(tileX * TILE_SIZE - cameraX, tileY * TILE_SIZE - cameraY, TILE_SIZE, TILE_SIZE);
}

function drawHotbar() {
  const barY = canvas.height - 60;
  const slotSize = 42;
  const gap = 8;
  const startX = (canvas.width - (HOTBAR.length * slotSize + (HOTBAR.length - 1) * gap)) / 2;

  HOTBAR.forEach((block, index) => {
    const x = startX + index * (slotSize + gap);
    const selected = index === selectedSlot;

    ctx.fillStyle = selected ? "#ffe3a3" : "#1d2629";
    ctx.fillRect(x, barY, slotSize, slotSize);

    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.strokeRect(x, barY, slotSize, slotSize);

    const color = {
      1: "#59b95f",
      2: "#8a5a38",
      3: "#7a7f89",
      4: "#d8c57f",
      5: "#8a5f3b"
    }[block] || "#fff";

    ctx.fillStyle = color;
    ctx.fillRect(x + 9, barY + 8, 24, 24);

    ctx.fillStyle = "#fff";
    ctx.font = "12px sans-serif";
    ctx.fillText(String(index + 1), x + 4, barY + 14);
  });
}

function render() {
  drawSky();
  world.draw(ctx, cameraX, cameraY, canvas.width, canvas.height);
  player.draw(ctx, cameraX, cameraY);
  drawSelection();
  drawHotbar();
}

function gameLoop(ts) {
  const dt = Math.min((ts - lastTime) / 1000 || 0.016, 0.033);
  lastTime = ts;

  update(dt);
  render();

  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  keys.add(key);

  if (key >= "1" && key <= "5") {
    selectedSlot = Number(key) - 1;
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  mouse.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
});

canvas.addEventListener("mousedown", (event) => {
  if (event.button === 0) mouse.left = true;
  if (event.button === 2) mouse.right = true;
});

window.addEventListener("mouseup", (event) => {
  if (event.button === 0) mouse.left = false;
  if (event.button === 2) mouse.right = false;
});

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

requestAnimationFrame(gameLoop);