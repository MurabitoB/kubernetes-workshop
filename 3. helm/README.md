# Helm

Helm 是 Kubernetes 的套件管理工具，可以透過該工具來打包 Kubernetes 的設定檔，並且可以透過 Helm Chart 來部署 Kubernetes 的服務。

## 什麼是 Chart？

Chart 是 Helm 的 Packkge 的單位，裡面包含了K8s 相關的 template 和 configuration。

例如以下指定可以模擬安裝 apache server
  
```bash
helm install apache bitnami/apache  
```

## Helm 的好處

1. 版控：部署紀錄會保留在 kubernetes 的 namespace 底下的 secret 中，並且可以 rollback 到之前的版本。
2. 一致性： 由於所有的 Kubernetes 的異動都須透過 Package ，所以無法直接去修改 Cluster。
3. 動態設定值：可以透過 `values.yaml` 來設定動態的值，例如：設定不同的 namespace 來部署服務。

## 建立 Helm Chart

透過下面的指令可以得到一個 nginx 的 Helm Chart 範本，再透過修改該範本來建立自己的 Helm Chart。

```bash
helm create <chart name>
```

### 範本結構

```bash
├── .helmignore #功能就像是 .gitignore，用來決定哪些檔案在 packaging 的時候不要被包進去
├── Chart.yaml # Chart 的基本資訊
├── charts # 依賴的 Chart
├── templates # kubernetes yaml 模板
│   ├── NOTES.txt
│   ├── _helpers.tpl # 自定義函式
│   ├── deployment.yaml
│   ├── hpa.yaml
│   ├── ingress.yaml
│   ├── serviceaccount.yaml
│   ├── service.yaml
│   └── tests
│       └── test-connection.yaml
└── values.yaml # 可以動態設定的值

```

## 安裝 Remote 的 Helm Chart 到 Kubernetes

新增 `bitnami` 的 Helm Chart Repository

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
```

## 安裝 Helm Chart 到 Kubernetes

透過 `helm install` 指令可以安裝本地的 Helm Chart 到 Kubernetes，要注意的是，他會依照目前 `kubectl` 的 context 來決定要安裝到哪個 cluster。

```bash
helm install <chart name> <chart path>
```

EX:

```bash
helm install apache bitnami/apache
```

