FROM node:14-slim

WORKDIR /server

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]