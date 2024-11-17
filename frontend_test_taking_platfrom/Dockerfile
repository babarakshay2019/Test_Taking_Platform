# Frontend Dockerfile
FROM node:16

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./
CMD npm install

# Copy the rest of the React app files
COPY . .

# Ensure the app starts in development mode
CMD ["npm", "start"]

EXPOSE 3000
