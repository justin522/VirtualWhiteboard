# == Class: mysql
#
# Installs MySQL server and loads whiteboard database.
#
class mysql {
  package { 'mysql-server': ensure => present }

  service { 'mysql':
    ensure  => running,
    require => Package['mysql-server'];
  }

  # set the MySQL root password to 'root' (for convenience)
  exec { 'set-mysql-password':
    command => 'mysqladmin -uroot password root',
    unless  => 'mysqladmin -uroot -proot status',
    path    => ['/bin', '/usr/bin'],
    require => Service['mysql'];
  }

  # run the whiteboard.sql script to create the whiteboard database
  exec { 'create-whiteboard-db':
    command => 'mysql -u root -proot < /home/vagrant/VirtualWhiteboard/api/whiteboard.sql',
    unless  => 'test -d "/var/lib/mysql/whiteboard"',
    path    => ['/bin', '/usr/bin'],
    require => Exec['set-mysql-password'];
  }
}
