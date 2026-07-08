FROM node:22.20.0-slim

ENV PORT=8080
ENV CI=true
ENV DATABASE_URL=postgres://postgres:postgres@postgres:5432/artifact

WORKDIR /app/backend

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . /app/backend

CMD ["pnpm", "run", "dev"]
