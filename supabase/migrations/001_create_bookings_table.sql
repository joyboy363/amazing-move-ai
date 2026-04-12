-- Create bookings table to persist all service booking submissions
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  pickup_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  move_date DATE NOT NULL,
  home_size TEXT,
  additional_services TEXT[],
  cal_booking_uid TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from the website booking form)
CREATE POLICY "Allow anonymous booking inserts"
  ON public.bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service_role full access (used by Edge Functions)
CREATE POLICY "Allow service role full access"
  ON public.bookings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to read all bookings (for admin dashboard)
CREATE POLICY "Allow authenticated reads"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (true);
