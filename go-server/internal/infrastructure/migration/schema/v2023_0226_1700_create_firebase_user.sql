-- +migrate Up
create table `firebase_user` (
  `id` char(26) not null unique comment 'Firebaseユーザーの一意な識別子ULID',
  `uid` varchar(36) not null unique comment 'FirebaseのユーザーID',
  `email` varchar(100) not null unique comment 'Firebaseユーザーのメールアドレス',
  primary key (`id`),
  index `idx__uid` (`uid`),
  index `idx__email` (`email`)
) engine=InnoDB default charset=utf8mb4 comment 'リソース: サービスに接続しているFirebaseユーザー';

create table `firebase_token_verify` (
  `firebase_user_id` char(26) not null comment 'Firebaseユーザーの一意な識別子ULID',
  `uid` varchar(36) not null comment 'FirebaseのユーザーID',
  `email` varchar(100) not null comment 'Firebaseユーザーのメールアドレス',
  `verified_time` datetime(6) not null comment 'Firebaseトークンの確認日時',
  primary key (`firebase_user_id`, `verified_time`),
  key `idx__firebase_user_id` (`firebase_user_id`),
  key `idx__uid` (`uid`),
  key `idx__email` (`email`),
  key `idx__verified_time` (`verified_time`)
) engine=InnoDB default charset=utf8mb4 comment 'イベント: Firebaseトークンの確認';

-- +migrate Down
drop table `firebase_user`;
drop table `firebase_token_verify`;
