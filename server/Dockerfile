FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
RUN npm install

COPY . .

EXPOSE 5000

# Use ts-node-dev for hot reload in development
CMD ["npm", "run", "dev"]
