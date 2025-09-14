# Stage 1: Build the frontend application
FROM node:20-alpine AS builder

# Set the working directory inside the container.
WORKDIR /app

# Copy the entire Frontend directory contents into the container.
# This ensures all sub-projects are available for imports.
COPY ./ ./

# Install dependencies for the 'HomePage' project only.
RUN npm install --prefix HomePage

# Build the 'HomePage' application.
RUN npm run build --prefix HomePage

# ---
# Stage 2: Serve the built application with Nginx
FROM nginx:alpine

# Copy the custom nginx configuration file.
# The path is now relative to the build context (Frontend directory).
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static files from the 'builder' stage into Nginx's serving directory.
COPY --from=builder /app/HomePage/dist /usr/share/nginx/html

# Expose port 80.
EXPOSE 80

# Command to run Nginx in the foreground.
CMD ["nginx", "-g", "daemon off;"]