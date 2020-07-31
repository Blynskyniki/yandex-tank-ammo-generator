# Генератор патронов для [яндекс танка](https://github.com/yandex/yandex-tank)

## Установка
* у вас должен быть установлен nodejs и npm
[**nodesource**](https://github.com/nodesource/distributions/blob/master/README.md)

``` bash
#  Ubuntu
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

```

``` sh
npm i -g yandex-tank-ammo-generator

```

 **Настройка танка**
 * Пример конфигурации 

``` yaml
phantom:
  address: ya.ru:443 
  ssl: true
  header_http: '1.1'
  ammofile: ./ammo.txt # ваш пак  патронов
  load_profile:
    load_type: rps # schedule load by defining requests per second
    schedule: line(20, 450, 1m) #const(150, 60)
```




### Утилиты 
###### **(При создании файлов расширение будет установлено автоматически)**
#### Генератор тестовых данных из ELASTIC(Graylog,ELK)
*Парсит логи из эластика и подготавливает конфиг для генерации патронов*
```  bash
tank-gen-test-data --help
tank-gen-test-data -c ./config.json  -o ./my_json_conf

```
#### Генератор патронов из json
*Из заранее подготовленого *json* генерирует патроны*
```bash
tank-create-ammo --help
tank-create-ammo  -u Yandex-Tank-Dev -f ./my_json_conf.json -o  myfile

```
#### Генератор патронов из ELASTIC(Graylog,ELK)
*Парсит логи эластика и сразу генерирует патроны (нет возможности посмотреть конфиг), что по сути обьединяет первые 2 утилиты*
```bash
tank-gen-ammo--help 
tank-gen-ammo -c ./config.json  -o my_artillery -u Yandex-Tank-Dev
```



### Примеры конфигурационных файлов 

*tank-gen-test-data и tank-gen-ammo*

``` json
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

* tank-create-ammo *

``` json
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

### Результат
* Далее патроны можно скармливать танку*
``` txt
583 POST_/ecommerce/goods/eshop/catalog 
POST /ecommerce/goods/eshop/catalog HTTP/1.1
Host: i-dev.api.test.abc
User-Agent: Yandex-Tank-Dev
Content-Type: application/json; charset=utf-8
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6ImEwYjhhNDAyLTdhNmQtNDdkZS05MWFlLWE2OTBhY2U4YzQ3YiIsImlzVGVtcCI6dHJ1ZSwiaWF0IjoxNTk1NjQ0OTgwLCJleHAiOjE1OTYyNDk3ODB9.mrLKgVWVA2_tg5a_21xDKvsrW7uk9aAyzD_rFfL8ujE
Content-Length: 187

{"cond":{"guids":["150","802","908"]},"sort":"popular","size":24,"page":1,"filters":{"price":{"min":399,"max":1587},"sizes":["28","29"],"deliveryType":"ALL","showRetailGroupsArray":true}}

233 POST_/ecommerce/goods/eshop/productsCard 
POST /ecommerce/goods/eshop/productsCard HTTP/1.1
Host: i-dev.api.test.abc
User-Agent: Yandex-Tank-Dev
Content-Type: application/json; charset=utf-8
Authorization: 
Content-Length: 46

{"articuls":["00906840"],"withTableSize":true}

233 POST_/ecommerce/goods/eshop/productsCard 
POST /ecommerce/goods/eshop/productsCard HTTP/1.1
Host: i-dev.api.test.abc
User-Agent: Yandex-Tank-Dev
Content-Type: application/json; charset=utf-8
Authorization: 
Content-Length: 46

{"articuls":["00906690"],"withTableSize":true}
```
