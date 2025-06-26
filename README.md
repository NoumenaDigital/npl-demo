# npl-demo

# Pre-requisite: Get the CLI
```shell
curl -s https://documentation.noumenadigital.com/get-npl-cli.sh | bash
```

# Run locally

## Start the NOUMENA Runtime
```shell
docker compose build && docker compose up -d
```

## Deploy NPL to local Runtime
```shell
npl deploy --sourceDir api/src/main/
```

## Install frontend
```shell
cd webapp && npm i

## Run dev server locally
``shell
cd webapp && npm run dev
```
# Run on NOUMENA Cloud

# Deploy NPL to NOUMENA Cloud
```shell
cd api && npl deploy --appId $YOUR_APP_ID --migration ./src/main/migration.yml
```

# Build frontend (change webapp/.env for the target)
```shell
cd webapp && npm run build
```

# Create frontend zip for upload (awaiting CLI support for frontend upload)
```shell
cd dist && zip -r webapp.zip .
```