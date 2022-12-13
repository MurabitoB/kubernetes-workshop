# Angular Sample

## 這個專案將會演示如何使用 Docker 來打包一個 Angular 純 SPA 的環境

## 打包方法說明

該專案是透過 nginx server 來自動把所有的 request 都導向到 index.html，這樣就可以讓 Angular Router 來處理所有的 routing 問題。

## 相關設定檔

1. /angular.json (指定編譯輸出的位置至 dist 資料夾)
```json
 "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist",
```
2. /Dockerfile
```dockerfile
# 第一階段產生dist資料夾
FROM timbru31/node-alpine-git:latest as builder
ARG VAR_BUILD_MODE
#RUN echo VAR_BUILD_MODE=${VAR_BUILD_MODE:build}
# 指定預設/工作資料夾
WORKDIR /usr/app
# 只copy package.json檔案
COPY ./package*.json ./
# 安裝dependencies
RUN npm install
# copy其餘目錄及檔案
COPY ./ ./
COPY src src
# 指定建立build output資料夾，--prod為Production Mode
RUN npm run build
# pull nginx image
FROM nginxinc/nginx-unprivileged
# 從第一階段的檔案copy
COPY --from=builder /usr/app/dist /usr/share/nginx/html # 這邊會跟 angular.json 切齊
# 覆蓋image裡的設定檔
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
USER root


```
3. /nginx-custom.conf
```nginx
server {
    listen 0.0.0.0:8080; #監聽 8080 port
    listen [::]:8080;

    default_type application/octet-stream;

    gzip                    on;
    gzip_comp_level         6;
    gzip_vary               on;
    gzip_min_length         1000;
    gzip_proxied            any;
    gzip_types              text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_buffers            16 8k;
    gunzip on;
    client_max_body_size    256M;

    root /usr/share/nginx/html;

    location / { # 將所有的 request 都導向到 index.html
        try_files $uri $uri/ /index.html =404;
    }
}
```

## 執行方式


1. 透過 Docker CLI 打包至本機端
```bash
docker build -t docker-angular-sample . 
```
2. 在本機端執行
```bash
docker run -d -p 8080:8080 docker-angular-sample
```
3. 透過 Docker CLI 打包至 Docker Hub
```bash
docker build -t docker-angular-sample .
docker tag docker-angular-sample:latest murabitob.azurecr.io/docker-angular-sample:latest
docker push murabitob.azurecr.io/docker-angular-sample:latest
```

## 備註

如果你的環境是 m1 mac，請使用以下指令來打包

```bash
docker buildx build --platform=linux/amd64 -t docker-angular-sample . 
```
