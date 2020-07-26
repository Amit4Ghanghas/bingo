# stage 1 building the code
FROM node as builder

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install

# stage 2
FROM node

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --production

# COPY --from=builder /usr/app/ ./backend
COPY --from=builder /usr/app/ ./


COPY ormconfig.docker.json ./ormconfig.json

COPY .env .

EXPOSE 8002

CMD node bingoServer.js
