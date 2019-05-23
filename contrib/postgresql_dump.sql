
CREATE ROLE admin;
ALTER ROLE admin WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'md549088b3a87b8ce56ecd39259d17ff834';
CREATE ROLE authenticator;
ALTER ROLE authenticator WITH NOSUPERUSER NOINHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'md502b7df19a04089856a67eb7f1b5a3af2';
CREATE ROLE backend;
ALTER ROLE backend WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE manager;
ALTER ROLE manager WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE web_anon;
ALTER ROLE web_anon WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;


GRANT admin TO authenticator GRANTED BY postgres;
GRANT agents TO authenticator GRANTED BY postgres;
GRANT backend TO authenticator GRANTED BY postgres;
GRANT web_anon TO authenticator GRANTED BY postgres;


ALTER DATABASE vue_postgrest_skel SET "app.jwt_secret" TO 'bkj5craTPn5g1EAQ1TXrMTla5W1S26HV5qsg5XjgkDc=';


CREATE SCHEMA api;
CREATE SCHEMA basic_auth;
CREATE SCHEMA db;


CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA public;
COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


CREATE TYPE basic_auth.jwt_token AS (
	token text
);


CREATE FUNCTION api.login(email text, pass text) RETURNS basic_auth.jwt_token
    LANGUAGE plpgsql
    AS $$
declare
  _role name;
  result basic_auth.jwt_token;
begin
  -- check email and password
  select basic_auth.user_role(email, pass) into _role;
  if _role is null then
    raise invalid_password using message = 'invalid user or password';
  end if;

  select public.sign(
      row_to_json(r), current_setting('app.jwt_secret')
    ) as token
    from (
      select _role as role, login.email as email,
         extract(epoch from now())::integer + 60*60 as exp
    ) r
    into result;
  return result;
end;
$$;


CREATE FUNCTION basic_auth.check_role_exists() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  if not exists (select 1 from pg_roles as r where r.rolname = new.role) then
    raise foreign_key_violation using message =
      'unknown database role: ' || new.role;
    return null;
  end if;
  return new;
end
$$;


CREATE FUNCTION basic_auth.encrypt_pass() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  if tg_op = 'INSERT' or new.pass <> old.pass then
    new.pass = crypt(new.pass, gen_salt('bf'));
  end if;
  return new;
end
$$;


CREATE FUNCTION basic_auth.get_user_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
	_email text := current_setting('request.jwt.claim.email', true);
	_user_id int;
begin
  if tg_op = 'INSERT' then
  	select id into _user_id from basic_auth.users where email = _email;
    new.user_id = _user_id;
  end if;
  return new;
end
$$;


CREATE FUNCTION basic_auth.user_role(email text, pass text) RETURNS name
    LANGUAGE plpgsql
    AS $$
begin
  return (
  select role from basic_auth.users
   where users.email = user_role.email
     and users.pass = public.crypt(user_role.pass, users.pass)
  );
end;
$$;


CREATE VIEW api.roles AS
 SELECT pg_roles.rolname
   FROM pg_roles
  WHERE ((pg_roles.rolname !~~ 'pg_%'::text) AND (pg_roles.rolname <> ALL (ARRAY['web_anon'::name, 'backend'::name, 'authenticator'::name, 'postgres'::name])));


CREATE TABLE basic_auth.users (
    id serial,
    email text NOT NULL,
    pass text NOT NULL,
    role name NOT NULL,
    disabled boolean DEFAULT false NOT NULL
);


CREATE TABLE db.users_ext (
    id serial,
    user_id integer,
    full_name character varying(255)
);


CREATE VIEW api.users AS
 SELECT b.id,
    b.email,
    b.role,
    b.disabled,
    d.full_name
   FROM (basic_auth.users b
     LEFT JOIN db.users_ext d ON ((b.id = d.user_id)));


COPY basic_auth.users (id, email, pass, role, disabled) FROM stdin;
1	admin@example.com	$2a$06$rsGJd0RdGyafslv/qxK.Z.kP.jcIv5mhP4FagglApn2egmsyOSKgK	admin	f
3	manager@example.com	$2a$06$eDRPgBygH3xLKiEY7kfXCuMY6jSazK8ejfwCA3M5R9SNMqzG136qy	manager	f
\.



CREATE TRIGGER encrypt_pass BEFORE INSERT OR UPDATE ON basic_auth.users FOR EACH ROW EXECUTE PROCEDURE basic_auth.encrypt_pass();
CREATE CONSTRAINT TRIGGER ensure_user_role_exists AFTER INSERT OR UPDATE ON basic_auth.users NOT DEFERRABLE INITIALLY IMMEDIATE FOR EACH ROW EXECUTE PROCEDURE basic_auth.check_role_exists();


GRANT USAGE ON SCHEMA api TO web_anon;
GRANT USAGE ON SCHEMA api TO backend;
GRANT USAGE ON SCHEMA api TO admin;
GRANT USAGE ON SCHEMA basic_auth TO web_anon;

GRANT SELECT ON TABLE api.roles TO admin;
GRANT SELECT ON TABLE basic_auth.users TO web_anon;
GRANT SELECT ON TABLE api.users TO admin;
