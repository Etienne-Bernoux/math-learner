import { describe, it, expect, vi } from 'vitest';
import { creerBriques, creerBalle, creerRaquette, mettreAJourBalle, mettreAJourParticules, mettreAJourPowerUps } from './physique.js';

describe('creerBriques', () => {
  it('creates correct number of bricks from pattern', () => {
    const pattern = [
      [1, 1, 1, 1],
      [0, 1, 0, 1],
      [1, 0, 2, 0],
    ];
    // Force no random metal bricks for predictable count
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    const bricks = creerBriques(pattern, 0);
    vi.restoreAllMocks();

    // Count non-zero cells: row0=4, row1=2, row2=2 = 8
    expect(bricks).toHaveLength(8);
    expect(bricks.every(b => b.alive)).toBe(true);
  });

  it('marks powerup bricks from cell value 2', () => {
    const pattern = [[2, 1]];
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    const bricks = creerBriques(pattern, 0);
    vi.restoreAllMocks();

    expect(bricks[0].hasPowerUp).toBe(true);
    expect(bricks[1].hasPowerUp).toBe(false);
  });

  it('creates metal bricks at higher levels', () => {
    const pattern = [[1, 1, 1, 1, 1, 1, 1, 1]];
    // Force random to always return low value -> metal bricks
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const bricks = creerBriques(pattern, 3);
    vi.restoreAllMocks();

    expect(bricks.some(b => b.isMetal)).toBe(true);
    expect(bricks.some(b => b.hp >= 2)).toBe(true);
  });
});

describe('creerBalle', () => {
  it('creates ball at center bottom', () => {
    const ball = creerBalle(300, 500, 5);
    expect(ball.x).toBe(150);
    expect(ball.y).toBe(450);
    expect(ball.launched).toBe(false);
  });
});

describe('creerRaquette', () => {
  it('creates standard paddle', () => {
    const paddle = creerRaquette(300);
    expect(paddle.w).toBe(90);
    expect(paddle.h).toBe(12);
  });

  it('creates wide paddle when requested', () => {
    const paddle = creerRaquette(300, true);
    expect(paddle.w).toBe(120);
  });
});

describe('mettreAJourBalle', () => {
  it('ball bounces off left wall', () => {
    const ball = { x: 5, y: 100, r: 8, dx: -3, dy: 2, speed: 5 };
    const paddle = { x: 100, y: 480, w: 90, h: 12 };
    const particles = [];

    mettreAJourBalle(ball, paddle, [], 300, 500, 0, [], particles);
    expect(ball.dx).toBe(3);
  });

  it('ball bounces off right wall', () => {
    const ball = { x: 295, y: 100, r: 8, dx: 3, dy: 2, speed: 5 };
    const paddle = { x: 100, y: 480, w: 90, h: 12 };
    const particles = [];

    mettreAJourBalle(ball, paddle, [], 300, 500, 0, [], particles);
    expect(ball.dx).toBe(-3);
  });

  it('ball bounces off top wall', () => {
    const ball = { x: 150, y: 5, r: 8, dx: 2, dy: -3, speed: 5 };
    const paddle = { x: 100, y: 480, w: 90, h: 12 };
    const particles = [];

    mettreAJourBalle(ball, paddle, [], 300, 500, 0, [], particles);
    expect(ball.dy).toBe(3);
  });

  it('ball bounces off paddle', () => {
    const paddle = { x: 100, y: 200, w: 90, h: 12 };
    const ball = { x: 145, y: 195, r: 8, dx: 0, dy: 3, speed: 5 };
    const particles = [];

    mettreAJourBalle(ball, paddle, [], 300, 500, 0, [], particles);
    expect(ball.dy).toBeLessThan(0);
  });

  it('brick HP decreases on hit', () => {
    const brick = { x: 140, y: 95, w: 36, h: 15, alive: true, color: '#ef4444', hasPowerUp: false, hp: 2, maxHp: 2, isMetal: true };
    const ball = { x: 155, y: 100, r: 8, dx: 0, dy: -3, speed: 5 };
    const paddle = { x: 100, y: 480, w: 90, h: 12 };
    const particles = [];

    mettreAJourBalle(ball, paddle, [brick], 300, 500, 0, [], particles);
    expect(brick.hp).toBe(1);
    expect(brick.alive).toBe(true);
  });

  it('brick dies when HP reaches 0', () => {
    const brick = { x: 140, y: 95, w: 36, h: 15, alive: true, color: '#ef4444', hasPowerUp: false, hp: 1, maxHp: 1, isMetal: false };
    const ball = { x: 155, y: 100, r: 8, dx: 0, dy: -3, speed: 5 };
    const paddle = { x: 100, y: 480, w: 90, h: 12 };
    const particles = [];

    const result = mettreAJourBalle(ball, paddle, [brick], 300, 500, 0, [], particles);
    expect(brick.alive).toBe(false);
    expect(result.scoreGained).toBeGreaterThan(0);
  });

  it('particles spawn on brick hit', () => {
    const brick = { x: 140, y: 95, w: 36, h: 15, alive: true, color: '#ef4444', hasPowerUp: false, hp: 1, maxHp: 1, isMetal: false };
    const ball = { x: 155, y: 100, r: 8, dx: 0, dy: -3, speed: 5 };
    const paddle = { x: 100, y: 480, w: 90, h: 12 };
    const particles = [];

    mettreAJourBalle(ball, paddle, [brick], 300, 500, 0, [], particles);
    expect(particles.length).toBeGreaterThan(0);
  });

  it('powerups drop from special bricks', () => {
    const brick = { x: 140, y: 95, w: 36, h: 15, alive: true, color: '#ef4444', hasPowerUp: true, hp: 1, maxHp: 1, isMetal: false };
    const ball = { x: 155, y: 100, r: 8, dx: 0, dy: -3, speed: 5 };
    const paddle = { x: 100, y: 480, w: 90, h: 12 };
    const fallingPowerUps = [];
    const particles = [];

    mettreAJourBalle(ball, paddle, [brick], 300, 500, 0, fallingPowerUps, particles);
    expect(fallingPowerUps.length).toBe(1);
    expect(['wide', 'slow']).toContain(fallingPowerUps[0].type);
  });

  it('detects ball lost when below screen', () => {
    const ball = { x: 150, y: 510, r: 8, dx: 0, dy: 3, speed: 5 };
    const paddle = { x: 100, y: 480, w: 90, h: 12 };
    const particles = [];

    const result = mettreAJourBalle(ball, paddle, [], 300, 500, 0, [], particles);
    expect(result.ballLost).toBe(true);
  });

  it('detects all bricks destroyed', () => {
    const bricks = [
      { x: 10, y: 50, w: 36, h: 15, alive: false, hp: 0 },
      { x: 50, y: 50, w: 36, h: 15, alive: false, hp: 0 },
    ];
    const ball = { x: 150, y: 200, r: 8, dx: 0, dy: -3, speed: 5 };
    const paddle = { x: 100, y: 480, w: 90, h: 12 };
    const particles = [];

    const result = mettreAJourBalle(ball, paddle, bricks, 300, 500, 0, [], particles);
    expect(result.allDestroyed).toBe(true);
  });
});

describe('mettreAJourParticules', () => {
  it('updates particle positions and removes dead ones', () => {
    const particles = [
      { x: 100, y: 100, dx: 1, dy: -1, size: 3, color: '#fff', life: 0.02 },
      { x: 200, y: 200, dx: 2, dy: 1, size: 4, color: '#fff', life: 1 },
    ];

    mettreAJourParticules(particles);

    // First particle should be removed (life was 0.02 - 0.03 < 0)
    expect(particles).toHaveLength(1);
    expect(particles[0].x).toBe(202);
  });
});

describe('mettreAJourPowerUps', () => {
  it('collects powerups that hit paddle', () => {
    const paddle = { x: 100, y: 200, w: 90, h: 12 };
    const fallingPowerUps = [
      { x: 130, y: 205, type: 'wide' },
    ];

    const collected = mettreAJourPowerUps(fallingPowerUps, paddle, 500);
    expect(collected).toEqual(['wide']);
    expect(fallingPowerUps).toHaveLength(0);
  });

  it('removes powerups that fall off screen', () => {
    const paddle = { x: 100, y: 200, w: 90, h: 12 };
    const fallingPowerUps = [
      { x: 130, y: 500, type: 'slow' },
    ];

    const collected = mettreAJourPowerUps(fallingPowerUps, paddle, 500);
    expect(collected).toEqual([]);
    expect(fallingPowerUps).toHaveLength(0);
  });
});
