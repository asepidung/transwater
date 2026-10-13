import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_certifications\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_certifications_order_idx\` ON \`_site_settings_v_version_certifications\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_certifications_parent_id_idx\` ON \`_site_settings_v_version_certifications\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_certifications_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v_version_certifications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_site_settings_v_version_certifications_locales_locale_paren\` ON \`_site_settings_v_version_certifications_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_company_name\` text DEFAULT 'PT. Transwater Roberi Indonesia',
  	\`version_brand_name\` text DEFAULT 'ARTIC',
  	\`version_maps_url\` text,
  	\`version_phone\` text,
  	\`version_email\` text,
  	\`version_hours\` text,
  	\`version_instagram_url\` text,
  	\`version_whatsapp\` text,
  	\`version_show_developer_credit\` integer DEFAULT true,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_version__status_idx\` ON \`_site_settings_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_created_at_idx\` ON \`_site_settings_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_updated_at_idx\` ON \`_site_settings_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_snapshot_idx\` ON \`_site_settings_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_published_locale_idx\` ON \`_site_settings_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_latest_idx\` ON \`_site_settings_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_locales\` (
  	\`version_address\` text,
  	\`version_footer_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_site_settings_v_locales_locale_parent_id_unique\` ON \`_site_settings_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_hero_facts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_hero_facts_order_idx\` ON \`_home_page_v_version_hero_facts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_hero_facts_parent_id_idx\` ON \`_home_page_v_version_hero_facts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_hero_facts_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v_version_hero_facts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_home_page_v_version_hero_facts_locales_locale_parent_id_uni\` ON \`_home_page_v_version_hero_facts_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_trust_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_trust_items_order_idx\` ON \`_home_page_v_version_trust_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_trust_items_parent_id_idx\` ON \`_home_page_v_version_trust_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_trust_items_locales\` (
  	\`status\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v_version_trust_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_home_page_v_version_trust_items_locales_locale_parent_id_un\` ON \`_home_page_v_version_trust_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_benefits_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text DEFAULT 'package',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_benefits_items_order_idx\` ON \`_home_page_v_version_benefits_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_benefits_items_parent_id_idx\` ON \`_home_page_v_version_benefits_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_benefits_items_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v_version_benefits_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_home_page_v_version_benefits_items_locales_locale_parent_id\` ON \`_home_page_v_version_benefits_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_segments_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_segments_items_order_idx\` ON \`_home_page_v_version_segments_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_segments_items_parent_id_idx\` ON \`_home_page_v_version_segments_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_segments_items_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v_version_segments_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_home_page_v_version_segments_items_locales_locale_parent_id\` ON \`_home_page_v_version_segments_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_process_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_process_steps_order_idx\` ON \`_home_page_v_version_process_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_process_steps_parent_id_idx\` ON \`_home_page_v_version_process_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_process_steps_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v_version_process_steps\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_home_page_v_version_process_steps_locales_locale_parent_id_\` ON \`_home_page_v_version_process_steps_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_style\` text DEFAULT 'banner',
  	\`version_video_section_enabled\` integer DEFAULT true,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_version__status_idx\` ON \`_home_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_created_at_idx\` ON \`_home_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_updated_at_idx\` ON \`_home_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_snapshot_idx\` ON \`_home_page_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_published_locale_idx\` ON \`_home_page_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_latest_idx\` ON \`_home_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_locales\` (
  	\`version_hero_eyebrow\` text,
  	\`version_hero_title\` text,
  	\`version_hero_description\` text,
  	\`version_video_section_eyebrow\` text,
  	\`version_video_section_title\` text,
  	\`version_video_section_text\` text,
  	\`version_trust_title\` text,
  	\`version_products_section_eyebrow\` text,
  	\`version_products_section_title\` text,
  	\`version_products_section_description\` text,
  	\`version_benefits_eyebrow\` text,
  	\`version_benefits_title\` text,
  	\`version_segments_eyebrow\` text,
  	\`version_segments_title\` text,
  	\`version_process_eyebrow\` text,
  	\`version_process_title\` text,
  	\`version_quote_eyebrow\` text,
  	\`version_quote_title\` text,
  	\`version_quote_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_home_page_v_locales_locale_parent_id_unique\` ON \`_home_page_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_about_story\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_about_story_order_idx\` ON \`_about_page_v_version_about_story\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_about_story_parent_id_idx\` ON \`_about_page_v_version_about_story\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_about_story_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v_version_about_story\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_about_page_v_version_about_story_locales_locale_parent_id_u\` ON \`_about_page_v_version_about_story_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_about_expertise\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_about_expertise_order_idx\` ON \`_about_page_v_version_about_expertise\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_about_expertise_parent_id_idx\` ON \`_about_page_v_version_about_expertise\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_about_expertise_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v_version_about_expertise\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_about_page_v_version_about_expertise_locales_locale_parent_\` ON \`_about_page_v_version_about_expertise_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_about_values\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_about_values_order_idx\` ON \`_about_page_v_version_about_values\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_about_values_parent_id_idx\` ON \`_about_page_v_version_about_values\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_version_about_values_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v_version_about_values\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_about_page_v_version_about_values_locales_locale_parent_id_\` ON \`_about_page_v_version_about_values_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_about_page_v_version_version__status_idx\` ON \`_about_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_created_at_idx\` ON \`_about_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_updated_at_idx\` ON \`_about_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_snapshot_idx\` ON \`_about_page_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_published_locale_idx\` ON \`_about_page_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_about_page_v_latest_idx\` ON \`_about_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_about_page_v_locales\` (
  	\`version_about_eyebrow\` text,
  	\`version_about_title\` text,
  	\`version_about_description\` text,
  	\`version_about_story_title\` text,
  	\`version_about_expertise_title\` text,
  	\`version_about_vision_title\` text,
  	\`version_about_vision\` text,
  	\`version_about_mission_title\` text,
  	\`version_about_mission\` text,
  	\`version_about_values_title\` text,
  	\`version_about_legal_title\` text,
  	\`version_about_cta_title\` text,
  	\`version_about_cta_text\` text,
  	\`version_contact_title\` text,
  	\`version_contact_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_about_page_v_locales_locale_parent_id_unique\` ON \`_about_page_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_info_pages_v_version_quality_pillars\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_info_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_info_pages_v_version_quality_pillars_order_idx\` ON \`_info_pages_v_version_quality_pillars\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_info_pages_v_version_quality_pillars_parent_id_idx\` ON \`_info_pages_v_version_quality_pillars\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_info_pages_v_version_quality_pillars_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_info_pages_v_version_quality_pillars\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_info_pages_v_version_quality_pillars_locales_locale_parent_\` ON \`_info_pages_v_version_quality_pillars_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_info_pages_v_version_order_page_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_info_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_info_pages_v_version_order_page_faqs_order_idx\` ON \`_info_pages_v_version_order_page_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_info_pages_v_version_order_page_faqs_parent_id_idx\` ON \`_info_pages_v_version_order_page_faqs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_info_pages_v_version_order_page_faqs_locales\` (
  	\`q\` text,
  	\`a\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_info_pages_v_version_order_page_faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_info_pages_v_version_order_page_faqs_locales_locale_parent_\` ON \`_info_pages_v_version_order_page_faqs_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_info_pages_v_version_privacy_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_info_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_info_pages_v_version_privacy_sections_order_idx\` ON \`_info_pages_v_version_privacy_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_info_pages_v_version_privacy_sections_parent_id_idx\` ON \`_info_pages_v_version_privacy_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_info_pages_v_version_privacy_sections_locales\` (
  	\`title\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_info_pages_v_version_privacy_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_info_pages_v_version_privacy_sections_locales_locale_parent\` ON \`_info_pages_v_version_privacy_sections_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_info_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_info_pages_v_version_version__status_idx\` ON \`_info_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_info_pages_v_created_at_idx\` ON \`_info_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_info_pages_v_updated_at_idx\` ON \`_info_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_info_pages_v_snapshot_idx\` ON \`_info_pages_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_info_pages_v_published_locale_idx\` ON \`_info_pages_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_info_pages_v_latest_idx\` ON \`_info_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_info_pages_v_locales\` (
  	\`version_quality_eyebrow\` text,
  	\`version_quality_title\` text,
  	\`version_quality_description\` text,
  	\`version_quality_pillars_title\` text,
  	\`version_quality_legal_title\` text,
  	\`version_quality_legal_note\` text,
  	\`version_quality_cta_title\` text,
  	\`version_quality_cta_text\` text,
  	\`version_order_page_eyebrow\` text,
  	\`version_order_page_title\` text,
  	\`version_order_page_description\` text,
  	\`version_order_page_faq_title\` text,
  	\`version_order_page_cta_title\` text,
  	\`version_order_page_cta_text\` text,
  	\`version_privacy_title\` text,
  	\`version_privacy_updated\` text,
  	\`version_privacy_intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_info_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_info_pages_v_locales_locale_parent_id_unique\` ON \`_info_pages_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  // Tabel global yang sudah ada hanya ditambah kolom status (tidak dibuat ulang: DROP TABLE + cascade menghapus isi tabel anak).
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(sql`CREATE INDEX \`site_settings__status_idx\` ON \`site_settings\` (\`_status\`);`)
  await db.run(sql`UPDATE \`site_settings\` SET \`_status\` = 'published';`)
  await db.run(sql`ALTER TABLE \`home_page\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(sql`CREATE INDEX \`home_page__status_idx\` ON \`home_page\` (\`_status\`);`)
  await db.run(sql`ALTER TABLE \`about_page\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(sql`CREATE INDEX \`about_page__status_idx\` ON \`about_page\` (\`_status\`);`)
  await db.run(sql`ALTER TABLE \`info_pages\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(sql`UPDATE \`home_page\` SET \`_status\` = 'published';`)
  await db.run(sql`UPDATE \`about_page\` SET \`_status\` = 'published';`)
  await db.run(sql`UPDATE \`info_pages\` SET \`_status\` = 'published';`)
  await db.run(sql`CREATE INDEX \`info_pages__status_idx\` ON \`info_pages\` (\`_status\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_site_settings_v_version_certifications\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_certifications_locales\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_hero_facts\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_hero_facts_locales\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_trust_items\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_trust_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_benefits_items\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_benefits_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_segments_items\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_segments_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_process_steps\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_process_steps_locales\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_about_story\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_about_story_locales\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_about_expertise\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_about_expertise_locales\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_about_values\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_version_about_values_locales\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v\`;`)
  await db.run(sql`DROP TABLE \`_about_page_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_info_pages_v_version_quality_pillars\`;`)
  await db.run(sql`DROP TABLE \`_info_pages_v_version_quality_pillars_locales\`;`)
  await db.run(sql`DROP TABLE \`_info_pages_v_version_order_page_faqs\`;`)
  await db.run(sql`DROP TABLE \`_info_pages_v_version_order_page_faqs_locales\`;`)
  await db.run(sql`DROP TABLE \`_info_pages_v_version_privacy_sections\`;`)
  await db.run(sql`DROP TABLE \`_info_pages_v_version_privacy_sections_locales\`;`)
  await db.run(sql`DROP TABLE \`_info_pages_v\`;`)
  await db.run(sql`DROP TABLE \`_info_pages_v_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`company_name\` text DEFAULT 'PT. Transwater Roberi Indonesia' NOT NULL,
  	\`brand_name\` text DEFAULT 'ARTIC' NOT NULL,
  	\`maps_url\` text,
  	\`phone\` text,
  	\`email\` text,
  	\`hours\` text,
  	\`instagram_url\` text,
  	\`whatsapp\` text,
  	\`show_developer_credit\` integer DEFAULT true,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings\`("id", "company_name", "brand_name", "maps_url", "phone", "email", "hours", "instagram_url", "whatsapp", "show_developer_credit", "updated_at", "created_at") SELECT "id", "company_name", "brand_name", "maps_url", "phone", "email", "hours", "instagram_url", "whatsapp", "show_developer_credit", "updated_at", "created_at" FROM \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings\` RENAME TO \`site_settings\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`DROP INDEX \`home_page__status_idx\`;`)
  await db.run(sql`ALTER TABLE \`home_page\` DROP COLUMN \`_status\`;`)
  await db.run(sql`DROP INDEX \`about_page__status_idx\`;`)
  await db.run(sql`ALTER TABLE \`about_page\` DROP COLUMN \`_status\`;`)
  await db.run(sql`DROP INDEX \`info_pages__status_idx\`;`)
  await db.run(sql`ALTER TABLE \`info_pages\` DROP COLUMN \`_status\`;`)
  await db.run(sql`CREATE TABLE \`__new_site_settings_certifications_locales\` (
  	\`text\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings_certifications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings_certifications_locales\`("text", "id", "_locale", "_parent_id") SELECT "text", "id", "_locale", "_parent_id" FROM \`site_settings_certifications_locales\`;`)
  await db.run(sql`DROP TABLE \`site_settings_certifications_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings_certifications_locales\` RENAME TO \`site_settings_certifications_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`site_settings_certifications_locales_locale_parent_id_unique\` ON \`site_settings_certifications_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_site_settings_locales\` (
  	\`address\` text NOT NULL,
  	\`footer_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings_locales\`("address", "footer_description", "id", "_locale", "_parent_id") SELECT "address", "footer_description", "id", "_locale", "_parent_id" FROM \`site_settings_locales\`;`)
  await db.run(sql`DROP TABLE \`site_settings_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings_locales\` RENAME TO \`site_settings_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`site_settings_locales_locale_parent_id_unique\` ON \`site_settings_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_hero_facts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_hero_facts\`("_order", "_parent_id", "id", "value") SELECT "_order", "_parent_id", "id", "value" FROM \`home_page_hero_facts\`;`)
  await db.run(sql`DROP TABLE \`home_page_hero_facts\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_hero_facts\` RENAME TO \`home_page_hero_facts\`;`)
  await db.run(sql`CREATE INDEX \`home_page_hero_facts_order_idx\` ON \`home_page_hero_facts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_hero_facts_parent_id_idx\` ON \`home_page_hero_facts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_hero_facts_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page_hero_facts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_hero_facts_locales\`("label", "id", "_locale", "_parent_id") SELECT "label", "id", "_locale", "_parent_id" FROM \`home_page_hero_facts_locales\`;`)
  await db.run(sql`DROP TABLE \`home_page_hero_facts_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_hero_facts_locales\` RENAME TO \`home_page_hero_facts_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`home_page_hero_facts_locales_locale_parent_id_unique\` ON \`home_page_hero_facts_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_trust_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_trust_items\`("_order", "_parent_id", "id", "label") SELECT "_order", "_parent_id", "id", "label" FROM \`home_page_trust_items\`;`)
  await db.run(sql`DROP TABLE \`home_page_trust_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_trust_items\` RENAME TO \`home_page_trust_items\`;`)
  await db.run(sql`CREATE INDEX \`home_page_trust_items_order_idx\` ON \`home_page_trust_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_trust_items_parent_id_idx\` ON \`home_page_trust_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_trust_items_locales\` (
  	\`status\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page_trust_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_trust_items_locales\`("status", "id", "_locale", "_parent_id") SELECT "status", "id", "_locale", "_parent_id" FROM \`home_page_trust_items_locales\`;`)
  await db.run(sql`DROP TABLE \`home_page_trust_items_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_trust_items_locales\` RENAME TO \`home_page_trust_items_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`home_page_trust_items_locales_locale_parent_id_unique\` ON \`home_page_trust_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_benefits_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text DEFAULT 'package' NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_benefits_items\`("_order", "_parent_id", "id", "icon") SELECT "_order", "_parent_id", "id", "icon" FROM \`home_page_benefits_items\`;`)
  await db.run(sql`DROP TABLE \`home_page_benefits_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_benefits_items\` RENAME TO \`home_page_benefits_items\`;`)
  await db.run(sql`CREATE INDEX \`home_page_benefits_items_order_idx\` ON \`home_page_benefits_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_benefits_items_parent_id_idx\` ON \`home_page_benefits_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_benefits_items_locales\` (
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page_benefits_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_benefits_items_locales\`("title", "text", "id", "_locale", "_parent_id") SELECT "title", "text", "id", "_locale", "_parent_id" FROM \`home_page_benefits_items_locales\`;`)
  await db.run(sql`DROP TABLE \`home_page_benefits_items_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_benefits_items_locales\` RENAME TO \`home_page_benefits_items_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`home_page_benefits_items_locales_locale_parent_id_unique\` ON \`home_page_benefits_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_segments_items_locales\` (
  	\`text\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page_segments_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_segments_items_locales\`("text", "id", "_locale", "_parent_id") SELECT "text", "id", "_locale", "_parent_id" FROM \`home_page_segments_items_locales\`;`)
  await db.run(sql`DROP TABLE \`home_page_segments_items_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_segments_items_locales\` RENAME TO \`home_page_segments_items_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`home_page_segments_items_locales_locale_parent_id_unique\` ON \`home_page_segments_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_process_steps_locales\` (
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page_process_steps\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_process_steps_locales\`("title", "text", "id", "_locale", "_parent_id") SELECT "title", "text", "id", "_locale", "_parent_id" FROM \`home_page_process_steps_locales\`;`)
  await db.run(sql`DROP TABLE \`home_page_process_steps_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_process_steps_locales\` RENAME TO \`home_page_process_steps_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`home_page_process_steps_locales_locale_parent_id_unique\` ON \`home_page_process_steps_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_locales\` (
  	\`hero_eyebrow\` text,
  	\`hero_title\` text NOT NULL,
  	\`hero_description\` text,
  	\`video_section_eyebrow\` text,
  	\`video_section_title\` text,
  	\`video_section_text\` text,
  	\`trust_title\` text,
  	\`products_section_eyebrow\` text,
  	\`products_section_title\` text,
  	\`products_section_description\` text,
  	\`benefits_eyebrow\` text,
  	\`benefits_title\` text,
  	\`segments_eyebrow\` text,
  	\`segments_title\` text,
  	\`process_eyebrow\` text,
  	\`process_title\` text,
  	\`quote_eyebrow\` text,
  	\`quote_title\` text,
  	\`quote_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_locales\`("hero_eyebrow", "hero_title", "hero_description", "video_section_eyebrow", "video_section_title", "video_section_text", "trust_title", "products_section_eyebrow", "products_section_title", "products_section_description", "benefits_eyebrow", "benefits_title", "segments_eyebrow", "segments_title", "process_eyebrow", "process_title", "quote_eyebrow", "quote_title", "quote_description", "id", "_locale", "_parent_id") SELECT "hero_eyebrow", "hero_title", "hero_description", "video_section_eyebrow", "video_section_title", "video_section_text", "trust_title", "products_section_eyebrow", "products_section_title", "products_section_description", "benefits_eyebrow", "benefits_title", "segments_eyebrow", "segments_title", "process_eyebrow", "process_title", "quote_eyebrow", "quote_title", "quote_description", "id", "_locale", "_parent_id" FROM \`home_page_locales\`;`)
  await db.run(sql`DROP TABLE \`home_page_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_locales\` RENAME TO \`home_page_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`home_page_locales_locale_parent_id_unique\` ON \`home_page_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_about_page_about_story_locales\` (
  	\`text\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page_about_story\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_about_page_about_story_locales\`("text", "id", "_locale", "_parent_id") SELECT "text", "id", "_locale", "_parent_id" FROM \`about_page_about_story_locales\`;`)
  await db.run(sql`DROP TABLE \`about_page_about_story_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_about_page_about_story_locales\` RENAME TO \`about_page_about_story_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`about_page_about_story_locales_locale_parent_id_unique\` ON \`about_page_about_story_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_about_page_about_expertise_locales\` (
  	\`text\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page_about_expertise\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_about_page_about_expertise_locales\`("text", "id", "_locale", "_parent_id") SELECT "text", "id", "_locale", "_parent_id" FROM \`about_page_about_expertise_locales\`;`)
  await db.run(sql`DROP TABLE \`about_page_about_expertise_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_about_page_about_expertise_locales\` RENAME TO \`about_page_about_expertise_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`about_page_about_expertise_locales_locale_parent_id_unique\` ON \`about_page_about_expertise_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_about_page_about_values_locales\` (
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_page_about_values\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_about_page_about_values_locales\`("title", "text", "id", "_locale", "_parent_id") SELECT "title", "text", "id", "_locale", "_parent_id" FROM \`about_page_about_values_locales\`;`)
  await db.run(sql`DROP TABLE \`about_page_about_values_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_about_page_about_values_locales\` RENAME TO \`about_page_about_values_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`about_page_about_values_locales_locale_parent_id_unique\` ON \`about_page_about_values_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_info_pages_quality_pillars_locales\` (
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`info_pages_quality_pillars\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_info_pages_quality_pillars_locales\`("title", "text", "id", "_locale", "_parent_id") SELECT "title", "text", "id", "_locale", "_parent_id" FROM \`info_pages_quality_pillars_locales\`;`)
  await db.run(sql`DROP TABLE \`info_pages_quality_pillars_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_info_pages_quality_pillars_locales\` RENAME TO \`info_pages_quality_pillars_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`info_pages_quality_pillars_locales_locale_parent_id_unique\` ON \`info_pages_quality_pillars_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_info_pages_order_page_faqs_locales\` (
  	\`q\` text NOT NULL,
  	\`a\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`info_pages_order_page_faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_info_pages_order_page_faqs_locales\`("q", "a", "id", "_locale", "_parent_id") SELECT "q", "a", "id", "_locale", "_parent_id" FROM \`info_pages_order_page_faqs_locales\`;`)
  await db.run(sql`DROP TABLE \`info_pages_order_page_faqs_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_info_pages_order_page_faqs_locales\` RENAME TO \`info_pages_order_page_faqs_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`info_pages_order_page_faqs_locales_locale_parent_id_unique\` ON \`info_pages_order_page_faqs_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_info_pages_privacy_sections_locales\` (
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`info_pages_privacy_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_info_pages_privacy_sections_locales\`("title", "text", "id", "_locale", "_parent_id") SELECT "title", "text", "id", "_locale", "_parent_id" FROM \`info_pages_privacy_sections_locales\`;`)
  await db.run(sql`DROP TABLE \`info_pages_privacy_sections_locales\`;`)
  await db.run(sql`ALTER TABLE \`__new_info_pages_privacy_sections_locales\` RENAME TO \`info_pages_privacy_sections_locales\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`info_pages_privacy_sections_locales_locale_parent_id_unique\` ON \`info_pages_privacy_sections_locales\` (\`_locale\`,\`_parent_id\`);`)
}
