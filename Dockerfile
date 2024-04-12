FROM public.ecr.aws/docker/library/node:21

WORKDIR /root/app/

ENV TZ=Australia/Melbourne
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update \
    && apt-get install -y jq

COPY package.json package-lock.json ./

RUN npm ci --quiet --no-optional && \
    npm cache clean --force

COPY .eslintrc .

COPY scripts ./scripts
COPY test ./test
COPY lib ./lib

COPY .git ./.git
