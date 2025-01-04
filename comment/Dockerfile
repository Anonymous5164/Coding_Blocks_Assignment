# Base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .


# Expose the port
EXPOSE 3002

# Start the service
CMD ["node", "index.js"]
