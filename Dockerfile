FROM node:22-alpine

WORKDIR /app

# Enable pnpm via corepack (built into Node 20, no npm install needed)
RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

# Copy workspace manifests first — Docker caches this layer until they change
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Generate Prisma client + build the API
RUN pnpm --filter @sme-mall/api db:generate && \
    pnpm --filter @sme-mall/api build

EXPOSE 3001

CMD ["node", "apps/api/dist/server.js"]
