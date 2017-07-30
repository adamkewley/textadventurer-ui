# TextAdventurer UI

Frontend for
[textadventurer-server](https://github.com/AdamK117/textadventurer-server).


# Overview

This project contains the frontend (html, javascript, css) code for
[textadventurer](https://www.textadventurer.tk). It builds a bundle of
static assets that should be served up using a standard webserver such
as Apache or nginx.

At runtime, the frontend javascript makes calls to a
`textadventurer-server` hosted at the same address. All API calls are
prepended with `api/`. Your webserver should be configured to forward
beginning with `api/` to a `textadventurer-server` instance.

An example of this forarding in nginx:

```
http {
     server {
            server_name www.textadventurer.tk;

            location / {
                     # This folder contains the static assets
                     root /var/www/textadventurer;
            }

            location /api {
                     # textadventurer-server configured on 8080
                     proxy_pass http://localhost:8080;

                     # Remove the api/ prefix the UI uses
                     rewrite ^/api/(.*) /$1 break;

                     # Websockets - used by games
                     proxy_http_version 1.1;
                     proxy_set_header Upgrade $http_upgrade;
                     proxy_set_header Connection "upgrade";
                     proxy_read_timeout 86400;
            }
     }
}
```


# Building

Webpack is used to build the project:

```
npm install && ./node_modules/webpack/bin/webpack.js
```

Which puts the static assets into `dist/`. The static assets should
then be deployed to your server. Assuming you are doing something
similar to the configuration above:

```
scp -r dist/* admin@www.textadventurer.tk:/var/www/textadventurer
```
