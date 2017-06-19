<?php
	$dynamic_app = getenv('DYNAMIC_APP');
	$static_app = getenv('STATIC_APP');
?>
<VirtualHost *:80>
   ServerName demo.res.ch

   #ErrorLog ${APACHE_LOG_DIR}/error.log
   #CustomLog ${APACHE_LOG_DIR}/access.log combined

   ProxyPass '/api/quotes/' 'http://<?php print "$dynamic_app"?>:3000/'
   ProxyPassReverse '/api/quotes/' 'http://<?php print "$dynamic_app"?>:3000/'

   ProxyPass '/' 'http://<?php print "$static_app"?>:80/'
   ProxyPassReverse '/' '<?php print "$static_app"?>:80/'
</VirtualHost>