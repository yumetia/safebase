FROM node:22-alpine
RUN apk add --no-cache docker-cli postgresql-client openssh-client
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
