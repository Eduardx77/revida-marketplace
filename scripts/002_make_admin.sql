-- Script to grant admin role to a user
-- Replace 'user@example.com' with the actual email of the user you want to make admin

-- First, get the user ID from auth.users (you need to know the email)
-- Then update the profile to set role to 'admin'

-- Example: Make admin@example.com an admin
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'admin@example.com'
-- );

-- To check current admins:
-- SELECT p.id, p.full_name, p.role, u.email
-- FROM public.profiles p
-- JOIN auth.users u ON p.id = u.id
-- WHERE p.role = 'admin';

-- To make yourself admin (replace with your email):
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'hector.rojo271229@potros.itson.edu.mx'
);