import { Injectable } from '@angular/core';
import { PokeText, Pokemon } from '../models';
import { PokemonType } from '../type-chart';

const POKE_API = 'https://pokeapi.co/api/v2';

interface Named {
  name: string;
  url: string;
}

interface PokeApiPokemon {
  id: number;
  name: string;
  moves: { move: Named }[];
  abilities: { ability: Named }[];
  types: { type: { name: PokemonType } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

interface PokeApiText {
  name: string;
  flavor_text_entries?: { flavor_text: string; language: { name: string } }[];
}

function pickRandom<T>(list: T[], count: number): T[] {
  const pool = [...list];
  const picked: T[] = [];
  while (picked.length < count && pool.length > 0) {
    picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return picked;
}

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly requests = new Map<string, Promise<unknown>>();

  /** Rolls a level 1 Pokemon with random moves and ability from PokeAPI. */
  async getNewPokemon(pokeId: number): Promise<Pokemon> {
    const data = await this.get<PokeApiPokemon>(`${POKE_API}/pokemon/${pokeId}/`);
    const stat = (name: string) => data.stats.find((s) => s.stat.name === name)?.base_stat ?? 0;

    const [moves, abilities] = await Promise.all([
      Promise.all(pickRandom(data.moves, 2).map((m) => this.getText(m.move.url))),
      Promise.all(pickRandom(data.abilities, 1).map((a) => this.getText(a.ability.url))),
    ]);

    return {
      id: data.id,
      name: data.name.toUpperCase(),
      moves,
      abilities,
      types: data.types.map((t) => t.type.name),
      hp: stat('hp'),
      currentHP: stat('hp'),
      spd: stat('speed'),
      def: stat('defense'),
      atk: stat('attack'),
      spcAtk: stat('special-attack'),
      spcDef: stat('special-defense'),
      lvl: 1,
      xp: 0,
      ogg: `/assets/sounds/${data.id}.ogg`,
      mp3: `/assets/sounds/${data.id}.mp3`,
    };
  }

  private async getText(url: string): Promise<PokeText> {
    const data = await this.get<PokeApiText>(url);
    const text = data.flavor_text_entries?.find((e) => e.language.name === 'en')?.flavor_text ?? '';
    return { name: data.name, text };
  }

  /** GET with an in-memory cache, so repeated moves and abilities cost one request. */
  private get<T>(url: string): Promise<T> {
    let request = this.requests.get(url);
    if (!request) {
      request = fetch(url).then((res) => {
        if (!res.ok) throw new Error(`PokeAPI responded ${res.status} for ${url}`);
        return res.json();
      });
      request.catch(() => this.requests.delete(url));
      this.requests.set(url, request);
    }
    return request as Promise<T>;
  }
}
