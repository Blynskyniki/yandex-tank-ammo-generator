# Генератор патронов для  [яндекс танка](https://github.com/yandex/yandex-tank)
## Настройка танка
```
phantom:
  address: ya.ru:443
  ssl: true
  header_http: '1.1'
  ammofile: ./ammo.txt 
  load_profile:
    load_type: rps # schedule load by defining requests per second
    schedule: line(20, 450, 1m) #const(150, 60) 
```
##### Тип патронов 
###### ammo-type : Request-style
###### YAML-file configuration: phantom

## Установка

```js
npm i -g yandex-tank-ammo-generator

```
## Как пользоваться 
```
tank-gen-test-data --help <--- Генератор тестовых данных из ELASTIC(Graylog,ELK)
tank-create-ammo--help  <----- Генератор патронов из json 
tank-gen-ammo--help <--------- Генератор патронов из ELASTIC(Graylog,ELK)
```

#### Пример конфига для tank-gen-test-data  и tank-gen-ammo
```
{
  "host": "хост в заголовках запросов",
  "index": "Индекс в Эластике",
  "elastic": {
    "uri": "http://elastic.ru:9200",
    "auth":"login:pass" <-- опционально
  },
  "limit": 15,
  "query": {
    "sort": {
      "field": "responseTime",
      "type": "DESC"
    }
  },
  "routes": [
    {
      "route": "/ecommerce/get",
      "method": "post"
    },
    {
      "route": "/catalog/data",
      "method": "get"
    }
  ]
}


```
#### Пример конфига для tank-create-ammo
```
{
  "name": "Мой Пак Патронов",
  "host": "i-dev.api.qq.com",
  "data": [
    {
      "method": "post",
      "tag": "qqq",
      "headers": { "Authorization": "Bearer 8f81c7fe-f5a1-4322-80fa-b54a6553bba9" },
      "body": { "filters": {}, "size": 24, "page": 1 },
      "path": "/ecommerce/goods/eshop/catalog"
    },
    { "method": "GET", "path": "/catalog/zhenshchinam/zhenskaya-obuv/?opt=all", "body": null }
  ]
}

```
