FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first
# This ensures npm install is cached if these files don't change
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install
RUN chown nobody:nobody -R node_modules

# Expose port
EXPOSE 5173

# Run the app
USER nobody
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]