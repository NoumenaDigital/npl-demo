# Use official Node.js LTS image
FROM node:22.11.0-alpine3.20

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first
# This ensures npm install is cached if these files don't change
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Expose port
EXPOSE 5173

# Run the app
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]