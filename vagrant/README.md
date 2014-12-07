# Introduction

The instructions below explain how to set up and provision a VirtualBox VM using Vagrant and Puppet in order to run the VirtualWhiteboard application.

# Requirements

There are a few things you will need to have installed in order to run this development environment...

- VirtualBox 4.3+
- Vagrant 1.6+
- vagrant-vbguest plugin (install with "vagrant plugin install vagrant-vbguest")
- Xcode 5+ (Mac only)

# Setup

Verify that Vagrant is installed and that your Vagrantfile has no syntax errors with the following command...

    vagrant status

Assuming all is well, you can create and provision a dev host with this command...

    vagrant up

This is likely to take a while, so it's a great time to get more coffee or play 2048 on your phone. When it's finished, open the Tomcat manager...

   http://192.168.5.97:8080/manager/html

The username is "yeah" and the password is "buddy". Upload the whiteboard-api.war file from the Maven project in the 'api' folder of this project. After it starts, ssh into the Vagrant VM...

    vagrant ssh

The code folder is mounted inside the vagrant user's home directory. Navigate to it and start up both the app and the load balancer...

    cd VirtualWhiteboard
    node app.js &
    node loadbalancer.js &

Then open the following URL in a Web browser...

    http://192.168.5.97:8001/

Have fun drawing and chatting!
