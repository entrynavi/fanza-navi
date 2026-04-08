-- Price history tracking
CREATE TABLE IF NOT EXISTS price_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_id TEXT NOT NULL,
  title TEXT NOT NULL,
  price INTEGER NOT NULL,
  sale_price INTEGER,
  discount_pct INTEGER DEFAULT 0,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(content_id, recorded_at)
);
CREATE INDEX IF NOT EXISTS idx_price_content ON price_history(content_id);
CREATE INDEX IF NOT EXISTS idx_price_date ON price_history(recorded_at);

-- Push notification subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  favorites TEXT DEFAULT '[]',  -- JSON array of content_ids
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- User votes for community ranking
CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_id TEXT NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  voter_hash TEXT NOT NULL,  -- hash of IP+UA for dedup
  voted_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(content_id, voter_hash)
);
CREATE INDEX IF NOT EXISTS idx_votes_content ON votes(content_id);
CREATE INDEX IF NOT EXISTS idx_votes_month ON votes(voted_at);

-- Sale alerts log (for bot)
CREATE TABLE IF NOT EXISTS sale_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_id TEXT NOT NULL,
  title TEXT NOT NULL,
  discount_pct INTEGER NOT NULL,
  alerted_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(content_id, alerted_at)
);
