# Use Node 25 as base image
FROM node:25-bookworm AS builder

WORKDIR /app

# The full bookworm image already has python3, make, g++, and openssl installed.
# We skip the apt-get install step here.

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma client and build Next.js application
RUN npm run build

# Runner stage
FROM node:25-bookworm-slim AS runner

WORKDIR /app

# Install OpenSSL for Prisma in the runtime environment
RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]
