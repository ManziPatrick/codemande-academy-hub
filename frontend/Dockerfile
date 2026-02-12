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

# Build application (env vars baked into JS)
RUN npm run build

# Remove dev dependencies to save space (keep node_modules for vite preview)
RUN npm prune --omit=dev

# Environment variables
ENV HOST=::

# Start the server by default
EXPOSE 8080

# Generate runtime config and start server
CMD node generate-env-config.js && npm start
