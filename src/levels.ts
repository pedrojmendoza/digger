/**
 * Map legend (15 columns x 10 rows):
 *   #  dirt
 *   .  tunnel
 *   E  emerald (in dirt)
 *   B  gold bag (in its own hollow, resting on whatever is below)
 *   P  player start (tunnel)
 *   S  enemy spawn (tunnel)
 */
export interface LevelDef {
  map: string[];
  enemyTotal: number;      // enemies spawned over the level
  enemyMax: number;        // enemies alive at once
  firstSpawnDelay: number; // seconds
  spawnInterval: number;   // seconds
  enemySpeed: number;      // cells per second
}

export const LEVELS: LevelDef[] = [
  {
    map: [
      '..............S',
      '#EE##B###E####.',
      '#EE#########E#.',
      '####BE####EE##.',
      'E###E#####EE##.',
      'E#B#####B#####.',
      'E###EE##E###E..',
      '###EE####EE....',
      '#B###E####E###.',
      '#######P.......',
    ],
    enemyTotal: 5,
    enemyMax: 2,
    firstSpawnDelay: 3,
    spawnInterval: 7,
    enemySpeed: 2.0,
  },
  {
    map: [
      'S..............',
      '.EE###E###EE#E#',
      '.#B####E######E',
      '.#E#BE####EE###',
      'E###E###B#####E',
      'E#EE####E###EE#',
      '#####EE###E####',
      '#E###EE####E##E',
      '####B####EE####',
      '#####....P.....',
    ],
    enemyTotal: 6,
    enemyMax: 3,
    firstSpawnDelay: 3,
    spawnInterval: 6,
    enemySpeed: 2.2,
  },
];
