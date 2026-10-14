import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Battle } from '../../components/battle/battle';
import { Facing, PokeMap, Pokemon, Rarity, Tile } from '../../models';
import { MAP_COLUMNS, MAP_ROWS, MapService, TILE_SIZE } from '../../services/map.service';
import { PlayerService } from '../../services/player.service';
import { PokemonService } from '../../services/pokemon.service';

/** Pixels the player moves per frame. Must divide TILE_SIZE evenly. */
const STEP = 4;
const START_MAP = '20,20';
const BATTLE_MUSIC = '/assets/music/music/Battle(wild).mp3';
const RARITIES: Rarity[] = ['common', 'uncommon', 'rare'];

type Surroundings = Pick<Tile, 'unpassable'> & Partial<Tile>;

const WALL: Surroundings = { BG: '0', MG: '0', MG2: '0', FG: '0', FG2: '0', unpassable: true };

interface PlayerState {
  x: number | undefined;
  y: number | undefined;
  movingX: 'left' | 'right' | false;
  movingY: 'up' | 'down' | false;
  lastDirX: 'left' | 'right';
  lastDirY: 'up' | 'down';
  lastDir: Facing;
  coordinates: string;
}

@Component({
  selector: 'app-world',
  imports: [Battle],
  templateUrl: './world.html',
})
export class World implements AfterViewInit {
  private readonly playerService = inject(PlayerService);
  private readonly mapService = inject(MapService);
  private readonly pokemonService = inject(PokemonService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly gameWindow = viewChild.required<ElementRef<HTMLElement>>('gameWindow');
  private readonly playerEl = viewChild.required<ElementRef<HTMLElement>>('player');
  private readonly battle = viewChild.required(Battle);

  protected readonly rawMap = signal<Tile[]>([]);
  protected readonly battleVisible = signal(false);

  // --- engine state (mutated every frame, so deliberately not signals) ---
  private currentMap?: PokeMap;
  private mapCoordinates = START_MAP;
  private changingMap = false;
  private battleTriggered = false;
  private probed = true;
  private animationId = 0;
  private destroyed = false;
  private readonly player: PlayerState = {
    x: undefined,
    y: undefined,
    movingX: false,
    movingY: false,
    lastDirX: 'right',
    lastDirY: 'down',
    lastDir: 'down',
    coordinates: '',
  };
  private surroundings: Surroundings[][] = [
    [WALL, WALL, WALL],
    [WALL, WALL, WALL],
    [WALL, WALL, WALL],
  ];
  /** Next wild Pokemon per rarity, prefetched so encounters start instantly. */
  private readonly upcoming: Partial<Record<Rarity, Pokemon>> = {};
  private lastAnimation = '';

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      cancelAnimationFrame(this.animationId);
    });
  }

  ngAfterViewInit(): void {
    this.gameWindow().nativeElement.focus();
    this.loadMap();
  }

  // --- input ---

  protected buttonPress(button: string): void {
    console.log(button);
  }

  protected keyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.player.movingX = 'left';
        break;
      case 'ArrowRight':
        this.player.movingX = 'right';
        break;
      case 'ArrowUp':
        this.player.movingY = 'up';
        break;
      case 'ArrowDown':
        this.player.movingY = 'down';
        break;
    }
  }

  protected keyUp(event: KeyboardEvent): void {
    const p = this.player;
    switch (event.key) {
      case 'ArrowLeft':
        p.movingX = false;
        p.lastDirX = p.lastDir = 'left';
        break;
      case 'ArrowRight':
        p.movingX = false;
        p.lastDirX = p.lastDir = 'right';
        break;
      case 'ArrowUp':
        p.movingY = false;
        p.lastDirY = p.lastDir = 'up';
        break;
      case 'ArrowDown':
        p.movingY = false;
        p.lastDirY = p.lastDir = 'down';
        break;
    }
  }

  // Stop the page scrolling on space/arrows, and the context menu popping up mid-game.
  @HostListener('window:keydown', ['$event'])
  protected suppressScrollKeys(event: KeyboardEvent): void {
    if ([' ', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  protected suppressContextMenu(event: Event): void {
    event.preventDefault();
  }

  @HostListener('touchmove', ['$event'])
  protected suppressTouchScroll(event: TouchEvent): void {
    event.preventDefault();
  }

  // --- maps ---

  /** Loads `mapCoordinates`; `portal` (a door or path taken) says where the player lands. */
  private loadMap(portal?: { playerX: number | string; playerY: number | string }): void {
    const map = this.mapService.fetchMap(this.mapCoordinates);

    this.currentMap = map;
    this.rawMap.set(map.map.raw);
    this.player.x ??= map.playerLocation.x;
    this.player.y ??= map.playerLocation.y;
    this.probeSurroundings();

    if (!this.animationId) {
      this.displayPlayer();
      this.startAnimating();
    }
    if (portal) {
      this.player.x = parseInt(String(portal.playerX), 10) * TILE_SIZE;
      this.player.y = parseInt(String(portal.playerY), 10) * TILE_SIZE;
      this.probeSurroundings();
      this.changingMap = false;
    }

    for (const rarity of RARITIES) {
      this.prefetchPokemon(rarity);
    }
  }

  private prefetchPokemon(rarity: Rarity): void {
    const candidates = this.currentMap?.pokemon?.[rarity] ?? [];
    if (candidates.length === 0) {
      delete this.upcoming[rarity];
      return;
    }
    const id = candidates[Math.floor(Math.random() * candidates.length)];
    this.pokemonService
      .getNewPokemon(id)
      .then((pokemon) => (this.upcoming[rarity] = pokemon))
      .catch((err) => console.error(`Could not load ${rarity} pokemon ${id}`, err));
  }

  private probeSurroundings(): void {
    const px = (this.player.x ?? 0) / TILE_SIZE;
    const py = (this.player.y ?? 0) / TILE_SIZE;
    this.player.coordinates = `${px}-${py}`;

    this.surroundings = [-1, 0, 1].map((dy) =>
      [-1, 0, 1].map((dx) => {
        const mapX = px + dx;
        const mapY = py + dy;
        if (mapX < 0 || mapX >= MAP_COLUMNS || mapY < 0 || mapY >= MAP_ROWS) {
          return WALL;
        }
        return this.currentMap?.map.compiled[mapY]?.[mapX] ?? WALL;
      }),
    );
    this.probed = true;
  }

  private takePortal(kind: 'doors' | 'paths'): void {
    const portal = this.currentMap?.[kind][this.player.coordinates];
    if (!portal) return;
    const building = kind === 'doors' && portal.building ? `,${portal.building}` : '';
    this.mapCoordinates = `${portal.mapX},${portal.mapY}${building}`;
    this.changingMap = true;
    this.loadMap(portal);
  }

  // --- encounters ---

  private tryEncounter(): void {
    if (Math.random() >= (this.currentMap?.encounterRate ?? 0)) return;

    const roll = Math.floor(Math.random() * 100);
    const rarity: Rarity = roll < 70 ? 'common' : roll < 95 ? 'uncommon' : 'rare';
    const enemy = this.upcoming[rarity];
    const ally = this.playerService.player().pokemons[0];
    if (!enemy || !ally) return; // nothing loaded (yet) for this rarity, or nobody to fight with
    this.prefetchPokemon(rarity);

    console.log(`Encounter ${enemy.name}`);
    this.battleTriggered = true;
    new Audio(BATTLE_MUSIC).play().catch(() => undefined);
    this.stopPlayer();
    this.battleVisible.set(true);
    this.battle().start(ally, enemy);
  }

  // --- game loop ---

  private startAnimating(): void {
    const frame = (): void => {
      if (this.destroyed) return;
      this.animationId = requestAnimationFrame(frame);
      this.movePlayer();
      this.displayPlayer();
    };
    this.animationId = requestAnimationFrame(frame);
  }

  private stopPlayer(): void {
    this.player.movingX = false;
    this.player.movingY = false;
  }

  private setAnimation(animation: string): void {
    if (animation === this.lastAnimation) return;
    this.lastAnimation = animation;
    this.playerEl().nativeElement.style.animation = animation;
  }

  // The player sprite moves every frame, so write to the DOM directly instead of
  // triggering change detection 60 times a second.
  private displayPlayer(): void {
    const style = this.playerEl().nativeElement.style;
    style.left = `${this.player.x ?? 0}px`;
    style.top = `${this.player.y ?? 0}px`;
  }

  private movePlayer(): void {
    const p = this.player;
    if (this.changingMap || this.battleTriggered || p.x === undefined || p.y === undefined) return;
    const [up, , down] = [this.surroundings[0][1], this.surroundings[1][1], this.surroundings[2][1]];
    const left = this.surroundings[1][0];
    const right = this.surroundings[1][2];
    const here = this.surroundings[1][1];

    // Only start a step when aligned to the grid on the other axis.
    if (p.movingX && !p.movingY && p.y % TILE_SIZE === 0) {
      if (p.movingX === 'left' && !left.unpassable) {
        p.x -= STEP;
        this.setAnimation('walk-left 0.4s steps(3) infinite');
        this.probed = false;
      } else if (p.movingX === 'right' && !right.unpassable) {
        p.x += STEP;
        this.setAnimation('walk-right 0.4s steps(3) infinite');
        this.probed = false;
      }
    }
    if (p.movingY && !p.movingX && p.x % TILE_SIZE === 0) {
      if (p.movingY === 'up' && !up.unpassable) {
        p.y -= STEP;
        this.setAnimation('walk-up 0.4s steps(3) infinite');
        this.probed = false;
      } else if (p.movingY === 'down' && !down.unpassable) {
        p.y += STEP;
        this.setAnimation('walk-down 0.4s steps(3) infinite');
        this.probed = false;
      }
    }

    // Finish the current tile after the key is released.
    if (!p.movingX && p.x % TILE_SIZE !== 0) {
      p.x += p.lastDirX === 'left' ? -STEP : STEP;
    }
    if (!p.movingY && p.y % TILE_SIZE !== 0) {
      p.y += p.lastDirY === 'up' ? -STEP : STEP;
    }

    if (!p.movingX && !p.movingY && p.x % TILE_SIZE === 0 && p.y % TILE_SIZE === 0) {
      this.setAnimation(`stand-${p.lastDir} 2.0s steps(1) infinite`);
    }

    if (p.x % TILE_SIZE === 0 && p.y % TILE_SIZE === 0 && !this.probed) {
      this.probeSurroundings();
      if (this.surroundings[1][1].door) {
        this.takePortal('doors');
      }
      if (this.surroundings[1][1].encounter) {
        this.tryEncounter();
      }
    }

    // Walking off the edge of a map along a path loads the neighbouring map.
    if (here.path && !this.changingMap) {
      const leavingMap =
        (up.BG === '0' && p.movingY === 'up') ||
        (down.BG === '0' && p.movingY === 'down') ||
        (left.BG === '0' && p.movingX === 'left') ||
        (right.BG === '0' && p.movingX === 'right');
      if (leavingMap) {
        this.takePortal('paths');
      }
    }
  }
}
