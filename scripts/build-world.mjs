// Regenerates public/assets/world/maps.json: the built-in starter world.
//
//   node scripts/build-world.mjs
//
// Maps are 20x15 tiles. Every tile layer holds a class name like `tile-R2817-C1`, which is
// a cell of the tileset sheet (row/column * 32 + 1 px). Multi-tile art (trees, houses, the
// pond) is "stamped" as a block of consecutive cells.
//
// World layout (x,y):
//   20,20            Starting town: two houses, a Pokemon Center, a pond, a road north.
//   20,20,<name>     Interiors of the buildings (redhouse, bluehouse, center).
//   20,19            Route north of town with tall grass (wild Pokemon).
import { writeFile } from 'node:fs/promises';

const COLS = 20;
const ROWS = 15;

/** Tileset cell (sheet row, sheet column) as a CSS class. */
const cell = (row, col) => `tile-R${row * 32 + 1}-C${col * 32 + 1}`;

const T = {
  grass: cell(88, 0),
  dirt: cell(88, 1),
  tallGrass: cell(87, 5),
  flowers: [cell(74, 2), cell(74, 3), cell(74, 4), cell(74, 5)],
  floor: cell(95, 3),
  wall: cell(95, 4),
};

// Stamps: where the art lives in the sheet, and which cells block the player.
const TREES = [0, 2, 4, 6].map((col) => ({ row: 0, col, h: 2, w: 2 }));
const POND = { row: 120, col: 3, h: 3, w: 3 };
const HOUSES = {
  red: { row: 383, col: 0, h: 4, w: 3, door: [2, 0] },
  blue: { row: 387, col: 0, h: 4, w: 3, door: [2, 0] },
  center: { row: 360, col: 0, h: 4, w: 3, door: [2, 1] },
};

class Grid {
  constructor(coordinates) {
    const [x, y, building = ''] = coordinates.split(',');
    this.map = {
      mapCoordinates: coordinates,
      x: Number(x),
      y: Number(y),
      type: building ? 'inside' : 'outside',
      music: '',
      building,
      encounterRate: 0,
      playerLocation: { x: 0, y: 0, facing: 'down' },
      map: {
        raw: Array.from({ length: COLS * ROWS }, () => ({
          BG: '0', MG: '0', MG2: '0', FG: '0', FG2: '0',
          door: false, path: false, unpassable: false, encounter: false,
        })),
      },
      doors: {},
      paths: {},
      pokemon: { common: [], uncommon: [], rare: [] },
    };
  }

  tile(row, col) {
    return this.map.map.raw[row * COLS + col];
  }

  fill(layer, value) {
    this.map.map.raw.forEach((t) => (t[layer] = value));
  }

  set(row, col, layer, value, flags = {}) {
    Object.assign(this.tile(row, col), { [layer]: value }, flags);
  }

  rect(r0, c0, r1, c1, layer, value, flags) {
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) this.set(r, c, layer, value, flags);
  }

  /** Copies a block of sheet cells onto `layer` with its top-left at (row, col). */
  stamp(layer, row, col, art, { solid = () => true } = {}) {
    for (let dr = 0; dr < art.h; dr++) {
      for (let dc = 0; dc < art.w; dc++) {
        this.set(row + dr, col + dc, layer, cell(art.row + dr, art.col + dc), {
          unpassable: solid(dr, dc),
        });
      }
    }
  }

  tree(row, col, variant) {
    this.stamp('FG', row, col, TREES[variant % TREES.length]);
  }

  /** A house: everything is solid except the bottom (shadow) row and the door itself. */
  house(row, col, art) {
    this.stamp('FG', row, col, art, { solid: (dr) => dr < art.door[0] + 1 });
    const [dr, dc] = art.door;
    this.tile(row + dr, col + dc).unpassable = false;
    this.tile(row + dr, col + dc).door = true;
    return [row + dr, col + dc];
  }

  addDoor(row, col, { mapX, mapY, building = '', playerX, playerY }) {
    this.tile(row, col).door = true;
    this.map.doors[`${col}-${row}`] = { mapSet: 'building', mapX, mapY, building, playerX, playerY };
  }

  /** Walking off this tile toward the map edge loads another map. */
  exit(row, col, { mapX, mapY, playerX, playerY }) {
    this.tile(row, col).path = true;
    this.map.paths[`${col}-${row}`] = { mapSet: 'world', mapX, mapY, playerX, playerY };
  }

  /** A ring of trees around the map, leaving gaps (arrays of [row, col] 2x2 slots to skip). */
  treeBorder(skip = []) {
    const skipped = (r, c) => skip.some(([sr, sc]) => sr === r && sc === c);
    let n = 0;
    for (let r = 0; r < ROWS; r += 2) {
      for (let c = 0; c < COLS; c += 2) {
        const edge = r === 0 || c === 0 || r >= ROWS - 2 || c >= COLS - 2;
        if (!edge || skipped(r, c)) continue;
        // The last row only has one row left (15 rows): shift it up so the stamp fits.
        this.tree(Math.min(r, ROWS - 2), c, n++ * 7 + (r + c) / 2);
      }
    }
  }

  player(row, col, facing = 'down') {
    this.map.playerLocation = { x: col * 32, y: row * 32, facing };
  }
}

// --- Starting town -----------------------------------------------------------------

function town() {
  const g = new Grid('20,20');
  g.fill('BG', T.grass);
  g.map.encounterRate = 0;

  // A few flower patches.
  [[2, 7], [2, 12], [6, 7], [6, 12], [10, 5], [11, 6], [10, 16], [12, 8]].forEach(([r, c], i) =>
    g.set(r, c, 'BG', T.flowers[i % T.flowers.length]),
  );

  // Dirt roads: north-south road, east-west street, and short connectors to each door.
  g.rect(0, 9, 12, 10, 'BG', T.dirt);
  g.rect(8, 3, 8, 16, 'BG', T.dirt);
  g.rect(6, 3, 7, 3, 'BG', T.dirt);
  g.rect(6, 14, 7, 14, 'BG', T.dirt);
  g.rect(12, 10, 12, 14, 'BG', T.dirt);

  // Pond in the bottom-left corner.
  g.stamp('MG', 9, 2, POND);

  // Buildings.
  const red = g.house(3, 3, HOUSES.red);
  const blue = g.house(3, 14, HOUSES.blue);
  const center = g.house(9, 13, HOUSES.center);
  g.addDoor(...red, { mapX: 20, mapY: 20, building: 'redhouse', playerX: 9, playerY: 8 });
  g.addDoor(...blue, { mapX: 20, mapY: 20, building: 'bluehouse', playerX: 9, playerY: 8 });
  g.addDoor(...center, { mapX: 20, mapY: 20, building: 'center', playerX: 9, playerY: 8 });

  // Road to the route on the north edge (those four 2x2 tree slots are left open).
  g.treeBorder([[0, 8], [0, 10]]);
  [9, 10].forEach((c) => g.exit(0, c, { mapX: 20, mapY: 19, playerX: c, playerY: 13 }));

  g.player(9, 9);
  return g;
}

// --- Building interiors ------------------------------------------------------------

function interior(name, exitTo) {
  const g = new Grid(`20,20,${name}`);
  // Room: rows 4-9, cols 6-13. Everything outside the room stays empty and solid.
  g.map.map.raw.forEach((t) => (t.unpassable = true));
  g.rect(5, 7, 8, 12, 'BG', T.floor, { unpassable: false });
  g.rect(4, 6, 4, 13, 'BG', T.wall, { unpassable: true });
  g.rect(5, 6, 8, 6, 'BG', T.wall, { unpassable: true });
  g.rect(5, 13, 8, 13, 'BG', T.wall, { unpassable: true });
  g.rect(9, 6, 9, 13, 'BG', T.wall, { unpassable: true });

  // The (dirt) doormat leads back outside.
  g.set(9, 9, 'BG', T.dirt, { unpassable: false });
  g.addDoor(9, 9, { mapX: 20, mapY: 20, building: '', playerX: exitTo.x, playerY: exitTo.y });
  g.player(8, 9, 'up');
  return g;
}

// --- Route north of town -----------------------------------------------------------

function route() {
  const g = new Grid('20,19');
  g.fill('BG', T.grass);
  g.map.encounterRate = 0.15;
  g.map.pokemon = { common: [16, 19], uncommon: [10, 13], rare: [25] };

  // Path from the town road, bending west then north.
  g.rect(8, 9, 14, 10, 'BG', T.dirt);
  g.rect(7, 4, 8, 10, 'BG', T.dirt);
  g.rect(2, 4, 7, 5, 'BG', T.dirt);

  // Tall grass patches: wild Pokemon live here.
  const patches = [[2, 9, 5, 16], [9, 2, 12, 7], [10, 12, 12, 17]];
  for (const [r0, c0, r1, c1] of patches) {
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        if (g.tile(r, c).BG === T.dirt) continue;
        g.set(r, c, 'MG', T.tallGrass, { encounter: true });
      }
    }
  }

  g.treeBorder([[12, 8], [12, 10], [14, 8], [14, 10]]);
  [9, 10].forEach((c) => g.exit(14, c, { mapX: 20, mapY: 20, playerX: c, playerY: 1 }));
  g.player(13, 9, 'up');
  return g;
}

const maps = [
  town(),
  interior('redhouse', { x: 3, y: 6 }),
  interior('bluehouse', { x: 14, y: 6 }),
  interior('center', { x: 14, y: 12 }),
  route(),
].map((g) => g.map);

await writeFile(new URL('../public/assets/world/maps.json', import.meta.url), JSON.stringify(maps));
console.log(`Wrote ${maps.length} maps: ${maps.map((m) => m.mapCoordinates).join(' | ')}`);
