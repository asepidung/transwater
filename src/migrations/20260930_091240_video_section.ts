import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`video_section_enabled\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`home_page_locales\` ADD \`video_section_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`home_page_locales\` ADD \`video_section_title\` text;`)
  await db.run(sql`ALTER TABLE \`home_page_locales\` ADD \`video_section_text\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`video_section_enabled\`;`)
  await db.run(sql`ALTER TABLE \`home_page_locales\` DROP COLUMN \`video_section_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`home_page_locales\` DROP COLUMN \`video_section_title\`;`)
  await db.run(sql`ALTER TABLE \`home_page_locales\` DROP COLUMN \`video_section_text\`;`)
}
