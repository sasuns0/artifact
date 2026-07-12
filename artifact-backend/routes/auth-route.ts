import { FastifyInstance } from 'fastify';

async function routes(fastify: FastifyInstance, options: Object) {
  fastify.post('/signup', (req, reply) => {
    const token = fastify.jwt.sign({ id: 1 });
    reply.send({ token });
  });
}
