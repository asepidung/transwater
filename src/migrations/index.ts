import * as migration_20260930_023608_initial from './20260930_023608_initial';
import * as migration_20260930_053449_about_vision_mission from './20260930_053449_about_vision_mission';
import * as migration_20260930_070818_hero_style from './20260930_070818_hero_style';
import * as migration_20260930_091240_video_section from './20260930_091240_video_section';
import * as migration_20261001_143023_site_hours from './20261001_143023_site_hours';
import * as migration_20261002_032616_activity_log from './20261002_032616_activity_log';
import * as migration_20261002_122200_user_role from './20261002_122200_user_role';

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
    name: '20260930_070818_hero_style',
  },
  {
    up: migration_20260930_091240_video_section.up,
    down: migration_20260930_091240_video_section.down,
    name: '20260930_091240_video_section',
  },
  {
    up: migration_20261001_143023_site_hours.up,
    down: migration_20261001_143023_site_hours.down,
    name: '20261001_143023_site_hours',
  },
  {
    up: migration_20261002_032616_activity_log.up,
    down: migration_20261002_032616_activity_log.down,
    name: '20261002_032616_activity_log',
  },
  {
    up: migration_20261002_122200_user_role.up,
    down: migration_20261002_122200_user_role.down,
    name: '20261002_122200_user_role'
  },
];
