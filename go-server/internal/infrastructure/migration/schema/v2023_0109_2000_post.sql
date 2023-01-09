-- +migrate Up
create table `post` (
  `id` char(26) not null unique comment '投稿の一意な識別子ULID',
  primary key (`id`)
) engine=InnoDB default charset=utf8mb4 comment 'リソース: 投稿';

-- +migrate Down
drop table if exists `post`;
