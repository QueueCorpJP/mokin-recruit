-- Fix signup_verification_codes table by adding unique constraint on email
-- This fixes the "there is no unique or exclusion constraint matching the ON CONFLICT specification" error

-- Add unique constraint on email column
ALTER TABLE public.signup_verification_codes
ADD CONSTRAINT signup_verification_codes_email_unique UNIQUE (email);

-- Create index on email for performance
CREATE INDEX IF NOT EXISTS idx_signup_verification_codes_email
ON public.signup_verification_codes(email);

-- Create index on expires_at for cleanup purposes
CREATE INDEX IF NOT EXISTS idx_signup_verification_codes_expires_at
ON public.signup_verification_codes(expires_at);