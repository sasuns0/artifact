FROM node:22.20.0-slim

ENV PORT=3000
ENV CI=true

WORKDIR /app/frontend

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . /app/frontend

CMD ["pnpm", "run", "dev"]
