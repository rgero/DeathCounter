# Use the official Node.js image as a base
FROM node:alpine AS build

# Set the working directory inside the container
WORKDIR /DeathCounter

# Copy package.json and package-lock.json (if available)
COPY DeathCounter/package*.json ./

# Copy the .env file
COPY .env ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY DeathCounter ./

# Build the React app
RUN npm run build

# Use an Nginx image to serve the build files
FROM nginx:alpine

# Copy the build files from the previous step
COPY --from=build /DeathCounter/dist /usr/share/nginx/deathcounter

# Copy the custom Nginx configuration file
COPY server/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 6200
EXPOSE 6200

# Start Nginx with the custom configuration
CMD ["nginx", "-g", "daemon off;"]