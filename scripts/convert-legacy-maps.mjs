// One-off: converts the prototype-era public/assets/maps/maps.json (a `var maps = [[{...}]]`
// script, tiles as [a, b, c, "P"] arrays) into the built-in world format.
//
// What carries over: player start, music, encounter rate and the wild Pokemon lists.
// What doesn't: tiles (the old numeric tile ids don't exist in the current tileset, and the
// file only held one placeholder tile) and doors/paths (keyed by pixel position and pointing
// at a map-set layout that no longer exists). The result is a blank, editable map.
//
//   node scripts/convert-legacy-maps.mjs
import { readFile, writeFile } from 'node:fs/promises';

const input = new URL('../public/assets/maps/maps.json', import.meta.url);
const output = new URL('../public/assets/world/maps.json', import.meta.url);
const START = { x: 20, y: 20 }; // where the game begins; the legacy grid is laid out from here

const legacy = new Function(`${await readFile(input, 'utf8')}; return maps;`)();

const blankTile = () => ({
  BG: '0', MG: '0', MG2: '0', FG: '0', FG2: '0',
  door: false, path: false, unpassable: false, encounter: false,
});

const maps = legacy.flatMap((row, i) =>
  row.map((old, j) => ({
    mapCoordinates: `${START.x + j},${START.y + i}`,
    x: START.x + j,
    y: START.y + i,
    type: old.type ?? 'outside',
    music: old.music ?? '',
    building: '',
    encounterRate: old.encounterRate ?? 0.1,
    playerLocation: old.playerLocation,
    map: { raw: Array.from({ length: 20 * 15 }, blankTile) },
    doors: {},
    paths: {},
    pokemon: {
      common: old.commonPokemon ?? [],
      uncommon: old.uncommonPokemon ?? [],
      rare: old.rarePokemon ?? [],
    },
  })),
);

await writeFile(output, JSON.stringify(maps));
console.log(`Converted ${maps.length} map(s) to public/assets/world/maps.json`);
