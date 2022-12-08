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
COPY --from=builder /usr/app/dist /usr/share/nginx/html

# 覆蓋image裡的設定檔
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf


USER root

