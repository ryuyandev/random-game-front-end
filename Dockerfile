FROM node:16-alpine as build-stage
WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

ARG API_URL_ARG
ENV API_URL=$API_URL_ARG

COPY ./ ./
RUN npm ci
RUN npm run build


FROM nginx:alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx.conf

LABEL com.centurylinklabs.watchtower.enable="true"