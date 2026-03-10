# ---------- BUILD ----------
FROM node:22.14 AS build

WORKDIR /deathcounter

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# ---------- SERVE ----------
FROM node:22.14-alpine AS serve

RUN npm install -g serve

WORKDIR /deathcounter

COPY --from=build /deathcounter/dist ./dist
COPY serve.json ./dist/serve.json

EXPOSE 6200

CMD ["serve", "-s", "dist", "-l", "6200"]
