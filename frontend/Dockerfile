# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base

LABEL andasy_launch_runtime="Vite"

# Vite app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Declare build arguments for environment variables
ARG VITE_API_URL
ARG VITE_WS_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_PUSHER_KEY
ARG VITE_PUSHER_CLUSTER
ARG VITE_GOOGLE_CLIENT_ID

# Convert build args to environment variables for the build process
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_PUSHER_KEY=$VITE_PUSHER_KEY
ENV VITE_PUSHER_CLUSTER=$VITE_PUSHER_CLUSTER
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY . .

# Build application (env vars baked into JS)
RUN npm run build

# Install a lightweight static file server
RUN npm install -g sirv-cli

# Remove dev dependencies and node_modules to save space & memory
RUN npm prune --omit=dev
RUN rm -rf node_modules

# Environment variables
ENV HOST=::

# Start the server by default
EXPOSE 8080

# Serve static files (uses ~10MB RAM vs 200MB+ for dev server)
CMD [ "sirv", "dist", "--host", "::", "--port", "8080", "--single" ]
