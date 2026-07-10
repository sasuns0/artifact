import 'dotenv/config';

import fastify from 'fastify'

import './db/index';
import { sendErrorReply } from './utils';

import documentRoute from './routes/document-route';

const server = fastify()

server.setErrorHandler((error, request, reply) => {
  sendErrorReply(reply);
})

server.register(documentRoute);

server.listen({ host: '0.0.0.0', port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
