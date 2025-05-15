# npl-demo

# get the CLI
`curl -s https://documentation.noumenadigital.com/get-npl-cli.sh | bash`

# run locally
`docker compose build && docker compose up -d`

# deploy npl
`npl deploy --sourceDir api/src/main/`

# install frontend
cd webapp && npm i

# run dev server
cd webapp && npm run dev