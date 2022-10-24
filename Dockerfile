FROM node:16.15.0 as node 
COPY / /app
WORKDIR /app

RUN npm ci
RUN npm run build

FROM nginx 
COPY --node /app/build /var/www/front 
COPY --node /app/nginx/info-portal.wswap-st.com.conf /etc/nginx/conf.d/

