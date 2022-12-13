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


## 安裝 Remote 的 Helm Chart 到 Kubernetes

新增 `bitnami` 的 Helm Chart Repository

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
```

## 安裝 Helm Chart 到 Kubernetes

透過 `helm install` 指令可以安裝 Helm Chart 到 Kubernetes，要注意的是，他會依照目前 `kubectl` 的 context 來決定要安裝到哪個 cluster。

```bash
helm install <chart name> <chart path>
```

EX:

```bash
helm install apache bitnami/apache
```

如果要安裝本地的 Helm Chart，可以透過 `.` 來指定。

```bash
helm install <chart name> .
```

## Chart.yaml

```yaml
apiVersion: v2
name: <chart name>
description: A Helm chart for Kubernetes
type: application
version: 0.1.0
appVersion: 1.16.0
```

- type
    - 可以為 application 或者 library
        - library 可被其他 application 引入，並定義一些 function
- version
    - Chart 的版本號 (每次修改都要更新)
- appVersion
    - 程式的版本號
- icon
    - 可以提供 chart 的縮圖
- keyword
    - 就是關鍵字
- resources
    - 提供資訊用來表示自己的專案可以從哪裡下載
- maintainers
    - 維護者

## values.yaml

values.yaml 為可以動態設定的值，可以透過 `--set` 來覆蓋，例如：

```bash
helm install <chart name> --set image.tag=1.16.0
```

## _helpers.tpl

可以在 template 中使用的函式，例如：

```bash
{{- define "chart.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}
```

## 將 Helm Chart 推送到 Azure Container Registry

1. 設定環境變數，支援 OCI 標準

```bash
export HELM_EXPERIMENTAL_OCI=1
```

2. 將 Helm Chart 打包成 OCI 標準

```bash
helm chart save <chart name> <registry url>/<chart name>:<tag>
```

3. 將 Helm Chart 推送到 ACR

```bash
helm chart push <registry url>/<chart name>:<tag>
```
