# node-proxy

This is a small node application which sets up a node proxy to allow different hostnames to go to different servers. The install script here is built to work in a Ubnuntu environment but might work with other systems as well.


## Install node.js and npm

    $ sudo apt-get install nodejs npm

## Fork the repo

    $ git clone https://github.com/mattiasrunge/node-proxy.git


## Run the installation

    $ cd ./node-proxy
    $ sudo ./install.sh


## Customize the configuration file

    $ sudo emacs /etc/node-proxy.json


## Start the service

    $ sudo service node-proxy start
