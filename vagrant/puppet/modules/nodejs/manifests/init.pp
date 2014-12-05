# == Class: nodejs
#
# Installs Node.js.
#
class nodejs {
  package { 'nodejs':
    ensure  => present,
    require => Exec['nodejs_setup']
  }

  exec { 'nodejs_setup':
    command => 'curl -sL https://deb.nodesource.com/setup | sudo bash -',
    unless  => 'dpkg -l | grep nodejs',
    path    => ['/bin', '/usr/bin'],
    require => Package['curl']
  }
}
