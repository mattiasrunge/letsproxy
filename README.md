# mproxy.js

mproxy.js is an easy to use proxy for http data traffic. It listens to port 80 and 443 and then decides where to forward the request based on the virtual host name included in the request.

## Give node access to use port 80 and 443

```bash
# Not that the node path might be a symlink, you must find the real path
sudo setcap 'cap_net_bind_service=+ep' /usr/bin/nodejs
```

## Install letsencrypt cli
https://letsencrypt.org/getting-started/

```bash
git clone https://github.com/letsencrypt/letsencrypt
cd letsencrypt
./letsencrupt-auto
```

## Create certificates
```bash
letsencrypt-auto certonly --standalone -d example.com -d www.example.com
# Make sure /etc/letsencrypt is read and writable by the user running mproxy.js
```

## Create configuration
```/etc/mproxy.json```
```json
{
  "https": {
    "dir": "/etc/letsencrypt",
    "key": "live/example.com/privkey.pem",
    "cert": "live/example.com/cert.pem"
  },
  "paths" : {
    "example.com": "localhost:8080",
    "www.example.com": "localhost:8080"
  }
}
```

