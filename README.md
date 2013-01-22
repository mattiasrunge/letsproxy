# mproxy.js

When implementing an application in node.js which should be accessable to a browser via port 80 and you already have say an Apache installation you want to keep.
Then this is proxy might be useful to you, it will listen to port 80 and based on the virtual host name direct the request to another server on another port.
This other server might be another node.js application or an Apache server. The benefit of using this proxy is that it supports websockets. Some tips on how to switch Apache to another port than 80 are drescribed later in the guide.


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


## Set the proxy to autostart

    $ sudo mproxy --autostart on
 
 
# How to set Apache to another port than 80

## Update /etc/apache2/ports.conf
    
    ports.conf:NameVirtualHost *:8000
    ports.conf:Listen 8000
    
## Update a virtual host site

    sites-available/site1.example.com:<VirtualHost *:8000>

