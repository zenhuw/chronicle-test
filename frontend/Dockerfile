
FROM node:18-bullseye AS builder

WORKDIR /usr/local/app/

COPY ./ /usr/local/app/

RUN npm i && npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /usr/local/app/dist/chronicletest .
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
