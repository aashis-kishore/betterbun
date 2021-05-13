FROM node:14.15.4-alpine

ENV NODE_VERSION 14.15.4

RUN apk add --no-cache bash git

WORKDIR /var/betterbun-webservice

COPY src .
COPY test .
COPY .eslintrc.json .
COPY docker-compose.yml .
COPY Dockerfile .
COPY ecosystem.config.js .
COPY jest.config.js .
COPY jsconfig.json .
COPY package.json .
COPY Procfile .

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm", "run", "dev"]