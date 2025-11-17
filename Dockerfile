# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Git & LFS and enable it
RUN apk add --no-cache git git-lfs && git lfs install

# Copy source code
COPY . .

# Pull actual LFS objects
RUN git lfs pull

# Set API key directly
ENV REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyDTyBgvYaBVGYJR0jZixVMJf-kbbHaIuFs

# Build the app
RUN npm run build

# Production stage - rebuild to fix images
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy public files directly from source (React build doesn't always copy everything)
COPY public/images /usr/share/nginx/html/images
COPY public/*.mp3 /usr/share/nginx/html/

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]