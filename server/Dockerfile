FROM node:14-slim

WORKDIR user/src/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm i

COPY . .

EXPOSE 8080

CMD []