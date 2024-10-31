ARG NODE_VERSION=20.14.0
ARG ALPINE_VERSION=3.19.1
ARG PNPM_VERSION=8.6.0

FROM node:${NODE_VERSION}-alpine AS node

FROM alpine:${ALPINE_VERSION}

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    git



WORKDIR /app

COPY package.json .

    RUN npm install -g pnpm@${PNPM_VERSION}
RUN pnpm install

COPY src ./src
COPY .env .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY nest-cli.json .

RUN pnpm run build

CMD ["node", "dist/main"]
