import 'dotenv/config';

import fastify, { FastifyReply } from 'fastify'
import documentRoutes from './routes/document-route';
import authRoutes from './routes/auth-route';
import fastifyJwt from '@fastify/jwt';

const server = fastify()

function sendErrorReply(reply: FastifyReply) {
  reply
    .status(500)
    .send({ ok: false });
}

server.setErrorHandler((error, request, reply) => {
  sendErrorReply(reply);
})

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!
});

server.register(authRoutes);
server.register(documentRoutes);

server.listen({ host: '0.0.0.0', port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
