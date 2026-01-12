# npl-demo

`npl-demo` is a demo application that features a simple `Hello World` backend developed in
[NPL](https://documentation.noumenadigital.com/) and a purpose-built frontend that illustrates key tenets of NPL
technology. Follow the instructions below to run the demo application.

## Pre-requisite

Get the CLI (note: If opening this repo in Codespaces, the CLI will automatically be available to you)

```shell
curl -s https://documentation.noumenadigital.com/get-npl-cli.sh | bash
```

## Shell walkthrough (backend)

The [WALKTHROUGH.md](./WALKTHROUGH.md) helps you understand what is going on in the demo app without leaving your shell.

## Run locally (backend and frontend)

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

## Run on NOUMENA Cloud (backend and frontend)

Log into NOUMENA Cloud with the NPL CLI

```shell
npl cloud login
```

In `npl.yml`, set the `cloud.tenant` and `cloud.app` parameters to the tenant and applications slugs of your application
in NOUMENA Cloud. Then, from the project root, deploy NPL to NOUMENA Cloud with:

```shell
npl cloud deploy npl
```

From the webapp directory  (`cd webapp`), edit the target `.env` file and set the environment variables to point to the 
deployed npl, replacing `[your-tenant-slug]` and `[your-app-slug]` with the appropriate values for your application

```shell
VITE_SERVER_URL=https://engine-[your-tenant-slug]-[your-app-slug].noumena.cloud
VITE_AUTH_URL=https://keycloak-[your-tenant-slug]-[your-app-slug].noumena.cloud/realms/[your-app-slug]/protocol/openid-connect/token
VITE_AUTH_CLIENT_ID=[your-app-slug]
```
Still from the webapp directory, build the static frontend with Docker by running:

```shell
docker compose -f webapp/docker-compose.yml run --build webapp-dist
```

From the project root directory (`cd ..`), deploy the frontend to NOUMENA Cloud with

```shell
npl cloud deploy frontend
```

Configure users on the NOUMENA Cloud portal. You will need to create `alice`, `bob` and `carol` users according to the
<a href="/cloud/portal/create-users/" target="_blank" rel="noopener">create application users</a> guide.

   > The hardcoded demo password in the webapp is `password12345678` for all users. Feel free to change it to your
   > liking, ensuring that the password of application users created on NOUMENA Cloud is matching the one used across
   > the webapp.

Navigate to the `https://TENANT_SLUG-APPLICATION_SLUG.noumena.cloud` frontend URL of your NOUMENA Cloud application and
try out the Hello World application flow

