import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`about_page_about_expertise\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_page_about_expertise_order_idx\` ON \`about_page_about_expertise\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_page_about_expertise_parent_id_idx\` ON \`about_page_about_expertise\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`about_page_about_expertise_locales\` (
  	\`text\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page_about_expertise\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`about_page_about_expertise_locales_locale_parent_id_unique\` ON \`about_page_about_expertise_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`about_page_locales\` ADD \`about_expertise_title\` text;`)
  await db.run(sql`ALTER TABLE \`about_page_locales\` ADD \`about_vision_title\` text;`)
  await db.run(sql`ALTER TABLE \`about_page_locales\` ADD \`about_vision\` text;`)
  await db.run(sql`ALTER TABLE \`about_page_locales\` ADD \`about_mission_title\` text;`)
  await db.run(sql`ALTER TABLE \`about_page_locales\` ADD \`about_mission\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`about_page_about_expertise\`;`)
  await db.run(sql`DROP TABLE \`about_page_about_expertise_locales\`;`)
  await db.run(sql`ALTER TABLE \`about_page_locales\` DROP COLUMN \`about_expertise_title\`;`)
  await db.run(sql`ALTER TABLE \`about_page_locales\` DROP COLUMN \`about_vision_title\`;`)
  await db.run(sql`ALTER TABLE \`about_page_locales\` DROP COLUMN \`about_vision\`;`)
  await db.run(sql`ALTER TABLE \`about_page_locales\` DROP COLUMN \`about_mission_title\`;`)
  await db.run(sql`ALTER TABLE \`about_page_locales\` DROP COLUMN \`about_mission\`;`)
}
