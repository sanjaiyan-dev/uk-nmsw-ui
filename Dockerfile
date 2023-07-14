FROM node:18-alpine as builder

ENV NMSW_DATA_API_BASE_URL=REPLACE_NMSW_DATA_API_BASE_URL
ENV GA_TOKEN=REPLACE_GA_TOKEN

COPY package*.json ./
COPY . /src
WORKDIR /src

RUN apk update && apk upgrade --no-cache && rm -Rf /var/cache/apk/* \
    && npm ci && npm cache clean --force \
    && npm run build

# Now build the final image based on Nginx
FROM alpine:3 as proxy
ENV NGINX_CONFIG_FILE=/etc/nginx/nginx.conf
RUN apk upgrade --no-cache && \
    apk add --no-cache nginx bash nginx-mod-http-lua && \
    install -d -g nginx -o nginx /run/nginx && \
    chown -R nginx:nginx /etc/nginx /var/log/nginx

COPY --from=builder /src/dist/ /usr/share/nginx/html
COPY /nginx/nginx.conf /etc/nginx/nginx.conf
COPY --chown=100 /nginx/run.sh /run.sh

RUN chmod 700 /run.sh \
    && chown nginx /usr/share/nginx/html

# UID for nginx user
USER 100
EXPOSE 8080
ENTRYPOINT ["/run.sh"]
