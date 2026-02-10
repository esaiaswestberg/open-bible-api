FROM oven/bun:canary AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Final stage
FROM oven/bun:canary-slim

WORKDIR /app

# Install dependencies for downloading and extracting translations
RUN apt-get update && apt-get install -y curl p7zip-full && rm -rf /var/lib/apt/lists/*

# Copy node_modules and source from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
COPY entrypoint.sh ./

# Create logs directory
RUN mkdir ./logs

# Set default environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV TRANSLATIONS_PATH=./translations
ENV GH_REPO=esaiaswestberg/open-bible-api
ENV LOG_LEVEL=info
ENV LOG_FILE_PATH=./logs/app.log
ENV CORS_ENABLED=true

EXPOSE 3000

# Use entrypoint script to handle translation download
ENTRYPOINT ["./entrypoint.sh"]

# Run with bun
CMD ["bun", "run", "src/main.ts"]
