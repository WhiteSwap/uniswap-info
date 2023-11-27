FROM node:16.18.0 as node 
COPY / /app
WORKDIR /app

RUN pnpm ci
RUN pnpm run build

FROM nginx 
COPY --from=node /app/build /var/www/front 
COPY --from=node /app/nginx/info-portal.wswap-st.com.conf /etc/nginx/conf.d/
