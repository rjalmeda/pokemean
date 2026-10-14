import {
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Pokemon } from '../../models';
import { TYPE_CHART } from '../../type-chart';

export type Side = 'player' | 'enemy';

/** intro: animations playing; menu: waiting for the player; busy: a turn is resolving. */
type Phase = 'idle' | 'intro' | 'menu' | 'busy';

/** Pause between the beats of a turn, so each message can be read. */
const TURN_DELAY = 1300;

function play(src: string): void {
  // Browsers may block audio until the user has interacted with the page.
  new Audio(src).play().catch(() => undefined);
}

function effectiveness(attacker: Pokemon, defender: Pokemon): number {
  let multiplier = 1;
  for (const atk of attacker.types) {
    for (const def of defender.types) {
      multiplier *= TYPE_CHART[atk][def];
    }
  }
  return multiplier;
}

function moveName(name: string): string {
  return name.replace(/-/g, ' ').toUpperCase();
}

@Component({
  selector: 'app-battle',
  templateUrl: './battle.html',
})
export class Battle {
  /** Emitted when the battle is over (won, lost or fled) and the world should resume. */
  readonly finished = output<void>();

  protected readonly player = signal<Pokemon | undefined>(undefined);
  protected readonly enemy = signal<Pokemon | undefined>(undefined);

  private readonly timers = new Set<ReturnType<typeof setTimeout>>();
  private readonly playerSprite = viewChild<ElementRef<HTMLElement>>('playerSprite');
  private readonly enemySprite = viewChild<ElementRef<HTMLElement>>('enemySprite');

  protected readonly phase = signal<Phase>('idle');
  protected readonly enemyVisible = signal(false);
  protected readonly enemyInfoVisible = signal(false);
  protected readonly playerVisible = signal(false);
  protected readonly playerInfoVisible = signal(false);
  protected readonly enemyCry = signal('');
  protected readonly playerCry = signal('');
  protected readonly playerHP = signal(0);
  protected readonly enemyHP = signal(0);
  protected readonly menuVisible = computed(() => this.phase() === 'menu');
  /** Newest entry first. */
  private readonly log = signal<string[]>([]);
  protected readonly statusText = computed(() => this.log().join(''));

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearTimers());
  }

  protected displayName(name: string): string {
    return moveName(name);
  }

  /** Plays the battle intro: wild Pokemon appears, then the player sends theirs out. */
  start(player: Pokemon, enemy: Pokemon): void {
    this.reset();
    this.phase.set('intro');
    this.player.set(player);
    this.enemy.set(enemy);
    this.playerHP.set(player.currentHP);
    this.enemyHP.set(enemy.currentHP);

    this.later(1500, () => {
      this.enemyVisible.set(true);
      this.later(600, () => {
        this.enemyInfoVisible.set(true);
        this.say(`A wild ${enemy.name} appears! \n\n`);
        this.enemyCry.set(`/assets/sounds/${enemy.id}.ogg`);
      });
    });

    this.later(3200, () => {
      this.say(`Go get em' ${player.name}! \n`);
      this.later(1250, () => {
        this.playerVisible.set(true);
        this.later(600, () => {
          this.playerInfoVisible.set(true);
          this.playerCry.set(`/assets/sounds/${player.id}.ogg`);
          this.later(800, () => {
            this.say(`What will ${player.name} do?\n`);
            this.phase.set('menu');
          });
        });
      });
    });
  }

  /** The player picks one of their Pokemon's moves; the enemy answers if it survives. */
  chooseMove(index: number): void {
    const player = this.player();
    const enemy = this.enemy();
    if (this.phase() !== 'menu' || !player || !enemy) return;
    const move = player.moves[index];
    if (!move) return;

    this.phase.set('busy');
    this.useMove('player', move.name);
    this.later(TURN_DELAY, () => {
      if (this.enemyHP() === 0) return this.faint('enemy');

      const enemyMove = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
      this.useMove('enemy', enemyMove?.name);
      this.later(TURN_DELAY, () => {
        if (this.playerHP() === 0) return this.faint('player');
        this.say(`What will ${player.name} do?\n`);
        this.phase.set('menu');
      });
    });
  }

  run(): void {
    if (this.phase() !== 'menu') return;
    this.phase.set('busy');
    this.say('Got away safely!\n');
    this.later(1000, () => this.end());
  }

  private useMove(who: Side, name = 'attack'): void {
    const player = this.player()!;
    const enemy = this.enemy()!;
    const [attacker, defender] = who === 'player' ? [player, enemy] : [enemy, player];

    const multiplier = effectiveness(attacker, defender);
    const damage = Math.floor(
      ((attacker.atk * attacker.atk) / Math.max(defender.def, 1)) *
        multiplier *
        0.25 *
        (Math.random() * 0.5 + 0.5),
    );
    const hp = who === 'player' ? this.enemyHP : this.playerHP;
    hp.update((current) => Math.max(0, current - damage));

    this.say(`${attacker.name} used ${moveName(name)}! ${damage} damage.\n`);
    if (multiplier === 0) this.say('It has no effect...\n');
    else if (multiplier < 1) this.say("It's not very effective...\n");
    else if (multiplier >= 2) this.say("It's super effective!\n");

    this.animateAttack(who);
    play(`/assets/sounds/${attacker.id}.mp3`);
    this.later(500, () => play(damage > 0 ? '/assets/music/fx/punch.mp3' : '/assets/music/fx/miss.mp3'));
  }

  private faint(who: Side): void {
    const pokemon = who === 'player' ? this.player()! : this.enemy()!;
    // Hiding the sprite plays its leave animation (the faint sink).
    (who === 'player' ? this.playerVisible : this.enemyVisible).set(false);
    this.say(`${pokemon.name} fainted!\n`);
    this.say(who === 'enemy' ? 'You won the battle!\n' : 'You lost the battle...\n');
    this.later(2200, () => this.end());
  }

  private end(): void {
    this.phase.set('idle');
    this.finished.emit();
  }

  private animateAttack(who: Side): void {
    const [attackerEl, defenderEl] =
      who === 'player'
        ? [this.playerSprite(), this.enemySprite()]
        : [this.enemySprite(), this.playerSprite()];
    const dir = who === 'player' ? 1 : -1;
    attackerEl?.nativeElement.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(${25 * dir}px)` }, { transform: 'translateX(0)' }],
      { duration: 170, delay: 500 },
    );
    defenderEl?.nativeElement.animate(
      [
        { transform: 'translateX(0)' },
        { transform: `translateX(${-15 * dir}px)` },
        { transform: 'translateX(0)' },
        { transform: `translateX(${-15 * dir}px)` },
        { transform: 'translateX(0)' },
      ],
      { duration: 100, delay: 500 },
    );
  }

  private reset(): void {
    this.clearTimers();
    this.phase.set('idle');
    this.enemyVisible.set(false);
    this.enemyInfoVisible.set(false);
    this.playerVisible.set(false);
    this.playerInfoVisible.set(false);
    this.enemyCry.set('');
    this.playerCry.set('');
    this.log.set([]);
  }

  private say(message: string): void {
    this.log.update((entries) => [message, ...entries]);
  }

  private later(ms: number, fn: () => void): void {
    const id = setTimeout(() => {
      this.timers.delete(id);
      fn();
    }, ms);
    this.timers.add(id);
  }

  private clearTimers(): void {
    this.timers.forEach(clearTimeout);
    this.timers.clear();
  }
}
