import 'dotenv/config';

import fastify from 'fastify'
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './db/schema/schema';
import { Document, DocumentType } from './types';

const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
  schema: {
    ...schema
  }
});

const server = fastify()

server.post<{
  Body: DocumentType,
  Reply: DocumentType
}>(
  '/document',
  {
    schema: {
      body: Document,
      response: {
        200: Document
      }
    }
  },
  async (request, reply) => {
    const reqBody = request.body;
    const [res] = await db.insert(schema.documentsTable).values({ text: reqBody.text }).returning();

    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ text: res.text ?? '' });
  })

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
