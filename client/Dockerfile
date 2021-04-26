FROM node:14-slim AS builder

WORKDIR /client

COPY . .

RUN npm i && npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=builder /client/build .

COPY --from=builder /client/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]