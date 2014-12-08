CompSci 597
Fall 2014
Group Project: Virtual Whiteboard

Team
====
- Calvin Hamus (node.js server and load balancer)
- Justin Tolman (front-end Web app)
- Milson Munakami (Java API)
- Patrick Lee (Java API and dev setup)

Description
===========
We built a Web-based virtual whiteboard and everything needed to support distributed use of it. The front-end Web app was created using HTML5, Canvas, SVG, and various JavaScript libraries. A node.js server is deployed to multiple app servers and fronted by a node.js load balancer. Information about room membership is stored in Redis on a separate database server. The node servers communicate with the load balancer, the front-end app, and Redis via Web sockets. Information about users, rooms, chat messages, and whiteboard edits is stored in a MySQL database. A Java API running in Tomcat on each app server provides access to this data. The Tomcat servers running the API are load balanced by Nginx.

Here is a brief summary of the pieces involved...

- load balancer
  - node.js
  - Nginx
- app servers
  - node.js
  - Tomcat
- database server
  - MySQL
  - Redis

Challenges
==========
This was an ambitious project to begin with, but we also encountered the inevitable bumps along the road. The socket.io library for node.js was initially reluctant to submit to load balancing. Misconfigured connection pooling using C3P0 and Hibernate in the API resulted in serious instablility before the root cause was tracked down and fixed. And integrating the separately developed pieces into a unified application stack took some trial and error before we got it right.

Summary
=======
All of us learned a lot during the course of this project and have something to take away from it for our efforts.
