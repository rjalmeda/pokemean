import { PokemonType } from './type-chart';

export interface PokeText {
  name: string;
  text: string;
}

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  moves: PokeText[];
  abilities: PokeText[];
  hp: number;
  currentHP: number;
  atk: number;
  def: number;
  spd: number;
  spcAtk: number;
  spcDef: number;
  lvl: number;
  xp: number;
  ogg: string;
  mp3: string;
}

/** Everything the player owns. Persisted to IndexedDB by PlayerService. */
export interface Player {
  eggs: number[];
  pokemons: Pokemon[];
  currentPokemonIdx: number;
  gender: string;
  gold: number;
  trainerXP: number;
  trainerLVL: number;
}

export interface TileLayers {
  BG: string;
  MG: string;
  MG2: string;
  FG: string;
  FG2: string;
}

export interface Tile extends TileLayers {
  door: boolean;
  path: boolean;
  unpassable: boolean;
  encounter: boolean;
}

export type Facing = 'up' | 'down' | 'left' | 'right';

/** A door or path: where it leads and where the player lands on arrival. */
export interface Portal {
  mapX: number | string;
  mapY: number | string;
  building?: string;
  playerX: number | string;
  playerY: number | string;
  mapSet?: string;
}

export interface NamedPortal extends Partial<Portal> {
  /** Tile coordinate key, e.g. "3-7". */
  name: string;
}

export type Rarity = 'common' | 'uncommon' | 'rare';

export interface PokeMap {
  _id?: string;
  name?: string;
  mapCoordinates: string;
  x: number;
  y: number;
  type: string;
  music: string;
  building: string;
  encounterRate: number;
  playerLocation: { x: number; y: number; facing: Facing };
  map: { raw: Tile[]; compiled: Tile[][] };
  doors: Record<string, Portal>;
  paths: Record<string, Portal>;
  pokemon: Record<Rarity, number[]>;
}
