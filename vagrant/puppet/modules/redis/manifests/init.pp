# == Class: redis
#
# Installs Redis.
#
class redis {
  package { 'redis-server': ensure => present }
  package { 'redis-tools':  ensure => present }
}
