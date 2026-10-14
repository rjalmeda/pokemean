import { Application, Container, Rectangle, Sprite, Texture } from 'pixi.js';
import { Facing, Tile } from '../../models';
import { MAP_COLUMNS, MAP_ROWS, TILE_SIZE } from '../../services/map.service';

const TILESET_URL = '/assets/pics/tileset/tileset5.png';
const PLAYER_URL = '/assets/pics/tileset/player.png';

/** Tile layers drawn under the player, then over it, bottom to top. */
const LAYERS_BELOW = ['BG', 'MG', 'MG2'] as const;
const LAYERS_ABOVE = ['FG', 'FG2'] as const;

/** Top of each facing's row in player.png. Frame columns are 32px apart. */
const PLAYER_ROW: Record<Facing, number> = { down: 0, left: 33, right: 65, up: 97 };
const WALK_FRAMES = 3;
const WALK_CYCLE_MS = 400;
/** The middle frame is the standing pose. */
const STAND_FRAME = 1;

/** "tile-R2817-C33" is the 32px cell at x=33, y=2817 in the tileset (each cell has a 1px border above and left). */
const TILE_ID = /^tile-R(\d+)-C(\d+)$/;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${url}`));
    image.src = url;
  });
}

/**
 * Draws the overworld with Pixi (WebGL). It only draws: where the player is and what the
 * map looks like come from the game loop in the World component.
 *
 * The tileset is far taller than many GPUs allow for a single texture, so each map gets
 * a small atlas holding just the tiles it uses.
 */
export class WorldRenderer {
  private readonly app = new Application();
  private readonly below = new Container();
  private readonly above = new Container();
  private readonly player = new Sprite();
  private tileset?: HTMLImageElement;
  private playerFrames?: Record<Facing, Texture[]>;
  private atlas?: Texture;
  private ready = false;

  /** Creates the canvas inside `host` and loads the images. Call before anything else. */
  async init(host: HTMLElement): Promise<void> {
    await this.app.init({
      width: MAP_COLUMNS * TILE_SIZE,
      height: MAP_ROWS * TILE_SIZE,
      backgroundAlpha: 0,
      antialias: false,
      roundPixels: true,
      autoStart: false, // the game loop decides when to draw
      preference: 'webgl',
    });
    const [tileset, playerImage] = await Promise.all([loadImage(TILESET_URL), loadImage(PLAYER_URL)]);
    this.tileset = tileset;

    const sheet = Texture.from(playerImage);
    sheet.source.scaleMode = 'nearest';
    const frames = (facing: Facing): Texture[] =>
      Array.from(
        { length: WALK_FRAMES },
        (_, i) =>
          new Texture({
            source: sheet.source,
            frame: new Rectangle(i * TILE_SIZE, PLAYER_ROW[facing], TILE_SIZE, TILE_SIZE),
          }),
      );
    this.playerFrames = { down: frames('down'), left: frames('left'), right: frames('right'), up: frames('up') };
    this.player.texture = this.playerFrames.down[STAND_FRAME];

    this.app.stage.addChild(this.below, this.player, this.above);
    const canvas = this.app.canvas;
    canvas.style.display = 'block';
    host.appendChild(canvas);
    this.ready = true;
  }

  /** Replaces what is on screen with the given tiles (row by row, MAP_COLUMNS wide). */
  setMap(tiles: Tile[]): void {
    if (!this.ready || !this.tileset) return;

    const ids = new Set<string>();
    for (const tile of tiles) {
      for (const layer of [...LAYERS_BELOW, ...LAYERS_ABOVE]) {
        if (TILE_ID.test(tile[layer])) ids.add(tile[layer]);
      }
    }

    const atlasCanvas = document.createElement('canvas');
    atlasCanvas.width = Math.max(1, ids.size) * TILE_SIZE;
    atlasCanvas.height = TILE_SIZE;
    const context = atlasCanvas.getContext('2d');
    if (!context) throw new Error('2D canvas is not available');

    const previousAtlas = this.atlas;
    const atlas = Texture.from(atlasCanvas);
    atlas.source.scaleMode = 'nearest';
    const textures = new Map<string, Texture>();
    let index = 0;
    for (const id of ids) {
      const [, row, column] = TILE_ID.exec(id)!;
      context.drawImage(this.tileset, Number(column), Number(row), TILE_SIZE, TILE_SIZE, index * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE);
      textures.set(
        id,
        new Texture({ source: atlas.source, frame: new Rectangle(index * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE) }),
      );
      index++;
    }
    atlas.source.update();

    for (const container of [this.below, this.above]) {
      for (const child of container.removeChildren()) child.destroy();
    }
    const draw = (container: Container, layers: readonly (typeof LAYERS_BELOW[number] | typeof LAYERS_ABOVE[number])[]) => {
      for (const layer of layers) {
        tiles.forEach((tile, i) => {
          const texture = textures.get(tile[layer]);
          if (!texture) return;
          const sprite = new Sprite(texture);
          sprite.position.set((i % MAP_COLUMNS) * TILE_SIZE, Math.floor(i / MAP_COLUMNS) * TILE_SIZE);
          container.addChild(sprite);
        });
      }
    };
    draw(this.below, LAYERS_BELOW);
    draw(this.above, LAYERS_ABOVE);

    this.atlas = atlas;
    previousAtlas?.destroy(true);
  }

  /** Draws one frame. `walking` cycles the legs; otherwise the player stands. */
  draw(x: number, y: number, facing: Facing, walking: boolean): void {
    if (!this.ready || !this.playerFrames) return;
    const frame = walking
      ? Math.floor((performance.now() % WALK_CYCLE_MS) / (WALK_CYCLE_MS / WALK_FRAMES))
      : STAND_FRAME;
    this.player.texture = this.playerFrames[facing][frame];
    this.player.position.set(x, y);
    this.app.render();
  }

  destroy(): void {
    if (!this.ready) return;
    this.ready = false;
    this.app.destroy(true, { children: true });
  }
}
