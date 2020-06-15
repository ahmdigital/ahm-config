FROM node:10.16.3

ENV TZ=Australia/Melbourne

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN npm i -g npm@latest

WORKDIR /root/app/

COPY .eslintrc .
COPY .gintrc .
COPY scripts ./scripts
COPY package.json .
COPY package-lock.json .
COPY test ./test
COPY lib ./lib
COPY .git ./.git

# Install as public random person
RUN npm i --quiet

# Steps needs to use token to Publish, so let it know to use npm as NPM_TOKEN_AHM
COPY .npmrc .