# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set API key (needed for MapView component to avoid errors during render)
ENV REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyDTyBgvYaBVGYJR0jZixVMJf-kbbHaIuFs

# Forces Webpack to use absolute paths (CRITICAL for routing)
ENV PUBLIC_URL=/

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx (includes index.html and /static)
# This copy is what moves the compiled React code.
COPY --from=build /app/build /usr/share/nginx/html

# Copy the basic Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]