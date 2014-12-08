Java API for Virtual Whiteboard

=====
SETUP
=====
In order to run the Whiteboard API server, you will need to create the MySQL database. The whiteboard.sql script contains all the statements needed to create the database, user, and tables. You may execute it like this from the command line...

  mysql -h YOUR_HOST -u YOUR_USERNAME -p YOUR_PASSWORD < whiteboard.sql

The API server expects its database to be running on localhost. This is easily changed by editing the following property in persistence.xml accordingly...

  <property name="javax.persistence.jdbc.url" value="jdbc:mysql://localhost/whiteboard" />

===================
RUNNING WITH TOMCAT
===================
You can build the WAR file for the API server with the following command (from the directory containing the pom.xml file)...

  mvn clean package

That will create the following WAR file for the API server...

  ./target/whiteboard-api-1.0.war

This file can then be copied to Tomcat's webapps directory and renamed to omit the version number...

  sudo cp ./target/whiteboard-api-1.0.war /var/lib/tomcat7/webapps/whiteboard-api.war

Tomcat should explode the WAR file and start up the application successfully. The Whiteboard API server will be available at the following URL...

  http://localhost:8080/whiteboard-api/

==================
RUNNING WITH JETTY
==================
For development purposes you can use Jetty with the following command...

  mvn clean jetty:run

The Whiteboard API server will be available at the following URL...

  http://localhost:8081/

======================
GENERATE REST API DOCS
======================
REST API docs can be generated using the Enunciate plugin with the following command...

  mvn enunciate:docs

Then you can open the main page of the generated docs in a Web browser...

  firefox target/enunciate/build/docs/index.html

