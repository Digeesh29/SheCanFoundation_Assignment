CREATE TABLE IF NOT EXISTS she_can_contacts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    message     TEXT NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_she_can_contacts_email ON she_can_contacts(email);

CREATE INDEX IF NOT EXISTS idx_she_can_contacts_submitted_at ON she_can_contacts(submitted_at DESC);

ALTER TABLE she_can_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON she_can_contacts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can read" ON she_can_contacts
    FOR SELECT USING (auth.role() = 'service_role');
