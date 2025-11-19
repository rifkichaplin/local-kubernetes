# 1) Build stage
FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

# 2) Runtime stage
FROM node:20-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
