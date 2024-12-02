FROM node:16-alpine AS builder

WORKDIR /app

WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install --production
# Copy app files
COPY . .
# Build the app
RUN npm run build

# # Install Serve to serve static build folder
RUN npm install -g serve

# Bundle static assets with nginx
FROM nginx:1.23-alpine as production
ENV NODE_ENV production
# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 8080
ENV PORT 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]