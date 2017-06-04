FROM httpd:2.4
COPY ./public-html/ /usr/local/apache2/htdocs/

FROM php:7.0-cli
COPY . /usr/src/myapp
WORKDIR /usr/src/myapp
CMD [ "php", "./your-script.php" ]


