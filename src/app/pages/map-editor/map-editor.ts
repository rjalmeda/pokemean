import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Facing, NamedPortal, PokeMap, Rarity, Tile, TileLayers } from '../../models';
import { MAP_COLUMNS, MAP_ROWS, MapService, compileTiles, newPokeMap } from '../../services/map.service';

type Layer = keyof TileLayers;
/** What a click on the map paints: a tile class, or one of the marker tools. */
type Brush = string | 'U' | 'D' | 'P' | 'E' | 'PL';

const LAYERS: Layer[] = ['BG', 'MG', 'MG2', 'FG', 'FG2'];
const RARITIES: Rarity[] = ['common', 'uncommon', 'rare'];
const MAX_POKEMON_ID = 721;

// The tileset sheet is 258x20834 px, cut into 32px cells with a 1px gutter.
const SHEET = { width: 258, height: 20834, cell: 32 };

function buildTileSet(): { columns: number; classes: string[] } {
  const columns = Math.floor(SHEET.width / SHEET.cell);
  const rows = Math.floor(SHEET.height / SHEET.cell);
  const classes: string[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      classes.push(`tile-R${row * SHEET.cell + 1}-C${col * SHEET.cell + 1}`);
    }
  }
  return { columns, classes };
}

function cloneTiles(tiles: Tile[]): Tile[] {
  return tiles.map((tile) => ({ ...tile }));
}

@Component({
  selector: 'app-map-editor',
  imports: [FormsModule],
  templateUrl: './map-editor.html',
})
export class MapEditor {
  private readonly mapService = inject(MapService);

  protected readonly tileSet = buildTileSet();
  protected readonly columnHeaders = Array.from({ length: MAP_COLUMNS }, (_, i) => i);
  protected readonly rowHeaders = Array.from({ length: MAP_ROWS }, (_, i) => i);
  protected readonly rarities = RARITIES;
  protected readonly playerFacingValues: Facing[] = ['up', 'down', 'left', 'right'];

  // Which map is being edited.
  protected readonly mapX = signal<number | null>(20);
  protected readonly mapY = signal<number | null>(20);
  protected readonly buildingName = signal('');

  protected readonly currentMap = signal<PokeMap>(newPokeMap('20,20'));
  protected readonly rawMap = computed(() => this.currentMap().map.raw);

  protected readonly doors = signal<NamedPortal[]>([]);
  protected readonly paths = signal<NamedPortal[]>([]);
  protected readonly catchable = signal<Record<Rarity, string>>({ common: '', uncommon: '', rare: '' });

  protected readonly brush = signal<Brush>('');
  protected readonly layer = signal<Layer>('FG');
  protected readonly tileBorder = signal(true);
  protected readonly confirmMapDelete = signal(false);
  protected readonly message = signal('');

  private history: Tile[][] = [];
  private redoHistory: Tile[][] = [];

  constructor() {
    this.fetchMap();
  }

  // --- loading / saving ---

  protected fetchMap(): void {
    const x = this.mapX();
    const y = this.mapY();
    if (x === null || y === null) return;

    const building = this.buildingName();
    const coordinates = building ? `${x},${y},${building}` : `${x},${y}`;
    const map = this.mapService.fetchMap(coordinates);

    this.currentMap.set(map);
    this.checkPathsDoors();
    this.unpackCatchablePokemon();
    this.history = [];
    this.redoHistory = [];
  }

  protected saveMap(): void {
    const current = this.currentMap();
    const { doors, paths } = this.processPortals();
    void this.attempt(async () => {
      const saved = await this.mapService.saveMap({ ...current, doors, paths });
      this.currentMap.set(saved);
      this.checkPathsDoors();
      this.message.set(`Saved map ${saved.mapCoordinates}`);
    });
  }

  /** Deletes your version of the map; if there is a built-in one, that is what comes back. */
  protected deleteMap(): void {
    const coordinates = this.currentMap().mapCoordinates;
    void this.attempt(async () => {
      await this.mapService.deleteMap(coordinates);
      this.confirmMapDelete.set(false);
      this.fetchMap();
      this.message.set(
        this.mapService.hasBuiltIn(coordinates) ? 'Reverted to the built-in map' : 'Deleted map',
      );
    });
  }

  protected exportMaps(): void {
    const maps = this.mapService.exportMaps();
    const url = URL.createObjectURL(new Blob([JSON.stringify(maps)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pokemean-maps.json';
    link.click();
    URL.revokeObjectURL(url);
    this.message.set(`Exported ${maps.length} maps`);
  }

  protected importMaps(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    void this.attempt(async () => {
      const count = await this.mapService.importMaps(JSON.parse(await file.text()));
      this.fetchMap();
      this.message.set(`Imported ${count} maps`);
    });
  }

  /** Runs a storage action, reporting failures (invalid JSON, full storage) in the UI. */
  private async attempt(action: () => Promise<void>): Promise<void> {
    try {
      await action();
    } catch (err) {
      this.message.set(`Failed: ${err instanceof Error ? err.message : err}`);
    }
  }

  // --- painting ---

  protected copyTile(tile: Brush): void {
    this.brush.set(tile);
  }

  protected cycleLayer(): void {
    const next = LAYERS[(LAYERS.indexOf(this.layer()) + 1) % LAYERS.length];
    this.layer.set(next);
  }

  protected pasteTile(idx: number): void {
    this.backupMap();
    const tile = this.rawMap()[idx];
    const brush = this.brush();

    switch (brush) {
      case 'U':
        tile.unpassable = !tile.unpassable;
        break;
      case 'D':
        tile.door = !tile.door;
        break;
      case 'P':
        tile.path = !tile.path;
        break;
      case 'E':
        tile.encounter = !tile.encounter;
        break;
      case 'PL':
        this.currentMap.update((map) => ({
          ...map,
          playerLocation: {
            ...map.playerLocation,
            x: (idx % MAP_COLUMNS) * 32,
            y: Math.floor(idx / MAP_COLUMNS) * 32,
          },
        }));
        break;
      default:
        tile[this.layer()] = brush;
    }
    this.redoHistory = [];
    this.checkPathsDoors();
  }

  protected bucketMap(): void {
    this.backupMap();
    this.redoHistory = [];
    const brush = this.brush();
    const raw = this.rawMap();
    if (brush === 'P') raw.forEach((tile) => (tile.path = true));
    else if (brush === 'U') raw.forEach((tile) => (tile.unpassable = true));
    else if (!['D', 'E', 'PL'].includes(brush)) raw.forEach((tile) => (tile[this.layer()] = brush));
  }

  protected toggleTileBorders(): void {
    this.tileBorder.update((on) => !on);
  }

  // --- undo / redo ---

  private setRaw(tiles: Tile[]): void {
    this.currentMap.update((map) => ({ ...map, map: { ...map.map, raw: tiles } }));
    this.checkPathsDoors();
  }

  private backupMap(): void {
    this.history.push(cloneTiles(this.rawMap()));
  }

  protected undoMap(): void {
    const previous = this.history.pop();
    if (!previous) return;
    this.redoHistory.push(cloneTiles(this.rawMap()));
    this.setRaw(previous);
  }

  protected redoMap(): void {
    const next = this.redoHistory.pop();
    if (!next) return;
    this.backupMap();
    this.setRaw(next);
  }

  // --- doors & paths ---

  private checkPathsDoors(): void {
    const map = this.currentMap();
    const collect = (flag: 'door' | 'path', saved: PokeMap['doors']): NamedPortal[] =>
      this.rawMap().flatMap((tile, i) => {
        if (!tile[flag]) return [];
        const name = `${i % MAP_COLUMNS}-${Math.floor(i / MAP_COLUMNS)}`;
        return [{ ...saved?.[name], name }];
      });
    this.doors.set(collect('door', map.doors));
    this.paths.set(collect('path', map.paths));
  }

  private processPortals(): Pick<PokeMap, 'doors' | 'paths'> {
    const doors: PokeMap['doors'] = {};
    for (const { name, ...door } of this.doors()) {
      doors[name] = {
        mapX: door.mapX!,
        mapY: door.mapY!,
        building: door.building,
        playerX: door.playerX!,
        playerY: door.playerY!,
        mapSet: door.mapSet,
      };
    }
    const paths: PokeMap['paths'] = {};
    for (const { name, ...path } of this.paths()) {
      paths[name] = {
        mapX: path.mapX!,
        mapY: path.mapY!,
        playerX: path.playerX!,
        playerY: path.playerY!,
        mapSet: path.mapSet,
      };
    }
    return { doors, paths };
  }

  // --- wild pokemon ---

  protected checkCatchablePokemon(rarity: Rarity, text: string): void {
    this.catchable.update((current) => ({ ...current, [rarity]: text }));
    const ids = text
      .split(',')
      .map((part) => parseInt(part, 10))
      .filter((id) => id > 0 && id <= MAX_POKEMON_ID)
      .sort((a, b) => a - b);
    this.currentMap.update((map) => ({ ...map, pokemon: { ...map.pokemon, [rarity]: ids } }));
  }

  private unpackCatchablePokemon(): void {
    const pokemon = this.currentMap().pokemon;
    this.catchable.set({
      common: pokemon?.common?.join(',') ?? '',
      uncommon: pokemon?.uncommon?.join(',') ?? '',
      rare: pokemon?.rare?.join(',') ?? '',
    });
  }
}
