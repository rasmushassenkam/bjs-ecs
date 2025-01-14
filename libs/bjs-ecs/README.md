# bjs-esc

[ECS](https://en.wikipedia.org/wiki/Entity_component_system) for [Babylon.js](https://babylonjs.com/)

## Objectives

Provide an easy way to help structure your game logic for Babylon.js based projects using ECS.
This is (currently) more about the functionality of ECS than the performance benefits.
In short if you are looking for an ECS implementation to handle 10Ks of entities,
you may want to look elsewhere.

- ✅ (current) Focus on developer ergonomics, e.g. being TypeScript idiomatic
- ✅ (current) Tight integration with Babylon.js
- ⏭️ (next) Optimize query performance
- ❓ (not currently in scope) Optimized data storage for Entities/Components

## Sample

To run the sample:

```
git clone https://github.com/Skybox-Technologies/bjs-ecs.git
cd bjs-ecs
npm install
npx nx run sample:serve
```

See also [CodeSandbox](https://codesandbox.io/p/devbox/bjs-ecs-sample-sw27pj?file=%2Fsrc%2FcreateScene.ts)

## Installation

```
npm install @skyboxgg/bjs-ecs
```

## Usage

### Core ECS:

```ts
import { addEntity, queryEntities, removeEntity } from '@skyboxgg/bjs-ecs';

// add entity with tags
const player = addEntity(['actor', 'player']);

// define components
function color(hex: string) {
  return { id: 'color', color: hex };
}

function door(isLocked: boolean) {
  return { id: 'door', locked: isLocked };
}

// add entity with components (and tag)
// component properties propagate to entity with typing
const redDoor = addEntity([door(true), color('#ff0000'), 'static']);
console.log('redDoor color:', redDoor.color);
console.log('redDoor lock status:', redDoor.locked);

const greenDoor = addEntity([door(false), color('#00ff00'), 'static']);
console.log('greenDoor color:', greenDoor.color);
console.log('greenDoor lock status:', greenDoor.locked);

// query entities by component
// result is typed
const doors = queryEntities([door, color]);
doors.forEach((door) => {
  console.log('door color:', door.color);
  console.log('door lock status:', door.locked);
});

// remove entity from world
removeEntity(doors[0]);
```

### With Babylon.js

Babylon Nodes can be added as entities, and subtypes (TransformNode, Mesh) as well as PhysicsBody
are detected as additional components.

Nodes are automatically disposed from the Babylon scenegraph when removed from the ECS world and vice versa.

There is also initial support to show entity ID and list of components / tags, for Nodes in the Babylon inspector

![Inspector Support](https://raw.githubusercontent.com/Skybox-Technologies/bjs-ecs/main/libs/bjs-ecs/inspector.png)

```ts
import { Scene } from '@babylonjs/core/scene';
import { addNodeEntity, queryXforms } from '@skyboxgg/bjs-ecs';

function setupScene(scene: Scene) {
  // other scene setup: camera, lights, etc

  // create and add entities
  const sphere1 = MeshBuilder.CreateSphere('player1', { diameter: 1, segments: 32 }, scene);
  addNodeEntity(sphere1, ['player']);

  const sphere2 = MeshBuilder.CreateSphere('player2', { diameter: 1, segments: 32 }, scene);
  addNodeEntity(sphere2, ['player']);

  const ground = MeshBuilder.CreateGround('ground', { width: 8, height: 6 }, scene);
  addNodeEntity(ground, ['ground']);

  // query transform entities (with typing)
  queryXforms(['player']).forEach((player) => {
    player.xform.position.y += 2;
  });
}
```

## Acknowledgements

- The interface and TypeScript Fu for adding entities with components, is inspired by [Kaboom.js](https://kaboomjs.com/)