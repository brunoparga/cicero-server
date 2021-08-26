# syntax=docker/dockerfile:1
FROM node:14-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN apk add --no-cache curl && curl -f https://get.pnpm.io/v6.14.js | node - add --global pnpm && pnpm config set store-dir /root/.pnpm-store/v3 && pnpm install --production
COPY . .
CMD ["node", "app.js"]