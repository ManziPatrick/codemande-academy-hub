# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base

LABEL andasy_launch_runtime="Vite"

# Vite app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY . .

# Build application
RUN npm run build

# Install serve to serve static files
RUN npm install -g serve

# Remove development dependencies and dev node_modules (save space)
RUN npm prune --omit=dev && rm -rf node_modules

# Environment variables
ENV HOST=::

# Start the server by default, this can be overwritten at runtime
EXPOSE 8080

# Serve the built static files instead of running dev server
CMD [ "serve", "-s", "dist", "-l", "8080" ]
