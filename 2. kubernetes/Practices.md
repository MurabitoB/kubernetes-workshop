## 目的

透過練習一些基本的語法，來熟悉 Kubernetes 的使用方式。

## 練習 1
列出所有的 Cluster 列表。
<details>
 <summary>解答</summary>

 ```bash
 kubectl config get-contexts
 ```
</details>

## 練習 2

建立一個 nginx 的 Pod，並且將它的 port 80 。

<details>
 <summary>解答</summary>

 ```bash
 kubectl run nginx --image=nginx --port=80 --namespace=<yournamespace>
 ```
</details>

## 練習 3

取得目前環境中的 Pod 列表。
<details>
 <summary>解答</summary>

 ```bash
  kubectl get pods
 ```
</details>

## 練習 4

查看目前環境中的 Pod 的詳細資訊。
<details>
 <summary>解答</summary>

 ```bash
  kubectl describe pod nginx
 ```
</details>


## 練習 5

建立一個 deployment，並且將它的 replicas 數量設定為 3。

<details>
 <summary>解答</summary>

 ```bash
 kubectl create deployment nginx --image=nginx --replicas=3
 ```
 </details>


 ## 練習 6

查看目前環境中的 Deployment 列表。

<details>
 <summary>解答</summary>

 ```bash
 kubectl get deployments
 ```
 </details>

## 練習 7

查看目前環境中的 Deployment 的詳細資訊。

<details>
 <summary>解答</summary>

 ```bash
 kubectl describe deployment nginx
 ```
 </details>

## 練習 8
使用 Service 把 nginx 的 port 80 對應到本機的 8080。

<details>
 <summary>解答</summary>

 ```bash
 kubectl expose deployment nginx --port=80 --target-port=80 --type=NodePort
 ```
 </details>

## 練習 9

使用 --dry-run 指令在本地端輸出剛剛嘗試建立的 Service / Deployment 的 yaml 檔案。

<details>
 <summary>解答</summary>

 ```bash
 kubectl create deployment nginx --image=nginx --replicas=3 --dry-run -o yaml
 ```

  ```bash
  kubectl expose deployment nginx --port=80 --target-port=80 --type=NodePort --dry-run -o yaml
  ```
 </details>
