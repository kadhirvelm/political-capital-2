FROM node:18

WORKDIR /usr/political-capital-two

COPY ./yarn.lock ./

COPY ./packages/api ./api
COPY ./packages/backend ./backend

RUN yarn
