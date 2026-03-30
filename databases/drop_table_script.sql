begin ;
    drop table auth_otp cascade;
    drop table refresh_tokens cascade;
    drop table role_permissions cascade;
    drop table post_reservations cascade;
    drop table user_profile cascade;
    drop table users cascade;
    drop table roles cascade;
    drop table castes cascade;
    drop table genders cascade;
    drop table posts cascade;
    drop table departments cascade;
    drop table permissions cascade;

    drop table districts cascade;
    drop table zp cascade;
commit;