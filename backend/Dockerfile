FROM node:24-alpine AS construcao
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

FROM node:24-alpine
ENV NODE_ENV=production NPM_CONFIG_UPDATE_NOTIFIER=false
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=construcao /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
