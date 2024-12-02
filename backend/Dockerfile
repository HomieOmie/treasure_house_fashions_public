FROM node:16-alpine AS builder

WORKDIR /app

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

COPY . .

# TODO: get the .env import working with the docker build
# COPY src/config/.env ./dist/config/.env

RUN npm run compile

FROM node:slim

ENV NODE_ENV production
USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8080
ENV PORT 8080
CMD [ "node", "dist/index.js" ]
