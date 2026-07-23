-- Migration to add email column to profiles table
-- Date: 2026-07-23

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
