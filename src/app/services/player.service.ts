import { Injectable, inject, signal } from '@angular/core';
import { Player, Pokemon } from '../models';
import { StorageService } from './storage.service';

const KEY = 'player';

/** Starter eggs: one of the first-generation starters (or Pikachu) plus two random Pokemon. */
function starterEggs(): number[] {
  let starter = Math.floor(Math.random() * 4) * 3 + 1;
  if (starter === 10) starter = 25;
  const randomPokemon = () => Math.floor(Math.random() * 143) + 1;
  return [starter, randomPokemon(), randomPokemon()];
}

function newPlayer(): Player {
  return {
    eggs: starterEggs(),
    pokemons: [],
    currentPokemonIdx: 0,
    gender: 'male',
    gold: 0,
    trainerXP: 0,
    trainerLVL: 0,
  };
}

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly storage = inject(StorageService);

  /** The saved player, or a fresh one (with starter eggs) on first launch. */
  readonly player = signal<Player>(this.storage.get<Player>(KEY) ?? newPlayer());

  constructor() {
    this.save();
  }

  /** Hatches one `egg` (a Pokemon id) into `pokemon`. */
  hatchEgg(egg: number, pokemon: Pokemon): void {
    this.update((player) => {
      const eggs = [...player.eggs];
      const index = eggs.indexOf(egg);
      if (index >= 0) eggs.splice(index, 1);
      return { ...player, pokemons: [...player.pokemons, pokemon], eggs };
    });
  }

  /** Throws away all progress and starts over with new starter eggs. */
  reset(): void {
    this.player.set(newPlayer());
    this.save();
  }

  private update(change: (player: Player) => Player): void {
    this.player.update(change);
    this.save();
  }

  private save(): void {
    this.storage.set(KEY, this.player()).catch((err) => console.error('Could not save player', err));
  }
}
