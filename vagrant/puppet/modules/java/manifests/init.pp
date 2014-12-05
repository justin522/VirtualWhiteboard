# == Class: java
#
# Installs OpenJDK 7.
#
class java {
  package { 'openjdk-7-jdk': ensure => present }
}
