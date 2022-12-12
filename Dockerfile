FROM --platform=linux/arm/v7 node:18

WORKDIR /usr/political-capital-two

COPY ./lerna.json .
COPY ./tsconfig.json .
COPY ./package.json .
COPY ./yarn.lock .

RUN yarn

ADD ./packages /usr/political-capital-two/packages

WORKDIR /usr/political-capital-two/packages/api
RUN yarn
RUN yarn build

WORKDIR /usr/political-capital-two/packages/scss-modules
RUN yarn
RUN yarn build

WORKDIR /usr/political-capital-two/packages/backend
RUN yarn
RUN yarn build

WORKDIR /usr/political-capital-two/packages/frontend
RUN yarn
RUN yarn build

WORKDIR /usr/political-capital-two/packages/backend
CMD ["yarn", "start"]
