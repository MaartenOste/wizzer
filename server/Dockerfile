FROM node:14-alpine AS builder

RUN apk add --update \
  python \
  python-dev \
  py-pip \
  build-base \
  git \
  openssh-client \
&& pip install virtualenv \
&& rm -rf /var/cache/apk/*

WORKDIR /server

COPY . .

RUN npm i && npm run build

FROM node:14-slim

COPY --from=builder /server .

EXPOSE 80

ENTRYPOINT [ "npm", "run", "serve" ]