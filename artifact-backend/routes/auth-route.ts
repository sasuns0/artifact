import { db } from '../db';
import { refreshTokensTable, usersTable } from '../db/schema/schema';
import { AuthResponseType, UserType } from '../types/auth';
import { FastifyInstance } from 'fastify';
import argon2 from 'argon2';
import { sendErrorReply } from '../utils';
import { eq } from 'drizzle-orm';

async function routes(fastify: FastifyInstance) {
  fastify.post<{
    Body: UserType
    Reply: { status: number, data: { username: string } }
  }>(
    '/signup',
    async (req, reply) => {
      try {
        const passwordHash = await argon2.hash(req.body.password);

        const user = await db.query.usersTable.findFirst({ where: eq(usersTable.username, req.body.username) });
        if (user) {
          sendErrorReply(reply, { message: "User with this username exists" });
          return;
        }

        const [res] = await db.insert(usersTable).values({
          username: req.body.username,
          password: passwordHash
        }).returning({
          id: usersTable.id,
          username: usersTable.username
        });

        reply
          .code(200)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({ status: 200, data: { username: res.username } });
      } catch (err) {
        sendErrorReply(reply);
      }
    });

  fastify.post<{
    Body: UserType
    Reply: AuthResponseType
  }>(
    '/signin',
    async (req, reply) => {
      try {
        const user = await db.query.usersTable.findFirst({ where: eq(usersTable.username, req.body.username) });
        if (!user) {
          sendErrorReply(reply, { message: "User with this username don't exist" });
          return;
        }
        const isValid = await argon2.verify(user.password!, req.body.password);

        if (!isValid) {
          sendErrorReply(reply, { message: "Wrong password", status: 401 });
          return;
        }

        const accessToken = fastify.jwt.sign({ sub: user.id }, { expiresIn: '15m' });
        const refreshToken = fastify.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

        const [res] = await db.insert(refreshTokensTable).values({ userId: user.id, token: refreshToken }).returning({ id: refreshTokensTable.id });

        if (res.id) {
          reply.setCookie('access_token', accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 15 * 60
          });

          reply.setCookie('refresh_token', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/refresh',
            maxAge: 7 * 24 * 60 * 60
          });

          reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({ status: 200 });
          return;
        }

        sendErrorReply(reply, { message: 'Something went wrong' });
        return;
      } catch (err) {
        sendErrorReply(reply);
      }
    },
  );

  fastify.post('/refresh', async (req, reply) => {
    try {
      // const refreshToken = req.cookies.refresh_token;
      //
      // if (refreshToken) {
      //   const payload = fastify.jwt.verify(accessToken) as { sub: number };
      // }

    } catch (err) {
      sendErrorReply(reply);
    }
  });

  fastify.post('/logout', async (req, reply) => {
    try {
      const accessToken = req.cookies.access_token;

      if (accessToken) {
        const payload = fastify.jwt.verify(accessToken) as { sub: number };

        await db.delete(refreshTokensTable).where(eq(refreshTokensTable.userId, payload.sub))

        reply
          .clearCookie('access_token', { path: '/' })
          .clearCookie('refresh_token', { path: '/refresh' })
      }
    } catch (err) {
      sendErrorReply(reply);
    }
  })
}

export default routes;
