# Ingress Comm Automatically send message

### Tips: Nodejs version

Add the file run.js to the scheduled task, for 15 minutes

##### run service

Run Version: es6
Required modules: request, SQLite3, tough-cookie-filestore, cheerio

```shell
npm install request --save
npm install sqlite3 --save
npm install cheerio --save
```

Original 'tough-cookie-filestore' problem, please use my modified 'tough-cookie-filestore'

```shell
npm install https://github.com/zishang520/tough-cookie-filestore.git --save
```

Or

```shell
npm install
```

---------------------------------------
run

```nodejs
nodejs run.js
```

---------------------------------------
### Configuration Information:

service/data/conf.json.default modify the configuration and renamed conf.json