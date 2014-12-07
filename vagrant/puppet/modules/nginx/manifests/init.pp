# == Class: nginx
#
# Installs Nginx and configures default vhost.
#
class nginx {
  package { 'nginx': ensure => present }

  service { 'nginx':
    ensure  => running,
    require => Package['nginx'];
  }

  file { '/etc/nginx/sites-available/default':
    ensure  => present,
    source  => 'puppet:///modules/nginx/default',
    require => Package['nginx'],
    notify  => Service['nginx'];
  }
}
