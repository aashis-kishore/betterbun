FROM node:14.15.4-alpine

ENV NODE_VERSION 14.15.4

RUN apk add --no-cache bash

WORKDIR /var/betterbun-api

COPY config/ /var/betterbun-api/config/
COPY controllers /var/betterbun-api/controllers/
COPY models/ /var/betterbun-api/models/
COPY routes/ /var/betterbun-api/routes/
COPY services/ /var/betterbun-api/services/
COPY app.js /var/betterbun-api/
COPY server.js /var/betterbun-api/
COPY ecosystem.config.js /var/betterbun-api/

COPY package.json /var/betterbun-api/

RUN npm install

VOLUME /var/betterbun-api/data

EXPOSE 3000
ENTRYPOINT ["npm", "run", "pm2:prod"]