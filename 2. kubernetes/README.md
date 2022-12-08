# Kubernetes

練習題目請參照：

[Practices.md](Practices.md)

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

