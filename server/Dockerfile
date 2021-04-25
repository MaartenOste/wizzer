FROM node:14-slim

WORKDIR /client

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm i

COPY . .

EXPOSE 8080

CMD ["npm", "run", "serve"]