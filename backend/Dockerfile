FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Environment variables
ENV HOST=::
ENV PORT=4000
ENV NODE_ENV=production

EXPOSE 4000

# Start the application
CMD ["node", "dist/index.js"]
