# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set API key directly
ENV REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyDTyBgvYaBVGYJR0jZixVMJf-kbbHaIuFs

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy public files directly (React build copies them automatically)
# But let's ensure they're there by copying them explicitly
COPY public/images /usr/share/nginx/html/images
COPY public/*.mp3 /usr/share/nginx/html/

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]