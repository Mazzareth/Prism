FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app ./app


ENV POSTGRES_USER=${POSTGRES_USER:-postgres}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}
ENV POSTGRES_DB_NAME=${POSTGRES_DB_NAME:-webdb}
ENV DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB_NAME}"

EXPOSE 3000

CMD ["npm", "run", "dev"]