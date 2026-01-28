import { interactionGroups } from "@react-three/rapier";

const SHIP_GROUP = 0;
const ASTEROID_GROUP = 1;
const BULLET_GROUP = 2;

export const shipCollisionGroups = interactionGroups(
  [SHIP_GROUP],
  [ASTEROID_GROUP]
);

export const asteroidCollisionGroups = interactionGroups(
  [ASTEROID_GROUP],
  [SHIP_GROUP, BULLET_GROUP]
);

export const bulletCollisionGroups = interactionGroups(
  [BULLET_GROUP],
  [ASTEROID_GROUP]
);
