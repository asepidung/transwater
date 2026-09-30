import * as migration_20260930_023608_initial from './20260930_023608_initial';
import * as migration_20260930_053449_about_vision_mission from './20260930_053449_about_vision_mission';
import * as migration_20260930_070818_hero_style from './20260930_070818_hero_style';

export const migrations = [
  {
    up: migration_20260930_023608_initial.up,
    down: migration_20260930_023608_initial.down,
    name: '20260930_023608_initial',
  },
  {
    up: migration_20260930_053449_about_vision_mission.up,
    down: migration_20260930_053449_about_vision_mission.down,
    name: '20260930_053449_about_vision_mission',
  },
  {
    up: migration_20260930_070818_hero_style.up,
    down: migration_20260930_070818_hero_style.down,
    name: '20260930_070818_hero_style'
  },
];
