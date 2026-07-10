import { FastifyReply } from "fastify";

export function sendErrorReply(reply: FastifyReply) {
  reply
    .status(500)
    .send({ ok: false });
}
