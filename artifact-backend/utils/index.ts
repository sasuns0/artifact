import { FastifyReply } from "fastify";

export function sendErrorReply(reply: FastifyReply, message?: string) {
  reply
    .status(500)
    .send({ ok: false, message });
}
