# == Class: baseconfig
#
# Performs basic configuration tasks.
#
class baseconfig($user = 'vagrant') {
  # install some common packages
  package { 'build-essential': ensure => present }
  package { 'curl':            ensure => present }
  package { 'htop':            ensure => present }
  package { 'tree':            ensure => present }

  # use a custom .bashrc file
  file { "/home/${user}/.bashrc":
    ensure  => present,
    source  => 'puppet:///modules/baseconfig/bashrc',
    owner   => $user,
    group   => $user;
  }

  # set the local time to Boise
  package { 'tzdata': ensure => present }

  file { '/etc/localtime':
    ensure  => symlink,
    target  => '/usr/share/zoneinfo/America/Boise',
    require => Package['tzdata']
  }
}
