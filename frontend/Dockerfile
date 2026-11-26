FROM node:24-alpine AS construcao
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
RUN npm run build

FROM nginx:1.30-alpine
COPY --from=construcao /app/dist /usr/share/nginx/html
EXPOSE 80
