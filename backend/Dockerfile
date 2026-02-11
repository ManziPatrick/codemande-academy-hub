FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Environment variables
ENV HOST=::
ENV PORT=4000
ENV NODE_ENV=production

EXPOSE 4000

# Run all seeds and start the application
CMD echo "Starting seeding process..." && \
    node dist/seed.js && echo "✅ Main seed completed" && \
    node dist/seedInternship.js && echo "✅ Internship seed completed" && \
    node dist/seedBlogs.js && echo "✅ Blogs seed completed" && \
    node dist/seedTestUsers.js && echo "✅ Test users seed completed" && \
    node dist/seedAICourses.js && echo "✅ AI courses seed completed" && \
    node dist/seedPublicTeam.js && echo "✅ Team seed completed" && \
    echo "🚀 All seeds completed! Starting application..." && \
    node dist/index.js