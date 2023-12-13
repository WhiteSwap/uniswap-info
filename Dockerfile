FROM node:16.19.0 as node 
COPY / /app
WORKDIR /app

RUN npm install -g pnpm@8.1.0
RUN npm install -g cross-env
RUN pnpm config set auto-install-peers true
RUN pnpm preinstall
RUN pnpm install 
RUN pnpm build
FROM nginx 
COPY --from=node /app/dist /var/www/front 
COPY --from=node /app/nginx/info-portal.wswap-st.com.conf /etc/nginx/conf.d/
