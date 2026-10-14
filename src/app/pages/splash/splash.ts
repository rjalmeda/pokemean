import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonCard } from '../../components/pokemon-card/pokemon-card';
import { Pokemon } from '../../models';
import { PlayerService } from '../../services/player.service';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-splash',
  imports: [PokemonCard, RouterLink],
  templateUrl: './splash.html',
})
export class Splash {
  private readonly playerService = inject(PlayerService);
  private readonly pokemonService = inject(PokemonService);

  protected readonly newPokemons = signal<Pokemon[]>([]);
  protected readonly loadingComplete = signal(false);
  protected readonly error = signal('');

  constructor() {
    void this.hatchEggs();
  }

  private async hatchEggs(): Promise<void> {
    const eggs = [...this.playerService.player().eggs];
    // Roll every Pokemon in parallel, but hatch them in order so cards appear steadily.
    const hatching = eggs.map((egg) => this.pokemonService.getNewPokemon(egg));
    try {
      for (const [i, egg] of eggs.entries()) {
        const pokemon = await hatching[i];
        this.newPokemons.update((list) => [...list, pokemon]);
        this.playerService.hatchEgg(egg, pokemon);
      }
      this.loadingComplete.set(true);
    } catch (err) {
      console.error(err);
      this.error.set('Could not reach PokeAPI. Check your connection and reload to hatch the rest.');
    }
  }

  // Keep touch drags on the cards from scrolling the page.
  @HostListener('touchmove', ['$event'])
  protected preventScroll(event: TouchEvent): void {
    event.preventDefault();
  }
}
