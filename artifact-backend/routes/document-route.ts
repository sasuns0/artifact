import { FastifyInstance } from "fastify";
import { CreateDocumentResponse, CreateDocumentResponseType, Document, DocumentType, ISearchQueryString } from "../types";
import Type from "typebox";
import { getTableColumns, sql } from "drizzle-orm";

import * as schema from '../db/schema/schema';
import { desc } from "drizzle-orm";
import { db } from "../db";
import { sendErrorReply } from "../utils";

async function routes(fastify: FastifyInstance, options: Object) {
  fastify.post<{
    Body: DocumentType,
    Reply: CreateDocumentResponseType
  }>(
    '/document',
    {
      schema: {
        body: Document,
        response: {
          200: CreateDocumentResponse,
        }
      }
    },
    async (request, reply) => {
      const reqBody = request.body;

      try {
        const [res] = await db.insert(schema.documentsTable).values({ title: reqBody.title, text: reqBody.text }).returning();

        reply
          .code(200)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({ status: 200, data: { title: res.title ?? '', text: res.text ?? '' } });
      } catch (err) {
        sendErrorReply(reply);
      }
    });

  fastify.get<{
    Querystring: ISearchQueryString
  }>('/search', {
    schema: {
      querystring: Type.Object({
        text: Type.String(),
      })
    }
  }, async (request, reply) => {
    const search = request.query.text.split(" ").join(" & ");

    const matchQuery = sql`(
  setweight(to_tsvector('english', ${schema.documentsTable.title}), 'A') ||
  setweight(to_tsvector('english', ${schema.documentsTable.text}), 'B')), to_tsquery('english', ${search})`;

    try {
      const res = await db
        .select({
          ...getTableColumns(schema.documentsTable),
          rank: sql`ts_rank(${matchQuery})`,
          rankCd: sql`ts_rank_cd(${matchQuery})`,
        })
        .from(schema.documentsTable)
        .where(
          sql`(
      setweight(to_tsvector('english', ${schema.documentsTable.title}), 'A') ||
      setweight(to_tsvector('english', ${schema.documentsTable.text}), 'B')
      ) @@ to_tsquery('english', ${search})`,
        )
        .orderBy((t) => desc(t.rank)) as DocumentType[];

      reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({
          status: 200,
          data: res
        });
    } catch (err) {
      console.log(err);
      sendErrorReply(reply);
    }
  })
}

export default routes;
