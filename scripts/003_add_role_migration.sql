-- Migration script to add role column to existing profiles table
-- Run this if you already have a profiles table without the role column

-- Add role column to profiles table if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role text default 'user' check (role in ('user', 'admin'));

-- Update existing profiles to have 'user' role if they don't have one
UPDATE public.profiles
SET role = 'user'
WHERE role IS NULL;

-- Optional: Make a specific user admin (replace with actual user ID)
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'your-user-id-here';