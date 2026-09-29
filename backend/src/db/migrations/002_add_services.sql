-- Migration 002: Add is_soon to categories and services to tasks

ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_soon BOOLEAN DEFAULT FALSE;

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb;
ALTER TABLE tasks ALTER COLUMN short_description DROP NOT NULL;
