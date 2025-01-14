import { NullEngine, MeshBuilder, Scene } from '@babylonjs/core';
import { addNodeEntity, queryXforms } from './bjs-ecs.js';
import { removeEntity } from './ecs.js';

const engine = new NullEngine();
const scene = new Scene(engine);

describe('handle BJS entities', () => {
  it('can add BJS entities with components', () => {
    const player = MeshBuilder.CreateSphere('player1', { diameter: 2 }, scene);
    addNodeEntity(player, ['player']);

    const enemy1 = MeshBuilder.CreateBox('enemy1', { size: 2 }, scene);
    addNodeEntity(enemy1, ['enemy']);

    const enemy2 = MeshBuilder.CreateBox('enemy2', { size: 2 }, scene);
    addNodeEntity(enemy2, ['enemy']);
  });

  it('can query BJS entities by tags', () => {
    const players = queryXforms(['player']);
    expect(players.length).toBe(1);
    expect(players[0].node.name).toBe('player1');
  });

  it('can remove entity when BJS Node is disposed', () => {
    const enemies1 = queryXforms(['enemy']);
    expect(enemies1.length).toBe(2);

    scene.getMeshByName('enemy1')?.dispose();
    const enemies2 = queryXforms(['enemy']);
    expect(enemies2.length).toBe(1);
  });

  it('can dispose BJS Node when entity is removed from world', () => {
    const enemy2 = scene.getMeshByName('enemy2');
    expect(enemy2).toBeDefined();

    queryXforms(['enemy']).forEach((enemy) => {
      removeEntity(enemy);
    });

    const enemy2After = scene.getMeshByName('enemy2');
    expect(enemy2After).toBeDefined();
  });
});
