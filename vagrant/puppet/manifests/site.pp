# define a 'pre' stage so we can apply the baseconfig module first
stage { 'pre': before => Stage['main'] }

class { 'baseconfig': stage => 'pre' }

# set defaults for all file resources
File {
  ensure => file,
  owner  => 'root',
  group  => 'root',
  mode   => '0644'
}

# include other modules
include java
include mysql
include nginx
include nodejs
include redis
include tomcat
