# npl-demo

## Pre-requisite

Get the CLI

```shell
curl -s https://documentation.noumenadigital.com/get-npl-cli.sh | bash
```

## Walkthrough

The [WALKTHROUGH.md](./WALKTHROUGH.md) helps you understand what is going on in the demo app without leaving your shell.

## Run locally

Make sure the NPL is correct
```shell
npl check
npl test
```

Start the NOUMENA Runtime

```shell
docker compose up -d --build --wait
```
Deploy NPL to local NOUMENA Runtime

```shell
npl deploy
```

The front end is deployed in development mode at http://localhost:5173. 
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

From the webapp directory  (`cd webapp`), edit the target .env file and set the environment variables to point to the 
deployed npl, replacing `[your-tenant-slug]` and `[your-app-slug]` with the appropriate values for your application

```shell
VITE_SERVER_URL=https://engine-[your-tenant-slug]-[your-app-slug].noumena.cloud
VITE_AUTH_URL=https://keycloak-[your-tenant-slug]-[your-app-slug].noumena.cloud/realms/[your-app-slug]/protocol/openid-connect/token
VITE_AUTH_CLIENT_ID=[your-app-slug]
```

```shell
docker run --build webapp-dist
```

From the project root directory (`cd ..`), deploy the frontend to NOUMENA Cloud with

```shell
npl cloud deploy frontend
```
