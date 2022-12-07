# Azure 

Azure 是由微軟提供的雲端服務，提供了許多的服務，包含虛擬機器、資料庫、容器服務、Kubernetes 服務、雲端儲存等等。

在這個我們會簡單的介紹怎麼使用 Azure CLI 來從既有的 Azure Kubernetes Service 取得 Cluster 權限到本地端。

在開始操作之前，請先參照以下連結進行安裝：

https://learn.microsoft.com/zh-tw/cli/azure/install-azure-cli


## 操作過程

### 1. 登入 Azure

請透過以下指令登入 Azure：

```bash
az login
```
使用該指令後，會跳出瀏覽器，請登入 Azure 帳號，並且允許登入。

### 2. 取得 AKS Cluster 權限

