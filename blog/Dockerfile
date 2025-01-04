# Base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Use a lightweight production image
FROM node:18-alpine

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .

# Expose the port
EXPOSE 3001

# Start the service
CMD ["node", "index.js"]
