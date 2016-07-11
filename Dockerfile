FROM node:18-alpine

# Create and set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files for the backend and frontend
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install backend and frontend dependencies
RUN cd server && npm install
RUN cd client && npm install

# Copy the backend and frontend source code to the container
COPY server/ ./server/
COPY client/ ./client/

# Build the frontend
RUN cd client && npm run build

# Expose the ports used by the backend and frontend
EXPOSE 3000
EXPOSE 3002

# Start the backend and frontend servers
CMD ["npm", "run", "start"]
