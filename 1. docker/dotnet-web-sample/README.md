# .NET Core

這個專案是一個非常乾淨的 .NET 6 專案，並且使用 minimal API 架構暴露服務。

該專案是透過以下指令建立：

```bash
dotnet new web 
```

## 背景知識

### .NET Core 的環境變數

關於詳細的說明可以參照下面文件：
[官方文件](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?tabs=basicconfiguration&view=aspnetcore-6.0)

由於 .NET Core 是一個跨平台的框架，所以關於變數的取得不會像在 IIS 上一樣透過 Web.config 來取得，而是透過環境變數或者是設定檔來取得。

在 .NET Core 中，環境變數的優先順序覆蓋關係如下：

1. 作業系統環境變數
2. 該環境底下的 appsettings.json `ex: appsettings.Development.json`
3. 無環境後綴的 appsettings.json

### 如何辨別當前環境

在本地開發的話，可以透過 `Properties` 資料夾底下的 `launchSettings.json` 切換開發時的環境。

其原理是透過在開發時執行程式的時候覆蓋環境變數 `ASPNETCORE_ENVIRONMENT` 的值來切換環境。

```json
  "profiles": {
    "dotnet_web_sample": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "applicationUrl": "https://localhost:7005;http://localhost:5135",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
```

如果該作業系統裡面沒有 `ASPNETCORE_ENVIRONMENT` 的環境變數，則預設值為 Production。

### 如何透過環境變數覆蓋

假設目前的 appsetting.json 有以下設定值

```json
{
  "Variable":"Test",
  "VariableInObject":{
    "Key":"Varriable In appsetting.Json"
  },
  "VariableInArray":[
    "Varriable In appsetting.Json"
  ]
}
```

假設目前的 appsetting.Development.json 有以下設定值

```json
{
  "Variable":"Test in Development",
  "VariableInObject":{
    "Key":"Varriable In appsetting.Development.Json"
  },
  "VariableInArray":[
    "Varriable In appsetting.Development.Json"
  ]
}
```

假設目前作業系統有以下環境變數

```bash
export Variable=Test in Environment Variable
export VariableInObject__Key=Varriable In Environment Variable
export VariableInArray__0=Varriable In Environment Variable
```

則最後的結果會是

```json
{
  "Variable":"Test in Environment Variable",
  "VariableInObject":{
    "Key":"Varriable In Environment Variable"
  },
  "VariableInArray":[
    "Varriable In aVarriable In Environment Variable"
  ]
}
```

因為沒有設定 `ASPNETCORE_ENVIRONMENT` 的環境變數，所以會使用預設的 Production 環境。

而 Production 環境的設定值為空，所以會使用 appsettings.json 的設定值，而作業系統的環境變數會覆蓋掉 appsettings.json 的設定值。

> 強烈建議使用作業系統的環境變數來作為覆蓋設定值的來源，因為該做法優先度最高

## 相關設定檔

1. /appsettings.json

```json
{
  "Variable":"Test",
  "VariableInObject":{
    "Key":"Varriable In appsetting.Json"
  },
  "VariableInArray":[
    "Varriable In appsetting.Json"
  ]
}
```

2. /Dockerfile

```dockerfile
#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

# Copy Solution file and Project files for restore purpose
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "dotnet-web-sample.dll"]
```

## 執行方式

1. 透過 Docker CLI 打包治本機端

```bash
docker build -t dotnet-web-sample .
```

2. 透過 Docker CLI 執行

```bash
docker run -p 7005:80 -e Variable="Varriable In Environment Variable" -e VariableInObject__Key="Varriable In Environment Variable" -e VariableInArray__0="Varriable In Environment Variable" dotnet-web-sample
```

3. 透過 Docker CLI 打包至 Docker Hub

```bash
docker build -t dotnet-web-sample .
docker tag dotnet-web-sample:latest <your-docker-hub-account>/dotnet-web-sample:latest
docker tag dotnet-web-sample:latest murabitob.azurecr.io/dotnet-web-sample:latest

docker push murabitob.azurecr.io/dotnet-web-sample:latest
```

## 備註

如果你的環境是 m1 晶片的 mac，請將 build 的指令換成以下指令

```bash
docker buildx build --platform=linux/amd64 -t dotnet-web-sample .
```