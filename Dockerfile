FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN --mount=type=cache,target=/root/.npm npm set cache /root/.npm

FROM node:alpine

WORKDIR /app
COPY --from=builder /app .
COPY run.sh .
RUN mkdir /app/public && mkdir /app/public/audio

CMD [ "/app/run.sh" ]
