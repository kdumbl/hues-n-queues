FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy dependency files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source
COPY . .

# Expose backend port
EXPOSE 5001

# Start the server
CMD ["npm", "run", "dev"]

