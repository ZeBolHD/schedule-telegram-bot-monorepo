FROM oven/bun

WORKDIR /app

RUN bun install -g turbo
COPY . .

RUN bun install 

RUN bun turbo run build --filter=bot

CMD bun turbo db:generate && bun apps/bot/dist/main.js
