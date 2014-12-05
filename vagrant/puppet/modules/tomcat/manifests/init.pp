# == Class: tomcat
#
# Installs and configures Tomcat 7 and its admin interface.
#
class tomcat {
  package {
    'tomcat7':
      ensure  => present,
      require => Package['openjdk-7-jdk'];

    'tomcat7-admin':
      ensure  => present,
      require => Package['openjdk-7-jdk'];
  }

  service { 'tomcat7':
    ensure  => running,
    require => Package['tomcat7'];
  }

  file { '/etc/tomcat7/tomcat-users.xml':
    source  => 'puppet:///modules/tomcat/tomcat-users.xml',
    group   => 'tomcat7',
    mode    => '0640',
    require => Package['tomcat7'],
    notify  => Service['tomcat7'];
  }
}
