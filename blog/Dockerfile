# Build context is the repository root, because the posts live in ../content:
#   docker build -f blog/Dockerfile .
FROM node:26-alpine@sha256:8996bb5821d62a8fd9bb27c1cb07462f3fdce6e47d640c6a881ead0b064ce216 AS build
WORKDIR /app
COPY blog/package*.json blog/
RUN cd blog && npm ci
COPY blog blog
COPY content content
RUN cd blog && npm run build

FROM nginx:alpine
COPY blog/nginx.conf /etc/nginx/conf.d/default.conf
COPY blog/security-headers.conf /etc/nginx/security-headers.conf
COPY --from=build /app/blog/dist /usr/share/nginx/html
EXPOSE 80
