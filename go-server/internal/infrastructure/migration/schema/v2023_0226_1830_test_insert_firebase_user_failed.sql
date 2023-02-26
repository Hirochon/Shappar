-- +migrate Up
insert into `firebase_user` (`id`, `uid`, `email`)
values
    ('01GT6H9318C8HW8BCGAK0XERWA', 'testUID2', 'testUID2@exmaple.com')
;
insert into `firebase_token_verify` (`firebase_user_id`, `uid`, `email`, `verified_time`)
values
    ('01GT6H9318BAD9SCRCGM7JDW5D', 'testUID1', 'testUID1@example.com', '2023-01-01 00:00:00.000000')
;

-- +migrate Down
delete from `firebase_user` where `id` in ('01GT6H9318C8HW8BCGAK0XERWA');
delete from `firebase_token_verify` where `firebase_user_id` in ('01GT6H9318BAD9SCRCGM7JDW5D');
