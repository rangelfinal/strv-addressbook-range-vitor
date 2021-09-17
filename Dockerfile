FROM node:alpine

RUN npm install -g typescript

WORKDIR /app/

COPY . /app/

RUN yarn install --immutable --immutable-cache --check-cache
RUN yarn build

CMD [ "yarn", "node", "dist/index.js" ]