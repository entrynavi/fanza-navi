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

-- Shared user reviews
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_title TEXT NOT NULL,
  product_image_url TEXT DEFAULT '',
  product_affiliate_url TEXT DEFAULT '',
  rating INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  author_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Helpful votes for shared reviews
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  review_id TEXT NOT NULL,
  voter_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(review_id, voter_hash),
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_review_helpful_review ON review_helpful_votes(review_id);

-- Sale alerts log (for bot)
CREATE TABLE IF NOT EXISTS sale_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_id TEXT NOT NULL,
  title TEXT NOT NULL,
  discount_pct INTEGER NOT NULL,
  alerted_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(content_id, alerted_at)
);
