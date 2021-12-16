# ANGULAR BACKEND SERVER

Backend for homework in Angular course

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/2fbd4214652c58f2d86a)

## Contents

-   [Quick Start](#quick-start)
-   [Configuration options](#configuration)

## <a name="quick-start"></a>Quick Start

### Install dependencies:

```bash
npm install
```

### Run server:

```bash
npm start
```

If it started successfully the following message will be shown
`{"level":"info","message":"Server started at http://localhost:3000","service":"angular-service"}`

### Upload file test

To test files uploading, run locally `./files/test.html`. You can use LiveServer or any other tool

## <a name="configuration"></a>Configuration options

Configuration can be done by changing `.env` file

### Port

You can change server port in SERVER_PORT variable

### Data source

There are two options to start server: using mock data that is keeped in memory and using database.
By default first variant is used.

If you want to use database:

1. Install docker (Docker for Windows or any variant suitable for your OS)

2. Start DB from prebuild image

```bash
docker run -p 6379:6379 --name redis-redisjson redislabs/rejson:latest`
```

you can also run DB in the cloud for free, see more here: https://oss.redis.com/redisjson/#redis-cloud

3. Change

```bash
DATA_FROM_DB=true
```

in .env file

4. Start server as usual

5. For initial DB fill run while server is up

```bash
npm run fill-db
```
