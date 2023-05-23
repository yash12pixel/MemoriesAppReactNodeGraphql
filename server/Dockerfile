FROM node:16

WORKDIR /app

COPY package.json ./

COPY .env ./

COPY . .

RUN yarn

EXPOSE 5001

CMD [ "node", "index.js" ]