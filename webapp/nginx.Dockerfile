# Use official Node.js LTS image
FROM node:24-alpine as builder

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first
# This ensures npm install is cached if these files don't change
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the project
RUN npm run build

# Expose port
EXPOSE 80

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
