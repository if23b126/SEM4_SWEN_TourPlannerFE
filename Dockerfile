# Use the official Node.js image for building Angular
FROM node:24

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install Angular dependencies
RUN npm install

# Copy the application code into the container
COPY . .

# Build the Angular app
RUN npm run build --omit=dev

# Use Nginx to serve the built Angular app
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/*.html
RUN mv /usr/share/nginx/html/tour-planner-fe/browser/* /usr/share/nginx/html


# Expose port for Angular app
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]

# Steps to create image:
# docker build -t tourplannerfe:latest .
# docker tag tourplannerfe if23b126/tourplannerfe:latest
#docker push if23b126/tourplannerfe:latest
