-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (subscribe)
CREATE POLICY "newsletter_insert_anyone"
  ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated users can view subscribers
CREATE POLICY "newsletter_select_authenticated"
  ON public.newsletter_subscribers
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email 
  ON public.newsletter_subscribers(email);
