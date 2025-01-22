# Use an official Node.js image as the build environment
FROM node:18-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code to the container
COPY . .

# Build the application
RUN npm run build

# Use an official Nginx image as the base for the production environment
FROM nginx:stable-alpine

# Copy the built React files to the Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# (Optional) Copy a custom Nginx configuration file if necessary
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx will listen on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
