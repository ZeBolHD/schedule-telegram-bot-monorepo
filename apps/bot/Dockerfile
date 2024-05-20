FROM oven/bun

# The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.

# Set working directory
WORKDIR /app

RUN bun install -g turbo
COPY . .

RUN bun install 

RUN bun turbo run build --filter=bot

CMD bun turbo db:generate && bun apps/bot/dist/main.js