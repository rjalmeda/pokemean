import { Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { Pokemon } from '../../models';
import { TYPE_CHART } from '../../type-chart';

export type Side = 'player' | 'enemy';

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

@Component({
  selector: 'app-battle',
  templateUrl: './battle.html',
})
export class Battle {
  protected readonly player = signal<Pokemon | undefined>(undefined);
  protected readonly enemy = signal<Pokemon | undefined>(undefined);

  private readonly timers = new Set<ReturnType<typeof setTimeout>>();
  private readonly playerSprite = viewChild<ElementRef<HTMLElement>>('playerSprite');
  private readonly enemySprite = viewChild<ElementRef<HTMLElement>>('enemySprite');

  protected readonly enemyVisible = signal(false);
  protected readonly enemyInfoVisible = signal(false);
  protected readonly playerVisible = signal(false);
  protected readonly playerInfoVisible = signal(false);
  protected readonly enemyCry = signal('');
  protected readonly playerCry = signal('');
  protected readonly playerHP = signal(0);
  protected readonly enemyHP = signal(0);
  /** Newest entry first. */
  private readonly log = signal<string[]>([]);
  protected readonly statusText = computed(() => this.log().join(''));

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearTimers());
  }

  /** Plays the battle intro: wild Pokemon appears, then the player sends theirs out. */
  start(player: Pokemon, enemy: Pokemon): void {
    this.reset();
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
        });
      });
    });
  }

  attack(who: Side): void {
    const player = this.player();
    const enemy = this.enemy();
    if (!player || !enemy) return;

    const [attacker, defender] = who === 'player' ? [player, enemy] : [enemy, player];
    this.later(500, () => this.animateAttack(who));

    const multiplier = effectiveness(attacker, defender);
    if (multiplier === 0) this.say('Attack has no effect\n');
    else if (multiplier < 1) this.say('Attack is not effective\n');
    else if (multiplier >= 2) this.say('Attack is super effective\n');
    else if (multiplier > 1) this.say('Attack is effective\n');
    else this.say('\n');

    const damage = Math.floor(
      ((attacker.atk * attacker.atk) / defender.def) * multiplier * 0.25 * (Math.random() * 0.5 + 0.5),
    );
    play(`/assets/sounds/${attacker.id}.mp3`);
    this.later(500, () => play(damage > 0 ? '/assets/music/fx/punch.mp3' : '/assets/music/fx/miss.mp3'));

    this.say(`${attacker.name} does ${damage} damage. \n`);
    this.say(`${attacker.name} attacks ${defender.name}\n`);
    const hp = who === 'player' ? this.enemyHP : this.playerHP;
    hp.update((current) => Math.max(0, current - damage));
  }

  private animateAttack(who: Side): void {
    const [attackerEl, defenderEl] =
      who === 'player'
        ? [this.playerSprite(), this.enemySprite()]
        : [this.enemySprite(), this.playerSprite()];
    const dir = who === 'player' ? 1 : -1;
    attackerEl?.nativeElement.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(${25 * dir}px)` }, { transform: 'translateX(0)' }],
      { duration: 170 },
    );
    defenderEl?.nativeElement.animate(
      [
        { transform: 'translateX(0)' },
        { transform: `translateX(${-15 * dir}px)` },
        { transform: 'translateX(0)' },
        { transform: `translateX(${-15 * dir}px)` },
        { transform: 'translateX(0)' },
      ],
      { duration: 100 },
    );
  }

  private reset(): void {
    this.clearTimers();
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
