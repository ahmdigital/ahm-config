FROM node:10.16.3

ENV TZ=Australia/Melbourne

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN npm i -g npm@latest

WORKDIR /root/

COPY .eslintrc /root
COPY .gintrc /root
COPY scripts /root/scripts
COPY package.json /root
COPY package-lock.json /root
COPY test /root/test
COPY lib /root/lib
COPY .git /root/.git

# Install as public random person
RUN npm i --quiet

# Steps needs to use token to Publish, so let it know to use npm as NPM_TOKEN_AHM
COPY .npmrc /root