import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`home_page_partners_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_page_partners_items_order_idx\` ON \`home_page_partners_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_partners_items_parent_id_idx\` ON \`home_page_partners_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_partners_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_partners_items_order_idx\` ON \`_home_page_v_version_partners_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_partners_items_parent_id_idx\` ON \`_home_page_v_version_partners_items\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`home_page_locales\` ADD \`partners_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`home_page_locales\` ADD \`partners_title\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v_locales\` ADD \`version_partners_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`_home_page_v_locales\` ADD \`version_partners_title\` text;`)
  // Isi awal bagian Partner (nama disetujui Pak Feri); selanjutnya dikelola tim ARTIC lewat admin (tab Partner).
  const home = await db.all(sql`SELECT id FROM \`home_page\` LIMIT 1`)
  if (home.length > 0) {
    const homeId = (home[0] as { id: number }).id
    await db.run(sql`INSERT INTO \`home_page_partners_items\` (\`_order\`, \`_parent_id\`, \`id\`, \`name\`) VALUES (1, ${homeId}, lower(hex(randomblob(12))), 'Avenzel Hotel and Convention Cibubur')`)
    await db.run(sql`INSERT INTO \`home_page_partners_items\` (\`_order\`, \`_parent_id\`, \`id\`, \`name\`) VALUES (2, ${homeId}, lower(hex(randomblob(12))), 'Batavia Hotel & Apartments')`)
    await db.run(sql`INSERT INTO \`home_page_partners_items\` (\`_order\`, \`_parent_id\`, \`id\`, \`name\`) VALUES (3, ${homeId}, lower(hex(randomblob(12))), 'PT. JCO Donut & Coffee')`)
    await db.run(sql`INSERT INTO \`home_page_partners_items\` (\`_order\`, \`_parent_id\`, \`id\`, \`name\`) VALUES (4, ${homeId}, lower(hex(randomblob(12))), 'Rumah Sakit Medistra')`)
    await db.run(sql`INSERT INTO \`home_page_partners_items\` (\`_order\`, \`_parent_id\`, \`id\`, \`name\`) VALUES (5, ${homeId}, lower(hex(randomblob(12))), 'Sekolah Internasional Kinderfield')`)
    await db.run(sql`INSERT INTO \`home_page_partners_items\` (\`_order\`, \`_parent_id\`, \`id\`, \`name\`) VALUES (6, ${homeId}, lower(hex(randomblob(12))), 'Cafe Langit Seduh')`)
    await db.run(sql`UPDATE \`home_page_locales\` SET \`partners_eyebrow\` = 'Dipercaya oleh', \`partners_title\` = 'Partner Kami' WHERE \`_locale\` = 'id'`)
    await db.run(sql`UPDATE \`home_page_locales\` SET \`partners_eyebrow\` = 'Trusted by', \`partners_title\` = 'Our Partners' WHERE \`_locale\` = 'en'`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`home_page_partners_items\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_partners_items\`;`)
  await db.run(sql`ALTER TABLE \`home_page_locales\` DROP COLUMN \`partners_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`home_page_locales\` DROP COLUMN \`partners_title\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v_locales\` DROP COLUMN \`version_partners_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`_home_page_v_locales\` DROP COLUMN \`version_partners_title\`;`)
}
