# npl-demo

## Pre-requisite

Get the CLI

```shell
curl -s https://documentation.noumenadigital.com/get-npl-cli.sh | bash
```

## Run locally

Start the NOUMENA Runtime

```shell
docker compose build && docker compose up -d --wait
```

Deploy NPL to local NOUMENA Runtime

```shell
npl deploy
```

The front end is deployed in development mode at http//localhost:5173. 
The front end source code is mounted as a volume, allowing hot code fixes without the need to rebuild
and restart the front end.

## Run on NOUMENA Cloud

Log into NOUMENA Cloud with the NPL CLI

```shell
npl cloud login
```

In `npl.yml`, set the `cloud.tenant` and `cloud.app` parameters to the tenant and applications slugs of your application
in NOUMENA Cloud. Then, from the project root, deploy NPL to NOUMENA Cloud with:

```shell
npl cloud deploy npl
```

From the webapp directory, set the target environment in the .env file and build the frontend

```shell
docker compose build webapp
```

From the project root directory, deploy the frontend to NOUMENA Cloud with

```shell
npl cloud deploy frontend
```
