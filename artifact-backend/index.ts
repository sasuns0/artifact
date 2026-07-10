import 'dotenv/config';

import fastify, { FastifyReply } from 'fastify'
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './db/schema/schema';
import { CreateDocumentResponse, CreateDocumentResponseType, Document, DocumentType, ISearchQueryString } from './types';
import Type from 'typebox';
import { sql, desc, getTableColumns } from 'drizzle-orm';

import './db/index';
import { sendErrorReply } from './utils';

const server = fastify()


server.setErrorHandler((error, request, reply) => {
  sendErrorReply(reply);
})

server.listen({ host: '0.0.0.0', port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
