import { CdkDrag } from '@angular/cdk/drag-drop';
import { Component, input, signal } from '@angular/core';
import { Pokemon } from '../../models';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

// Shared across cards so the most recently dragged one always sits on top.
let topZIndex = 0;

@Component({
  selector: 'app-pokemon-card',
  imports: [CapitalizePipe],
  templateUrl: './pokemon-card.html',
  // Drag the whole card container: cdkDrag positions it with a transform, which would
  // otherwise clobber the flip transform on .cardFlipper.
  hostDirectives: [{ directive: CdkDrag, outputs: ['cdkDragStarted'] }],
  host: {
    class: 'pokemonCardContainer',
    style: 'position: relative; display: block',
    '[style.z-index]': 'zIndex()',
    '(cdkDragStarted)': 'bringToFront()',
  },
})
export class PokemonCard {
  readonly pokemon = input.required<Pokemon>();
  protected readonly flipped = signal(false);
  protected readonly zIndex = signal(0);

  protected bringToFront(): void {
    this.zIndex.set(++topZIndex);
  }
}
