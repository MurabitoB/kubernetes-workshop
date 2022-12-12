# Kubernetes

## 關於 Kubernetes
Kubernetes 是一個 Container 管理系統，它可以幫助我們管理多個 Container，並且提供一個高可用的環境。

透過 `kubectl` 這個 CLI 工具，我們可以透過指令來操作 Kubernetes。

如果你想要了解更多 Kubernetes 的基本概念，可以參考 [Kubernetes Concepts](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/)。

## 關於 Namespace
Namespace 是 Kubernetes 的資源管理單位，類似一個資料夾，可以把 Kubernetes Objects 根據業務領域進行管理。

## 關於 Pod 
Pod 是 Kubernetes 的最小單位，一個 Pod 可以包含一個或多個 Container，這些 Container 會共享相同的 Network Namespace，並且可以透過 localhost 來互相溝通。

## 關於 ReplicaSet
ReplicaSet 是一個 Controller，它會監控目前環境中的 Pod，並且保持目前環境中的 Pod 數量與 ReplicaSet 中的 Pod 數量一致。

## 關於 Deployment
Deployment 是一個 Controller，它會監控目前環境中的 ReplicaSet，並且保持目前環境中的 ReplicaSet 數量與 Deployment 中的 ReplicaSet 數量一致。

## 關於 Service
Service 是一個抽象層，它會將一個或多個 Pod 組合成一個 Service，並且提供一個固定的 IP 位址，讓外部的服務可以透過這個 IP 位址來存取這個 Service。

## 關於 Ingress
Ingress 暴露出 HTTP 或 HTTPS 的路由，提供給外部的服務來存取 Kubernetes 的服務。

## 關於 ConfigMap
ConfigMap 是一個用來儲存設定檔的物件，它可以讓我們將設定檔與程式碼分開，並且可以透過 ConfigMap 來傳遞設定檔給 Container。

## 關於 Secret
Secret 是一個用來儲存敏感資訊的物件，它可以讓我們將敏感資訊與程式碼分開，並且可以透過 Secret 來傳遞敏感資訊給 Container。

## 關於本次 Demo

本次練習預計將 `1. docker` 的 Angular 及 .NET Core 專案，透過 Kubernetes 來部署。

不過在開始實做之前，請先練一下基本的 Kubernetes 指令。

練習題目請參照：
[Practices.md](Practices.md)

## 開始練習

1. 建立一個名為 `demo` 的 Namespace

```bash
kubectl create namespace demo
```

2. 建立一個名為 `docker-angular-sample` 的 deployment，但是不要 apply 到環境上，而是透過 `--dry-run` 來檢查是否有錯誤，其要包含 2 個 Pod，並且使用 `docker-angular-sample` 的 image，`namespace` 指定為 `demo`， port 

```bash
kubectl create deployment docker-angular-sample --image=<registry>/docker-angular-sample --dry-run -o yaml --replicas=2 --namespace demo
```

3. 將上述指令轉成檔案，存放到 yamls/angular/deployment.yaml

```bash
kubectl create deployment docker-angular-sample --image=murabitob.azurecr.io/docker-angular-sample --dry-run=client -o yaml --replicas=2 --namespace demo > yamls/angular/deployment.yaml
```

4. 建立一個 service 來暴露上述的 deployment 所建立的 pod，並且將 service 的 type 指定為 `NodePort`，並且將 port 指定為 `80`，`namespace` 指定為 `demo`。

```bash
kubectl expose deployment docker-angular-sample --type=NodePort --port=80 --target-port=8080 --dry-run=client -o yaml --namespace=demo > yamls/angular/service.yaml
```

## 延伸閱讀
