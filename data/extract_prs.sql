SELECT
  repo.name as name,
  actor.login as user,
  org.login as org,
  created_at,
  JSON_EXTRACT_SCALAR(payload, '$.pull_request.base.repo.language') AS lang,
  JSON_EXTRACT_SCALAR(payload, '$.pull_request.merged') AS merged,
  JSON_EXTRACT_SCALAR(payload, '$.pull_request.comments') AS comments,
  JSON_EXTRACT_SCALAR(payload, '$.pull_request.review_comments') AS review_comments,
  JSON_EXTRACT_SCALAR(payload, '$.pull_request.commits') AS commits,
  JSON_EXTRACT_SCALAR(payload, '$.pull_request.additions') AS additions,
  JSON_EXTRACT_SCALAR(payload, '$.pull_request.deletions') AS deletions,
  JSON_EXTRACT_SCALAR(payload, '$.pull_request.changed_files') AS changed_files
FROM `githubarchive.year.*`
WHERE
  type='PullRequestEvent'
  AND _TABLE_SUFFIX BETWEEN '2012' and '2016'


SELECT
  repo.name as name,
  actor.login as user,
  org.login as org,
  created_at,
  JSON_EXTRACT_SCALAR(payload, '$.pull_request.base.repo.language') AS lang,
  JSON_EXTRACT_SCALAR(payload, '$.pull_request.merged') AS merged,
  JSON_EXTRACT_SCALAR(payload, '$.pull_request.comments') AS comments,
  JSON_EXTRACT_SCALAR(payload, '$.pull_request.review_comments') AS review_comments,
  JSON_EXTRACT_SCALAR(payload, '$.pull_request.commits') AS commits,
  JSON_EXTRACT_SCALAR(payload, '$.pull_request.additions') AS additions,
  JSON_EXTRACT_SCALAR(payload, '$.pull_request.deletions') AS deletions,
  JSON_EXTRACT_SCALAR(payload, '$.pull_request.changed_files') AS changed_files
FROM `githubarchive.month.*`
WHERE
  type='PullRequestEvent'
  AND _TABLE_SUFFIX BETWEEN '201701' and '201706'
