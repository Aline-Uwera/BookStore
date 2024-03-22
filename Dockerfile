# Use official Node.js image as base
FROM node:18

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to work directory
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy rest of the application source code to work directory
COPY . .

# Copy .env file to container
COPY .env ./

# Expose the port your app runs on
EXPOSE 8080

# Command to run your app using npm
CMD ["npm", "run", "start:prod"]
