# Dependencies
FROM node:18-buster as deps
WORKDIR /src

COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM node:18-buster as builder
WORKDIR /src

COPY --from=deps /src/node_modules ./node_modules

COPY . .
RUN npx nx run gateway:build

# Runtime
FROM node:18 as runtime
WORKDIR /src

COPY --from=deps /src/node_modules ./node_modules
COPY --from=builder /src/dist/packages/gateway .

ENTRYPOINT [ "node" ]
CMD [ "main.js" ]