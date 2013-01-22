# mproxy.js

mproxy.js is an easy to use proxy for http data traffic. It listens to a port and then decides where to forward the request based on the virtual host name included in the request.


mproxy.js basically implements a simple CLI on top of the node module http-proxy. The goal is to make it easy to set up a proxy on a system and have it autostart and configurable. This application is intended to be used in a Ubuntu environment and some of the features depend on the Ubuntu service framework.


One use case for this proxy could be that you already have an Apache webserver up and running and want to keep that for some hosts. But at the same time you wants to have some host go to a specific node application. Since both Apache and your node application can not listen to port 80 at the same time a proxy is needed.
The solution could then be to move the Apache port to 8000 and running your node application on port 8080. The proxy can then be configured to forward requests on one hostname to Apache and others to the node application.

Some tips on what to change in Apache to make it use another port can be found later in this document.


## If node.js is old try this

    $ sudo apt-add-repository http://ppa.launchpad.net/chris-lea/node.js/ubuntu
    $ sudo aptitude update


## Install node.js and npm

    $ sudo apt-get install nodejs npm


## Install mproxy.js

    $ git clone https://github.com/mattiasrunge/mproxy.js.git
    $ cd mproxy.js
    $ sudo npm install . -g


## Customize the configuration file

    $ sudo mproxy --init
    $ sudo emacs /etc/mproxy.json

In the sample configuration created with --init describes two dummy paths with a virtual hostname and a forward path consisting of a hostname and a port.


## Set the proxy to autostart

    $ sudo mproxy --autostart on


## Start service

    $ sudo service mproxy start
 
 
# How to set Apache to port 8000

## Update the Apache ports config: /etc/apache2/ports.conf
    
    ports.conf:NameVirtualHost *:8000
    ports.conf:Listen 8000
    
## Update a virtual host site: /etc/apache2/sites-available/site1.example.com

    <VirtualHost *:8000>

