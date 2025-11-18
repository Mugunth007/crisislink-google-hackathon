# Use Node.js 18-alpine as the base image
FROM node:18.15.0-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
# This uses npm, which matches your project's package-lock.json
COPY package.json package-lock.json ./

# Install dependencies using 'npm ci'
# This is the fast, reliable npm equivalent of 'yarn install --frozen-lockfile'
RUN npm ci

# Copy the rest of your app's source code to the container
COPY . .

# Build the React app
# This runs the "build" script from your package.json
RUN npm run build

# 'npx serve' defaults to port 3000
EXPOSE 3000

# Serve the build
# We serve the 'dist' folder because your project uses Vite
# The '-s' flag correctly handles SPA (React Router) routing
CMD ["npx", "serve", "-s", "dist"]