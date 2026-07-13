import { FastifyReply } from "fastify";

export function sendErrorReply(reply: FastifyReply, opts: { status?: number, message?: string } = { status: 500 }) {
  reply
    .status(opts?.status ?? 500)
    .send({ ok: false, message: opts.message });
}
