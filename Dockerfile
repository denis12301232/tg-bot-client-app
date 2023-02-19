FROM node:lts-alpine as build

WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json .
RUN npm i

# Copy rest of the files
COPY . .

# Build the project
RUN npm run build-only


FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]