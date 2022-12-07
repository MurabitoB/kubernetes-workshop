# Docker 

## 前言

Docker 是當前主流的容器化工具，本次實作會使用 Dockerfile 來建立一個簡單的 nginx 容器，將靜態網頁放置在容器中。

## 安裝 Docker Desktop
https://www.docker.com/products/docker-desktop/


## 基本的 Docker 指令

1. 下載 Docker Image

    ```bash
    docker pull nginx
    ```
2. 建立 Docker Container

    ```bash
    docker run -d -p 80:80 --name my-nginx nginx
    ```
3. 查看 Docker Container

    ```bash
    docker ps
    ```
4. 停止 Docker Container

    ```bash
    docker stop my-nginx
    ```
5. 刪除 Docker Container

    ```bash
    docker rm my-nginx
    ```
6. 刪除 Docker Image

    ```bash
    docker rmi nginx
    ```
7. 查看 Docker Image

    ```bash
    docker images
    ```
8. 編譯 Docker File

    ```bash
    docker build -t my-nginx .
    ```
9. 推送 Docker Image 至 Docker Hub(或者其他的 Docker Registry)

    ```bash
    docker push my-nginx
    ```

## 建立 Dockerfile

Dockerfile 是一個文本檔，內容包含了一系列指令，這些指令會被 Docker 依序執行，最後建立出一個 Docker Image。

> 慣例上 Docker File 的檔名為 Dockerfile，並且放置在專案的根目錄下。

## 範例專案

本次 Demo 會包含：

1. Angular 專案（CSR/SPA）
2. .NET Core WEB 專案

## 如何指定 Container Registry?

參考： https://ithelp.ithome.com.tw/articles/10202551

