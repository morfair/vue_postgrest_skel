import aiohttp
import aiopg
from aiopg import create_pool
from aiopg.sa import create_engine
import asyncio
from aiohttp import web
import jwt
from datetime import datetime, timedelta
import yaml
import logging


def tokens(app):
    def inner(role, login, user, group, serial):
        refresh_tok = {
            "role": role,
            "login": login,
            "user": user,
            "group": group,
            "serial": serial,
            "exp": (datetime.now() + timedelta(days=35)).timestamp()
        }

        access_tok = {
            "role": role,
            "user": user,
            "group": group,
            "exp": (datetime.now() + timedelta(days=35)).timestamp()
        }

        resp = [
            {
                "refresh": jwt.encode(refresh_tok, app.secret).decode(),
                "access": jwt.encode(access_tok, app.secret).decode()
            }
        ]

        return resp
    return inner


async def login(request):

    data = await request.json()

    user, password = data.get('login', None), data.get('password', None)

    if not user or not password:
        raise web.HTTPUnauthorized()

    async with request.app.pool.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.callproc(
                '"app/common".user_role',
                [user, password]
                )
            role, = await cur.fetchone()
            if not role:
                raise web.HTTPUnauthorized()
            await cur.callproc('nextval', ['"app/common".users_last_token_seq'])
            serial, = await cur.fetchone()

            await cur.execute('select users.id, users.group_id from "app/common".users where users.login = %s;', [user])
            user_id, group_id, = await cur.fetchone()

            await cur.execute('update "app/common".users set last_token = %s where users.login = %s;', [serial, user])


    return web.json_response(tokens(request.app)(role, user, user_id, group_id, serial))


def check_exp_user(data):
    print(data)
    if not data.get('exp') or not data.get('user') or data['exp'] < datetime.now().timestamp():
        logging.warning('token expired' + repr(data))
        raise web.HTTPUnauthorized('check_exp_user')


async def refresh(request):
    h = request.headers['Authorization']
    if not h:
        raise web.HTTPUnauthorized()
    h = h.split()[-1]

    data = jwt.decode(h, request.app.secret)

    check_exp_user(data)

    user_id = data.get('user')

    async with request.app.pool.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.execute('select last_token from "app/common".users where users.id = %s;', [user_id])
            serial, = await cur.fetchone()
            if serial > data.get('serial', 0):
                raise web.HTTPUnauthorized()

            await cur.callproc('nextval', ['"app/common".users_last_token_seq'])
            serial, = await cur.fetchone()

            await cur.execute('update "app/common".users set last_token = %s where users.id = %s;', [serial, user_id])

            await cur.execute('select users.login, users.group_id, users.role from "app/common".users where users.id = %s;', [user_id])
            user, group_id, role = await cur.fetchone()

    return web.json_response(tokens(request.app)(role, user, user_id, group_id, serial))


async def logout(request):

    h = request.headers['Authorization']
    if not h:
        raise web.HTTPUnauthorized()
    h = h.split()[-1]

    data = jwt.decode(h, request.app.secret)

    check_exp_user(data)

    async with request.app.pool.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.execute(
                '''update "app/common".users set last_token = nextval('"app/common".users_last_token_seq'::regclass) where users.id = %s;''',
                [data.get('user')]
                              )

    return web.Response(text="")


def main():

    with open('config.yaml', 'r') as f:
        try:
            config = yaml.load(f)
        except yaml.YAMLError as exc:
            print(exc)

    dsn = 'dbname=radar user=admin host=127.0.0.1'

    loop = asyncio.get_event_loop()
    pool = loop.run_until_complete(create_pool(dsn))

    app = web.Application()
    app.pool = pool

    app.secret = 'ulY7unTY61UrTfnQHH3rnZGTJzOEl3Yb'


    app.add_routes([
                    web.post('/refresh', refresh),
                    web.post('/login', login),
                    web.post('/logout', logout)
                    ])

    web.run_app(app, port=2999)


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    main()
