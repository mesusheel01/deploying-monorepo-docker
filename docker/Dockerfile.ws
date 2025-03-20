FROM oven/bun:1

WORKDIR /ws

COPY ./package.json ./package.json
COPY ./bun.lock ./bun.lock

COPY ./package.json  ./package.json
COPY ./turbo.json ./turbo.json

COPY ./apps/backend  ./apps/backend


RUN bun install
RUN bun run db:generate

EXPOSE 8081

CMD ["bun","dev", "start:websocket"]
