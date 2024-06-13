## Description

This project provides a data API that seamlessly integrates with WhatsApp using the NestJS framework. It was developed with the aim of understanding some integration points with WhatsApp, serving primarily as a study tool.

## Prerequisites

- Node.js (>= 20.14)

- npm (>= 10.8)

- WhatsApp Web session

## Configuration

Create a '.env' file in the root directory and configure the necessary environment variables:

```bash
API_ENV=
API_PORT=

AUTH_SECRETE=
AUTH_EXPIRE_IN=
AUTH_NAME=
AUTH_PASSWORD=
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug watch mode 
$ npm run start:debug

# production mode
$ npm run start:prod
```

## OpenAPI (Swagger) Documentation

This API uses Swagger for API documentation. Swagger provides a user-friendly interface for interacting with the API and understanding the available endpoints and their usage.

- http://localhost:<API_PORT>/api

