CREATE TABLE prs (
  repo TEXT ENCODING DICT,
  actor TEXT ENCODING DICT,
  org TEXT ENCODING DICT,
  created_at TIMESTAMP NOT NULL ENCODING FIXED(32),
  lang TEXT ENCODING DICT(16),
  merged BOOLEAN,
  comments SMALLINT,
  review_comments SMALLINT,
  commits SMALLINT,
  additions INTEGER,
  deletions INTEGER,
  changed_files INTEGER
)  WITH (FRAGMENT_SIZE=5000000);
COPY prs FROM '/data/prs.csv' WITH (delimiter=',');
