# npl-demo

## Pre-requisite

Get the CLI

```shell
curl -s https://documentation.noumenadigital.com/get-npl-cli.sh | bash
```

## Run locally

Start the NOUMENA Runtime

```shell
docker compose build && docker compose up -d
```

Deploy NPL to local NOUMENA Runtime

```shell
npl deploy --sourceDir api/src/main/
```

Go to the webapp directory and install frontend dependencies

```shell
npm i
```

Still from the webapp directory, run the dev server locally

```shell
npm run dev
```

## Run on NOUMENA Cloud

From the api directory, deploy NPL to NOUMENA Cloud. Replace $YOUR_APP_SLUG with your app slug and $YOUR_TENANT_SLUG with your tenant slug and run the command:

```shell
npl cloud deploy npl --app $YOUR_APP_SLUG --tenant $YOUR_TENANT_SLUG --migration ./src/main/migration.yml
```

From the webapp directory, set the target environment in the .env file and build the frontend

```shell
npm run build
```

Still from the webapp directory, deploy the frontend to NOUMENA Cloud

```shell
npl cloud deploy frontend --app $YOUR_APP_SLUG --tenant $YOUR_TENANT_SLUG --frontend dist
```
