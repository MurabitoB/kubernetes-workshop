# Kubernetes Cheetsheet

| 說明 | 指令 | 參數|
| --- | --- | --- |
| 取得目前有權限的 Cluster 列表 | kubectl config get-contexts ||
| 設定當前指定所要操作的 Cluster | kubectl config use-contexts {cluster name} ||
|建立 Kubernetes Objects 重複會報錯|kubectl create | `-f {filename}` 透過設定檔 \| `--dry-run=client` 不實際設定到 cluster 上 \| `-o yaml` 將結果輸出成 yaml  |
|建立 Kubernetes Objects 重複會覆蓋|kubectl apply | `-f {filename}` 透過設定檔 \| `--dry-run=client` 不實際設定到 cluster 上 \| `-o yaml` 將結果輸出成 yaml |
| 檢視 k8s object 列表 | kubectl get {pods\|deployments\|services\|.etc}|`--namespace={namespace}`指定特定的 namespace(預設為 default)|
|透過 `vim` 直接編輯線上的 k8s object 編輯完成後自動更新環境| kubectl edit {k8s object} {object name}| |
|取得 POD 的 Shell|kubectl exec --srtin --tty {pod name} -- bin|
| 給 Deployment 建立 Service | kubectl expose deploy {deploy-name} --type=<NodePort,ExternalIP,ClusterIP> --name={service-name} |
| Portforwarding 到本機 | kubectl port-forward {object type}/{object name} {local port}:{binding port}