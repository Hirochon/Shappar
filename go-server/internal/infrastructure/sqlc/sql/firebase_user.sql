-- name: CreateFirebaseUser :exec
INSERT INTO `firebase_user` (`id`, `uid`, `email`)
VALUES (?, ?, ?)
;

-- name: CreateFirebaseTokenVerify :exec
INSERT INTO `firebase_token_verify` (`firebase_user_id`, `uid`, `email`, `verified_time`)
VALUES (?, ?, ?, ?)
;
