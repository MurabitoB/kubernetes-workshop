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

### Angular 專案

這個專案會用 `docker-angular-sample`  image 進行部署，並包含 deployment, service, configMap 等 k8s objects。

此外，該練習會使用 configMap 來替換 env.json 中的設定，並且將 configMap 的設定檔透過 volume 的方式，掛載到 container 中。

1. 建立一個名為 `demo` 的 Namespace

```bash
kubectl create namespace demo
```

2. 建立一個 deployment，但是不要 apply 到環境上，而是透過 `--dry-run` 來檢查是否有錯誤，其要包含 2 個 Pod，並且使用 `docker-angular-sample` 的 image，`namespace` 指定為 `demo`，並且指定 container port 為 8080。

```bash
kubectl create deployment docker-angular-sample --image= k8sworkshop.azurecr.io/docker-angular-sample --dry-run=client -o yaml --replicas=2 --namespace demo
```

修改輸出的 deployment yaml，將 `spec.template.spec.containers[0].ports[0].containerPort` 改為 8080。

```yaml
    spec:
      containers:
      - image:  k8sworkshop.azurecr.io/docker-angular-sample:latest
        name: docker-angular-sample
        resources: {}
        ports: 
          - name: http
            containerPort: 8080
            protocol: TCP
```

3. 建立一個 service 來暴露上述的 deployment 所建立的 pod，並且將 service 的 type 指定為 `NodePort`，並且將 port 指定為 `80`，`namespace` 指定為 `demo`，並且存放到 yamls/angular/deployment.yaml。

```bash
kubectl expose deployment docker-angular-sample --type=LoadBalancer --port=80 --target-port=8080 --dry-run=client -o yaml --namespace=demo > yamls/angular/service.yaml
```

4. 建立 configMap 來儲存 `docker-angular-sample` 的設定檔，並且將設定檔的內容放到 yamls/angular/configmap.yaml。

```bash
kubectl create configmap docker-angular-sample --dry-run=client -o yaml --namespace=demo > yamls/angular/configmap.yaml
```

修改輸出的 configMap yaml，將 `data` 改為以下內容：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: docker-angular-sample
  namespace: demo
data:
  env.json: |
    {
      "value": "value in kubernetes configMap."
    }
```

修改 yamls/angular/deployment.yaml，將 `spec.template.spec.containers[0].volumeMounts` 改為以下內容：

```yaml
  template:
    metadata:
      labels:
        app: docker-angular-sample
    spec:
      containers:
      - image:  k8sworkshop.azurecr.io/docker-angular-sample:latest
        name: docker-angular-sample
        resources: {}
        ports: 
          - name: http
            containerPort: 8080
            protocol: TCP
        volumeMounts:
            - name: env-config
              mountPath: /usr/share/nginx/html/assets/env/env.json
              subPath: env.json
    volumes:
      - name: env-config
        configMap:
          name: docker-angular-sample
```

5. 依序 apply 這些 yaml 到環境上面 

順序： configMap -> deployment -> service

```bash
kubectl apply -f yamls/angular/configmap.yaml
kubectl apply -f yamls/angular/deployment.yaml
kubectl apply -f yamls/angular/service.yaml
```


### .NET Core 專案

這個專案會用 `dotnet-web-sample`  image 進行部署，並包含 deployment, service, configMap 等 k8s objects。

此外，該練習會使用 configMap 來替換作業系統的環境變數，來取代原本的 appsettings.json。

1. 建立一個名為 `demo` 的 Namespace

```bash
kubectl create namespace demo
```

2. 建立一個 deployment，但是不要 apply 到環境上，而是透過 `--dry-run` 來檢查是否有錯誤，其要包含 2 個 Pod，並且使用 `dotnet-web-sample` 的 image，`namespace` 指定為 `demo`，並且指定 container port 為 80。

```bash
kubectl create deployment dotnet-web-sample --image= k8sworkshop.azurecr.io/dotnet-web-sample --dry-run=client -o yaml --replicas=2 --namespace demo > yamls/dotnet/deployment.yaml
```

修改輸出的 deployment yaml，將 `spec.template.spec.containers[0].ports[0].containerPort` 改為 80。

```yaml
    spec:
      containers:
      - image:  k8sworkshop.azurecr.io/dotnet-web-sample:latest
        name: dotnet-web-sample
        resources: {}
        ports: 
          - name: http
            containerPort: 80
            protocol: TCP
```

3. 建立一個 service 來暴露上述的 deployment 所建立的 pod，並且將 service 的 type 指定為 `NodePort`，並且將 port 指定為 `80`，`namespace` 指定為 `demo`，並且存放到 yamls/dotnet/deployment.yaml。

```bash
kubectl expose deployment dotnet-web-sample --type=LoadBalancer --port=80 --target-port=80 --dry-run=client -o yaml --namespace=demo > yamls/dotnet/service.yaml
```

4. 建立 configMap 來儲存 `dotnet-web-sample` 的設定檔，並且將設定檔的內容放到 yamls/dotnet/configmap.yaml。

```bash
kubectl create configmap dotnet-web-sample --dry-run=client -o yaml --namespace=demo > yamls/dotnet/configmap.yaml
```

修改 configMap 的內容，設定環境變數。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: dotnet-web-sample
  namespace: demo
data:
  VariableInObject__Key: "VariableInKubernetesConfigMap"
  VariableInArray__0: "VariableInKubernetesConfigMap"
  Variable: "VariableInKubernetesConfigMap"
```

修改 deployment 的內容，使用 configMap 的環境變數。

```yaml
    spec:
      containers:
      - image:  k8sworkshop.azurecr.io/dotnet-web-sample:latest
        name: dotnet-web-sample
        resources: {}
        ports: 
          - name: http
            containerPort: 80
            protocol: TCP
        envFrom:
          - configMapRef:
              name: dotnet-web-sample
```

5. 依序 apply 這些 yaml 到環境上面 

順序： configMap -> deployment -> service

```bash
kubectl apply -f yamls/dotnet/configmap.yaml
kubectl apply -f yamls/dotnet/deployment.yaml
kubectl apply -f yamls/dotnet/service.yaml
```