# Use the official Node.js image as a base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

ENV DB_HOST="localhost"
ENV DB_PORT="3306"
ENV DB_USER="root"
ENV DB_PASSWORD="root"
ENV DB_NAME="rekolekcje"

# Build the Next.js app
RUN npm run build

# Expose the port Next.js is running on
EXPOSE 3000

# Command to run the Next.js app
CMD ["npm", "start"]
