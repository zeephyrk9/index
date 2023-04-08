# Dependencies
FROM node:18-buster as deps
WORKDIR /src

COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM node:18-buster as builder
ARG build_target
WORKDIR /src

COPY --from=deps /src/node_modules ./node_modules

COPY . .
RUN npx nx run workflows:build:$build_target

# Runtime
FROM node:18 as runtime
ARG build_target
WORKDIR /src

COPY --from=deps /src/node_modules ./node_modules
COPY --from=builder /src/dist/packages/$build_target .

ENTRYPOINT [ "node" ]
CMD [ "worker.js" ]