FROM node:14

WORKDIR /front/shappar-front

COPY package*.json /front/shappar-front/
COPY yarn.lock /front/shappar-front/
RUN yarn install

COPY ./ /front/shappar-front

EXPOSE 8080