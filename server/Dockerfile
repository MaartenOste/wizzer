FROM node:14-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm i

COPY . .

EXPOSE 8080

CMD ["npm", "run", "serve"]