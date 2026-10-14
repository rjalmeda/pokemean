import { Injectable, inject } from '@angular/core';
import { PokeMap, Tile } from '../models';
import { StorageService } from './storage.service';

export const MAP_COLUMNS = 20;
export const MAP_ROWS = 15;
export const TILE_SIZE = 32;

export function emptyTile(): Tile {
  return {
    BG: '0',
    MG: '0',
    MG2: '0',
    FG: '0',
    FG2: '0',
    door: false,
    path: false,
    unpassable: false,
    encounter: false,
  };
}

/** Reshapes the flat tile list into rows of tiles, as the game reads it. */
export function compileTiles(raw: Tile[]): Tile[][] {
  return Array.from({ length: MAP_ROWS }, (_, row) => raw.slice(row * MAP_COLUMNS, (row + 1) * MAP_COLUMNS));
}

/** Builds a blank map for the given "x,y[,building]" coordinates. */
export function newPokeMap(mapCoordinates: string): PokeMap {
  const [x, y, building] = mapCoordinates.split(',');
  const raw = Array.from({ length: MAP_ROWS * MAP_COLUMNS }, emptyTile);
  return {
    mapCoordinates,
    x: parseInt(x, 10),
    y: parseInt(y, 10),
    building: building ?? '',
    music: '',
    type: 'outside',
    encounterRate: 0.1,
    playerLocation: { x: 5 * TILE_SIZE, y: 5 * TILE_SIZE, facing: 'down' },
    map: { raw, compiled: compileTiles(raw) },
    doors: {},
    paths: {},
    pokemon: { common: [], uncommon: [], rare: [] },
  };
}

const PREFIX = 'map:';
const WORLD_URL = '/assets/world/maps.json';

/**
 * Maps come from two places: the built-in world shipped with the app (read-only), and
 * the player's own maps in IndexedDB. A saved map with the same coordinates as a
 * built-in one overrides it; deleting it reverts to the built-in map.
 */
@Injectable({ providedIn: 'root' })
export class MapService {
  private readonly storage = inject(StorageService);
  private readonly world = new Map<string, PokeMap>();

  /** Loads the built-in world. Missing or malformed data just means an empty world. */
  async loadWorld(): Promise<void> {
    try {
      const response = await fetch(WORLD_URL);
      const maps: unknown = await response.json();
      if (!Array.isArray(maps)) return;
      for (const map of maps as PokeMap[]) {
        if (isMap(map)) this.world.set(map.mapCoordinates, map);
      }
    } catch {
      console.warn('No built-in world found at', WORLD_URL);
    }
  }

  /** The player's map, else the built-in one, else a blank map at these coordinates. */
  fetchMap(mapCoordinates: string): PokeMap {
    const saved = this.storage.get<PokeMap>(PREFIX + mapCoordinates) ?? this.world.get(mapCoordinates);
    return saved ? hydrate(structuredClone(saved)) : newPokeMap(mapCoordinates);
  }

  hasBuiltIn(mapCoordinates: string): boolean {
    return this.world.has(mapCoordinates);
  }

  /** Saves the player's version of a map. Rejects if it can't be stored. */
  async saveMap(pokeMap: PokeMap): Promise<PokeMap> {
    // `compiled` is derived from `raw`, so only `raw` is stored.
    const stored = { ...pokeMap, map: { raw: pokeMap.map.raw } } as PokeMap;
    await this.storage.set(PREFIX + pokeMap.mapCoordinates, stored);
    return hydrate(structuredClone(stored));
  }

  /** Deletes the player's version of a map (a built-in map of that name reappears). */
  deleteMap(mapCoordinates: string): Promise<void> {
    return this.storage.remove(PREFIX + mapCoordinates);
  }

  /** The player's own maps, for backup. */
  exportMaps(): PokeMap[] {
    return this.storage
      .keys(PREFIX)
      .map((key) => this.storage.get<PokeMap>(key))
      .filter((map): map is PokeMap => !!map)
      .map(hydrate);
  }

  /** Saves every valid map in `maps`; returns how many were imported. */
  async importMaps(maps: unknown): Promise<number> {
    if (!Array.isArray(maps)) throw new Error('Expected a list of maps');
    let imported = 0;
    for (const map of maps as PokeMap[]) {
      if (isMap(map)) {
        await this.saveMap(map);
        imported++;
      }
    }
    return imported;
  }
}

function isMap(map: PokeMap | undefined): map is PokeMap {
  return typeof map?.mapCoordinates === 'string' && Array.isArray(map.map?.raw);
}

function hydrate(map: PokeMap): PokeMap {
  return {
    ...map,
    map: { raw: map.map.raw, compiled: compileTiles(map.map.raw) },
    doors: map.doors ?? {},
    paths: map.paths ?? {},
    pokemon: {
      common: map.pokemon?.common ?? [],
      uncommon: map.pokemon?.uncommon ?? [],
      rare: map.pokemon?.rare ?? [],
    },
  };
}
