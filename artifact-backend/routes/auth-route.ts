import { db } from '../db';
import { usersTable } from '../db/schema/schema';
import { AuthResponseType, UserType } from '../types/auth';
import { FastifyInstance } from 'fastify';
import argon2 from 'argon2';
import { sendErrorReply } from '../utils';
import { eq } from 'drizzle-orm';

async function routes(fastify: FastifyInstance) {
  fastify.post<{
    Body: UserType
    Reply: AuthResponseType
  }>(
    '/signup',
    async (req, reply) => {
      try {
        const passwordHash = await argon2.hash(req.body.password);

        const user = await db.query.usersTable.findFirst({ where: eq(usersTable.username, req.body.username) });
        if (user) {
          sendErrorReply(reply, "User with this username exists");
          return;
        }

        const res = await db.insert(usersTable).values({
          username: req.body.username,
          password: passwordHash
        }).returning({
          id: usersTable.id,
          username: usersTable.username
        });

        const token = fastify.jwt.sign({ sub: 1 }, { expiresIn: '1h' });
        reply
          .code(200)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({ status: 200, data: token });
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
          sendErrorReply(reply, "User with this username don't exist");
          return;
        }
        const isValid = await argon2.verify(user.password!, req.body.password);

        if (!isValid) {
          sendErrorReply(reply, "Wrong password");
          return;
        }

        const token = fastify.jwt.sign({ sub: 1 }, { expiresIn: '1h' });
        reply
          .code(200)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({ status: 200, data: token });
      } catch (err) {
        sendErrorReply(reply);
      }
    }
  )
}

export default routes;
