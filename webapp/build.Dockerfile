FROM node:24-alpine

WORKDIR /app

ARG UID=${UID:-root}
ARG GID=${GID:-root}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

USER ${UID}:${GID}
CMD ["npm", "run", "build"]
