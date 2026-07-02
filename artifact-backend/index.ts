import 'dotenv/config';

import fastify from 'fastify'
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './db/schema/schema';
import { Document, DocumentType, ISearchQueryString } from './types';
import Type from 'typebox';
import { sql } from 'drizzle-orm';
import { getTableColumns } from 'drizzle-orm';
import { desc } from 'drizzle-orm';

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
    const [res] = await db.insert(schema.documentsTable).values({ title: reqBody.title, text: reqBody.text }).returning();

    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ title: res.title ?? '', text: res.text ?? '' });
  })


server.get<{
  Querystring: ISearchQueryString
}>('/search', {
  schema: {
    querystring: Type.Object({
      text: Type.String(),
    })
  }
}, async (request, reply) => {
  const search = request.query.text;

  const textVector = sql`to_tsvector('english', ${schema.documentsTable.text})`;
  const queryText = sql`to_tsquery('english', ${"adsasda"})`;
  const rank = sql`ts_rank(${textVector}, ${queryText})`;
  const condition = sql`${textVector} @@ ${queryText}`;

  const [res] = await db
    .select({
      rank
    })
    .from(schema.documentsTable)
    .where(condition)
    .orderBy(desc(rank))

  console.log("res", res);

  reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({ text: '' });
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
