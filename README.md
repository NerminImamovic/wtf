WTF

Node.js wtf Assignment - Nermin Imamovic

A few things to note in the project:
* **[Github Actions Workflows](https://github.com/NerminImamovic/wtf/tree/master/.github/workflows)** -
`ci.yml`, continuous integration for the project 

* **[Dockerfile](https://github.com/NerminImamovic/wtf/blob/master/Dockerfile)** - Dockerfile to generate docker builds.

* **[docker-compose](https://github.com/NerminImamovic/wtf/blob/master/docker-compose.yml)** - Docker compose script to start service in production mode.

* **[Containerized Mongo for development](#iii-development)** - Starts a local mongo container with data persistence across runs.

* **[Containerized Mongo for test](#v-test)** - Starts a local mongo container.

* **[.env file for configuration](#environment)** - Change server config like app port, mongo url etc
* **[Winston Logger](#logging)** - Uses winston as the logger for the application.
* **[Inversify](https://github.com/inversify)** - A powerful and lightweight inversion of control container for JavaScript & Node.js apps powered by TypeScript.

* **ESLINT** - ESLINT is configured for linting.
* **Jest** - Using Jest for running test cases

## I. Installation

---

### Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Git
* Node.js (v.14.17)
* Docker (v.20.10.)

---

#### 1. Clone this repo

```
$ git clone git@github.com:NerminImamovic/wtf
$ cd wtf
```

#### 2. Install dependencies

```
$ npm install
```

## II. Configuration

Be sure that you have installed docker on your local machine, and any service related do Mongo is turned off. 

Configuration is provided in `env.default` file for development and local running, and in `env.test` for the test running. Also for making production build we have configuration in `docker-compose.yml` file.

Read more about **[environment variables](#environment)** used in the project.

## III. Development

### Start dev server
Starting the dev server also starts MongoDB as a service in a docker container using the compose script at `docker-compose.dev.yml`.

```
$ npm run dev
```
Running the above commands results in 
* **API Server** running at `http://localhost:3000/`
* **MongoDB** running at `mongodb://localhost:27017/`

(feel free to change the env variables in .env.default)

## IV. Packaging and Deployment

#### 1. Build and run using npm scripts 

In the background `docker-compose.local.yml` will be started to provide mongodb service copying environment variables from `env.default`.

```
$ npm run build && npm run start
```

#### 2. Run with docker

We can make production build using docker.

Build docker image.

```
$ docker build -t api-server .
```

Start application using docker-compose.

```
$ docker-compose up
```

or simply run

```
$ docker-compose up --build
```

## V. Test

Test configuration is provided from `env.test` file. Mongo database in test running is started from `docker-compose.test.yml` without data persistance.

Run tests e2e tests using next npm script:

```
$ npm run test
```

---

As the result we will also have code coverage through files.

## Environment
There are environment variables for development and test environments in files `env.default` and `env.test`. For production env variables are in `docker-compose.yml` file.

| Var Name  | Type  | Default | Description  |
|---|---|---|---|
| NODE_ENV  | string  | `development` |API runtime environment. eg: `production`  |
|  PORT | number  | `3000` | Port to run the API server on |
|  MONGO_URL | string  | `mongodb://localhost:27017/acronyms` | URL for MongoDB |
|  JWT_SECRET | string  | `secret` | Jwt Secret |


## Logging
The application uses [winston](https://github.com/winstonjs/winston) as the default logger. The configuration file is at `src/logger.ts`.

* Development and Test environments log errors in the console (Console messages are prettified)
* Production environment logs error in the files in `/log` folder

## Routes

GET /acronym?from=50&limit=10&search=:search<br>
▶ returns a list of acronyms, paginated using query parameters<br>
▶ response headers indicate if there are more results<br>
▶ returns all acronyms that fuzzy match against :search<br>

POST /acronym<br>
▶ receives an acronym and definition strings<br>
▶ adds the acronym definition to the db<br>

PUT /acronym/:acronym<br>
▶ receives an acronym and definition strings<br>
▶ uses an authorization header to ensure acronyms are protected<br>
▶ updates the acronym definition to the db for :acronym<br>

DELETE /acronym/:acronym<br>
▶ deletes :acronym<br>
▶ uses an authorization header to ensure acronyms are protected<br>
