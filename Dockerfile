# syntax=docker/dockerfile:1
# Production image: Express serves Vite build + /api/* (same as `npm run build && npm start`).
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-bookworm-slim AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/build ./build
EXPOSE 8080
ENV PORT=8080
USER node
CMD ["node", "build/server.js"]
