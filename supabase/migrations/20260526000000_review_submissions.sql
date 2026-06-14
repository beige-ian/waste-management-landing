CREATE TABLE IF NOT EXISTS review_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  phone TEXT NOT NULL,
  channel TEXT NOT NULL,
  channel_type TEXT NOT NULL DEFAULT 'url_or_screenshot',
  post_url TEXT,
  canonical_url TEXT,
  screenshot_urls JSONB NOT NULL DEFAULT '[]',
  account_name TEXT,
  content_author_id TEXT,
  content_author_handle TEXT,
  posted_at TIMESTAMPTZ,
  content_summary TEXT NOT NULL DEFAULT '',
  extracted_text TEXT,
  ocr_text TEXT,
  url_fetch_status TEXT NOT NULL DEFAULT 'not_fetched',
  fetched_title TEXT,
  content_fingerprint TEXT,
  screenshot_phashes JSONB NOT NULL DEFAULT '[]',
  duplicate_candidates JSONB NOT NULL DEFAULT '[]',
  reward_disclosure_confirmed BOOLEAN NOT NULL DEFAULT false,
  privacy_confirmed BOOLEAN NOT NULL DEFAULT false,
  ai_recommendation TEXT NOT NULL DEFAULT 'hold',
  ai_confidence NUMERIC(4, 3) NOT NULL DEFAULT 0,
  ai_reason_codes JSONB NOT NULL DEFAULT '[]',
  ai_checks JSONB NOT NULL DEFAULT '{}',
  ai_evidence_summary TEXT NOT NULL DEFAULT '',
  ai_operator_next_action TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  operator_decision TEXT NOT NULL DEFAULT 'pending',
  coupon_grant_status TEXT NOT NULL DEFAULT 'not_decided',
  coupon_amount INTEGER NOT NULL DEFAULT 2500,
  reject_reason TEXT,
  admin_memo TEXT NOT NULL DEFAULT '',
  reviewer_email TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT review_submissions_status_check CHECK (
    status IN ('pending', 'approved', 'rejected', 'hold')
  ),
  CONSTRAINT review_submissions_operator_decision_check CHECK (
    operator_decision IN ('pending', 'approved', 'rejected', 'hold')
  ),
  CONSTRAINT review_submissions_coupon_grant_status_check CHECK (
    coupon_grant_status IN ('not_decided', 'eligible', 'hold', 'excluded', 'issued')
  ),
  CONSTRAINT review_submissions_channel_type_check CHECK (
    channel_type IN ('url', 'screenshot', 'url_and_screenshot', 'url_or_screenshot')
  ),
  CONSTRAINT review_submissions_url_fetch_status_check CHECK (
    url_fetch_status IN ('not_fetched', 'ok', 'inaccessible', 'login_required', 'deleted', 'error')
  ),
  CONSTRAINT review_submissions_ai_recommendation_check CHECK (
    ai_recommendation IN ('approve', 'hold', 'reject')
  ),
  CONSTRAINT review_submissions_evidence_check CHECK (
    post_url IS NOT NULL OR jsonb_array_length(screenshot_urls) > 0
  )
);

ALTER TABLE review_submissions
  ADD COLUMN IF NOT EXISTS operator_decision TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS coupon_grant_status TEXT NOT NULL DEFAULT 'not_decided';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'review_submissions_operator_decision_check'
  ) THEN
    ALTER TABLE review_submissions
      ADD CONSTRAINT review_submissions_operator_decision_check CHECK (
        operator_decision IN ('pending', 'approved', 'rejected', 'hold')
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'review_submissions_coupon_grant_status_check'
  ) THEN
    ALTER TABLE review_submissions
      ADD CONSTRAINT review_submissions_coupon_grant_status_check CHECK (
        coupon_grant_status IN ('not_decided', 'eligible', 'hold', 'excluded', 'issued')
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_review_submissions_booking_id ON review_submissions(booking_id);
CREATE INDEX IF NOT EXISTS idx_review_submissions_phone ON review_submissions(phone);
CREATE INDEX IF NOT EXISTS idx_review_submissions_status ON review_submissions(status);
CREATE INDEX IF NOT EXISTS idx_review_submissions_operator_decision
  ON review_submissions(operator_decision);
CREATE INDEX IF NOT EXISTS idx_review_submissions_coupon_grant_status
  ON review_submissions(coupon_grant_status);
CREATE INDEX IF NOT EXISTS idx_review_submissions_channel ON review_submissions(channel);
CREATE INDEX IF NOT EXISTS idx_review_submissions_created_at ON review_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_submissions_content_author
  ON review_submissions(channel, content_author_handle);
CREATE UNIQUE INDEX IF NOT EXISTS idx_review_submissions_unique_post_url
  ON review_submissions(post_url)
  WHERE post_url IS NOT NULL;

ALTER TABLE review_submissions ENABLE ROW LEVEL SECURITY;
