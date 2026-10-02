import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`users\` ADD \`role\` text DEFAULT 'staff' NOT NULL;`)
  // Akun yang sudah ada paling awal menjadi Pemilik, supaya selalu ada yang bisa mengelola akun.
  await db.run(sql`UPDATE \`users\` SET \`role\` = 'owner' WHERE \`id\` = (SELECT MIN(\`id\`) FROM \`users\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`role\`;`)
}
