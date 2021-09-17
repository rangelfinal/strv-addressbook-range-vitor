FROM node:alpine

RUN apk --no-cache add openjdk11

RUN npm install -g firebase-tools

WORKDIR /app

COPY firebase.json firestore.indexes.json firestore.rules /app/

CMD [ "firebase", "--project=strv-addressbook-rangel-vitor", "emulators:start", "--only", "firestore" ]