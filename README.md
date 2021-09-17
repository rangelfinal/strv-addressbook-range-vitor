# strv-addressbook-rangel-vitor

Design & Implement a RESTful API for an AddressBook application. The AddressBook app enables users to register and manage their own contact list by adding contacts to Firebase.  
API should serve all kinds of clients (which you do not have to implement)—both mobile apps and websites using a RESTful API. The AddressBook API backend should use two different storage services to maintain the data. User accounts are stored in either an SQL database or a NoSQL database of your choice, whereas contacts are stored in Firebase.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Assignment

|                    |                |
| ------------------ | -------------- |
| Language           | Typescript     |
| Runtime            | Node.js        |
| Framework          | Koa            |
| Database           | Postgres       |
| Hosting/Deployment | Heroku         |
| CI/CD              | Github Actions |
| API                | REST - JSON    |

### Features Overview

- Register new account
- Log in to the created account
- Adding a contact to Firebase

#### Register new account

- All users should be stored in persistent DB.
- Registrations should be done with email + password.
- No other user information besides email & password is needed.
- After registration, the user should be automatically logged in.

#### Log in to account

- Users should be able to log in using email & password.
- Use stateless authorization (JWT).

#### Adding a contact

- Logged in users should be able to add a new contact.
- Contact should contain the following information:
  - First name
  - Last name
  - Phone number
  - Address (text)
- Save contact to Firebase only.

#### Listing contacts

- You don’t need to implement a listing of contacts.
- Clients will connect directly to Firebase to read contacts. Make sure Firebase is safely configured.

## Local Development

- Use [docker-compose](https://docs.docker.com/compose/install/) to setup postgres and firebase emulator
  - `docker-compose up --detached`
- Setup firestore emulator environment variable to point our api to the local firestore emulator
  - `export FIRESTORE_EMULATOR_HOST=localhost:8080`
- Setup gcloud project environment variable
  - `export GCLOUD_PROJECT=strv-addressbook-rangel-vitor` (Or your own firebase project with firestore prepared)
- Run `yarn start` to build & start api

## Tests

- Run tests with `yarn test`. It will automatically:
  - Build the project with tsc
  - Setup postgres and firestore emulator using [docker-compose](https://docs.docker.com/compose/install/)
  - Uses supertest to ensure all endpoints are reachable and work as expected

## Extras

- Added husky/lint-staged/eslint/prettier to lint/format files on commit
- Added commitzen/commitlint/standard-version for commit/version/changelog management
- Uses [yarn v3](https://dev.to/arcanis/yarn-3-0-performances-esbuild-better-patches-e07) Release Candidate with [Plug'n'Play](https://yarnpkg.com/features/pnp)
- Uses [subcollections](https://firebase.google.com/docs/firestore/data-model#subcollections) to organize data in firestore
- Made in around 10h
