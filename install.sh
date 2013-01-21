#!/bin/bash

mkdir /opt/node-proxy

cp ./node-proxy.conf /etc/init/

cp -i ./node-proxy.json /etc/

cp ./index.js /opt/node-proxy/

cp ./package.json /opt/node-proxy/

cd /opt/node-proxy

npm install

