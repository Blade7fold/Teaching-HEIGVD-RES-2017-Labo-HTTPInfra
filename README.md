# Teaching-HEIGVD-RES-2017-Labo-HTTPInfra
## Partie 1
### GitHub Repo
Il faut créer un repository pour pouvoir réaliser le laboratoire. Pour ceci, il y a la possibilité d’en créer un nouveau ou de juste fork celui fournit par le professeur et ensuite cloner le répertoire dans un dossier avec le laboratoire à faire. (On a fait une branche appelée appacheStatic pour continuer le laboratoire, erreur de frappe avec le double p).
### Récupération des images Docker
On crée un dossier qui nous permettra de stocker les dossiers nécessaires pour pouvoir faire notre laboratoire. Dans ce cas on a appelé ce dossier "apache-images", dedans, un dossier "apache-php-image" qui contiendra notre fichier Dockerfile. Pour avoir les documents nécessaire pour créer l’image Docker, on va les chercher sur internet, dans la page web de hub.docker.com et ici, on cherche d’abord ceux de httpd (apache) et ensuite ceux de PHP et on utilise une des images déjà existantes (php:7.0-apache est celui que l’on utilise) et enfin, on copie les ligne suivantes dans notre Dockerfile pour les utiliser :
* `FROM php:7.0-apache` (de où on prend les fichiers)
* `COPY content/ /var/www/html/` (où vont être stockées les fichiers dans _"/var/www/html/"_, _"content/"_ dans notre cas)

Pour tester que l’on a bien pris le bon endroit avec l’image Docker, on va run le server sur notre machine avec la commande `docker run -d -p 9090:80 php:7.0-apache` (avec _9090:80_, on dit de se mettre à l’écoute en mappant les information sur le port 9090 au lieu du port 80).
On teste en essayant de nous connecter sur le serveur avec la commande `telnet adresseIP port`, et dans notre cas ce serait l’adresse IP de notre docker qui est _192.168.99.100_, et le port que l’on a choisi pour mapper, donc _9090_. On essaie de lancer une requête http avec un `GET / HTTP/1.0` et si on reçoit une réponse, ça veut dire qu’il y a bien un serveur apache qui a été lancé.

Avec la commande `docker ps` on regarde si le serveur a bien été lancé, et on utilise la commande `docker inspect nom_container` (le nom apparait sous la partie NAMES dans le terminal après avoir fait la commande `docker ps`) et on regarde quelle est l’adresse IP de l’image tout en bas. (IP du docker php : _172.17.0.2_).
### Première page html
Vu que l’on ne sait pas exactement ce qu’il y a dans le container PHP (c’est comme une boîte noire) et que l’on veut explorer les fichiers de configuration, on peut utiliser la commande `docker exec -it <nom-container> /bin/bash` pour pouvoir accéder et modifier les fichiers de la page web (on remarque que le répértoire de base du terminal nous mène dans _/var/www/html_).

Dans l’exemple, on met dans un fichier "index.html" le texte "Coucou" avec la commande `echo "Coucou" > index.html`. Si on ne spécifie pas un nom de fichier dans un dossier avec cette commande, apache va chercher le fichier index.html et le retourner. On met donc du contenu texte dans notre fichier index.html et on essaie de se connecter, on verra ce contenu sur la connexion de notre navigateur en écrivant dans un nouvel onglet : _"192.168.99.100:port_utilisé"_.

Dans notre cas, ce serait le port _9090_. Il faut bien faire attention : si on se déconnecte ou que l’on kill le serveur alors qu'on est dans le container, les modifications seront perdues. On peut faire des tests en créant des dossiers/fichiers et pour accéder à ces modifications, on peut rajouter les chemins sur le navigateur.

Par exemple, si on crée le dossier modif et que l’on crée un fichier appelé modif.html, on pourra voir son contenu sur le navigateur en écrivant sur l’onglet `192.168.99.100:9090/modif/modif.html`, et on pourra afficher ce qu’on a introduit dans ce fichier. Le texte introduit, étant en html, il est possible d’introduire du texte personnalisé en utilisant des blaises de html avec ce que l’on veut comme personnalisation et l’afficher dans le navigateur.
### Configuration apache
__Apache.config__ est le fichier de configuration principal ; les fichiers __sites__ sont des fichiers propres à Ubuntu ; il y a aussi des sous-fichiers de configuration possibles pour des __virtual hosts__ dans le dossier _/etc/apache2/sites-avaliable_, et normalement il y en a déjà un (etc -> dossier de configuration). Si on a dans notre Dockerfile une ligne comme celle prise dans le site web mais cette fois avec `COPY configuration/ /etc/apache2/sites-avaliable/mywebsite/`, on mettra nos propres configurations dans notre site et au moment de build l’image, on mettra ces informations directement dans le dossier de base de _/etc/apache2/sites-avaliable_.
### Accès au site via un navigateur
Quand on accède à l'image via un navigateur, on tombe sur la page d'accueil qui est placée dans _"/var/www/html/"_. Si on veut changer de page, on navigue simplement dans le site. On peut changer le répertoire dans le dockerfile en changeant l'emplacement où l'on copie les données.

Quand on a fini de faire des modifications avec la ligne de commande, on créera le dossier _"content/"_ que l’on a précédemment écrit dans le dockerfile (ceci va dépendre du nom de dossier voulu), on va créer donc notre propre fichier index.html et on va mettre une peu de texte de test pour pouvoir tester ce fonctionnement. Avec la commande `docker build -t <nom_image_voulue> .`, on copiera le contenu de _"content/"_ dans le répertoire _"/var/www/html/"_, et avec le point à la fin de la commande, on dit que l’on veut utiliser le répertoire courant pour pouvoir y créer notre image docker.

Si on relance l’image avec `docker run -p 9090:80 <nom_image>`, on pourra voir le message écrit dans notre fichier index.html. Si par exemple on recharge la page, on aura des affichages sur la ligne de commande dans le LOG Apache, et on peut voir par exemple que l’on a reçu une requête GET, qui est la suivante :

`"192.168.99.1 - - [04/Jun/2017:14:56:31 +0000] "GET / HTTP/1.1" 200 431 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"`

Partie de requête | Explication
--- | ---
`192.168.99.1 - - [04/Jun/2017:14:56:31 +0000] "GET / HTTP/1.1" 200 431 "-" ` | Réponse avec 200, ce qui veut dire bonne requête, le slash après le GET est l’URL visée par la requête
` "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36" `| user agent (type de navigateur)

(Si on shut down la connexion, on ne sera pas capable de se connecter à nouveau sur le page).
On peut lancer à nouveau le container avec l’option "-d" juste avant l’option "-p" pour pouvoir lancer le serveur en arrière-plan. Si on se déconnecte du serveur et que l’on essaie de le relancer sur le même port, il apparaitra une erreur car déjà mappé sur le port 9090, donc on peut changer le port à mapper et avoir un deuxième serveur sur un autre port et donc changer le port avec toujours la même adresse IP précédente.
### Personnalisation 
Après ces manipulations, on peut aller chercher sur internet des templates de page web pour personnaliser notre page, par exemple [Start Bootsrtap](https://startbootstrap.com/template-cactegories/one-page/) (nous avons choisi [cet exemple](https://blackrockdigital.github.io/startbootstrap-agency/)).

Après avoir téléchargé les dossiers de cette page web, on reconstruit le container de l’image modifiée comme avant, avec la commande de build. Si on regarde via le navigateur les sites dans les containers lancés auparavant, on verra que rien ne change car il n’y a pas de lien dynamique avec les modifications que l’on a faites et que l’on vient de reconstruire sur notre image. Donc il faut arrêter un serveur (celui sur 9090 par exemple), on lance à nouveau le serveur avec la commande run et on vérifie le fonctionnement (on peut aussi voir que le container lancé sur un autre port que le 9090 n’est pas modifié et on prouve qu’il n’y pas de lien dynamique).

On peut observer nos fichiers en local sur le navigateur et on peut se mettre à modifier ce qu’on veut dans le fichier index.html (comme avant) voire les autres dans le dossier téléchargé, pour personnaliser le site web. Comme les fichiers sont bien structurés, on peut facilement visualiser les endroits où se trouvent chaque information ou donnée de la page web et ainsi les modifier plutôt facilement pour la personnaliser à notre goût. Il nous suffir de réitérer l'étape au dessus pour mettre à jour notre container.

## Partie 2
### Docker image avec Node.js
Pour cette partie, on va procéder de manière similaire à la précédente, mais plutôt que d'utiliser un serveur statique avec apache, on utilise un serveur dynamique en node.js. On fera ça sur une nouvelle branche appelée expressDynamic.

La première chose que l'on fait est préparer l'image docker avec Node.js. En cherchant sur docker-hub, on constate qu'à [cette addresse](https://hub.docker.com/_/node/), on a une image docker officielle pour node.js avec les différentes version. Comme conseillé, on a choisi la dernière version stable de Node.js. Actuellement, la version stable est la 6.11, on a donc choisi l'image correspondante.

```dockerfile
FROM node:6.11
COPY src /opt/app
CMD ["node", "/opt/app/index.js"]
```

Nous avons donc créé ce fichier docker, qui va importer node.js version 6.11, puis comme précédemment, on copie les fichiers depuis le dossier *src* pour faire les modifications sur le serveur en local avant de les copier. Enfin, on lance le serveur node avec le fichier `index.js`.

### Mise en place de l'environnement
Dans le dossier src qui contiendra notre serveur, on va utiliser `npm` pour mettre en place notre serveur. Cela donne la configuration suivante :
```json
{
  "name": "quotes",
  "version": "0.1.0",
  "description": "Demo sending quotes",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Miguel Pombo Dias",
  "license": "ISC",
  "dependencies": {
    "chance": "^1.0.9",
    "dateformat": "^2.0.0",
    "express": "^4.15.3",
    "prog-quote": "^2.0.0"
  }
}
```
Dans cette configuration, on déclare le fichier `index.js` comme fichier principal qui contiendra notre serveur. Les dépendances (que l'on va voir dans la prochaine étape) sont ajoutées à l'aide de la commande `npm install --save chance` pour sauvegarder les sources en local.

Enfin, si on veux créer une image de ce serveur, il nous suffit de faire la commande `docker build -t res/express_quotes .` (le **.** indique que le docker est à l'emplacement courant, on peut y mettre le chemin vers le dockerfile).

En faisant la commande `docker run res/express_quotes`, le serveur est lancé et est utilisable, on va voir comment.

### Serveur de quotes
Le serveur est un simple serveur http qui répond à une requête *GET* et envoie un Json avec des citations avec des informations les concernant.

```js
const Chance = require("chance");
const chance = new Chance();

const ProgQuote = require('prog-quote');
const quoteRandom = ProgQuote();

const dateFormat = require('dateformat');

const Express = require("express");
const app = Express();
```

Pour commencer, on importe les différentes librairies dont on a besoin (que l'on a ajouté via npm install).
* `Chance` permet d'obtenir des informations aléatoires en tout genre
* `prog-quote` nous donne des citations aléatoires de programmation
* `dateformat` permet de mettre en forme une date se manière simple
* `express` permet de faire un serveur http très simplement

```js
app.get('/', function (request, response) {
    response.send(generateQuoteList());
});
app.listen(3000, function () {
    console.log("Accepting HTTP request on port 3000");
});
```
`app.get('/', function(request, response){...});` indique que le serveur express va répondre à une requête sur `'/'` (donc sans chemin relatif supplémentaire). Le paramètre `request` contient les informations de la requête effectuée, mais nous n'en avons pas besoin ici. `response` permet de répondre avec la méthode `send()`.

`app.listen(3000, function () {...}` met le serveur à l'écoute sur le port *3000* et applique la fonction qui suit à chaque requête sur ce port.

```js
chance.mixin({
    'generateQuote': function () {
        var year = chance.year({
            min: 1990,
            max: 2016
        });
        var date = chance.date({
            american: false,
            year: year
        })
        return {
            quote: quoteRandom.next().value.quote,
            country: chance.country({
                full: true
            }),
            author: chance.first() + " " + chance.last(),
            source: chance.url({
                domain: "www.randomprogquotesfromtheinterner.com"
            }),
            date: dateFormat(date, "'quoted the 'ddS mmmm yyyy")
        };
    }
});

function generateQuoteList() {
    var numberOfQuotes = chance.integer({
        min: 1,
        max: 5
    });
    var quotes = [];
    for (var i = 0; i < numberOfQuotes; i++) {
        quotes.push(chance.generateQuote());
    }
    return quotes;
}
```

Ensuite, on crée un mixin avec chance, qui permet de créer la méthode `generateQuote` qui permet de générer un objet `quote` qui comprend une citation, un pays, un auteur, une source et une date tous aléatoires (l'année est fixée entre 1990 et 2016 et la source est un url avec pour addresse principale `www.randomprogquotesfromtheinternet.com`).

Enfin, la fonction `generateQuoteList()` génère un nombre aléatoire de ces citations dans un tableau pour l'envoyer.

### Utilisation
Une fois le serveur lancé dans un container docker, on peut l'utiliser simplement en envoyant une requête à la machine docker avec son addresse et le bon port, dans notre cas : `192.168.99.100:9090` (considérant qu'on ait mit en place une correspondance des ports entre la machine docker et le container avec la commande `docker run -p 9090:3000 res/express_quotes`). Le serveur répond effectivement avec un json composé de citations aléatoires, que ce soit via un navigateur ou via postman.
## Partie 3

### Reverse Proxy
Dans cette partie, on a mis en place un reverse proxy pour faire un point d'entrée unique à notre site internet. Cela est possible grâce à des modules apaches qui permettent de faire des proxy et des reverse proxy.
### Fichiers de configuration
Pour configurer le proxy, on gère en local les fichiers à modifier dans le container du reverse proxy, notamment dans le dossier conf. Dans le dossier de configuration de apache, on trouve un dossier `sites-avaliable` qui contient les sites logiques disponibles. On a modifié le fichier par défaut `000-default.conf` comme tel :
```
<VirtualHost *:80>
</VirtualHost>
```

Le but est que les requêtes de base tombent sur ce site virtuel qui ne fournit pas de contenu. On a également un second fichier `001-reverse-proxy.conf` avec le contenu suivant :
```
<VirtualHost *:80>
   ServerName demo.res.ch

   #ErrorLog ${APACHE_LOG_DIR}/error.log
   #CustomLog ${APACHE_LOG_DIR}/access.log combined

   ProxyPass "/api/quotes/" "http://172.17.0.3:3000/"
   ProxyPassReverse "/api/quotes/" "http://172.17.0.3:3000/"

   ProxyPass "/" "http://172.17.0.2:80/"
   ProxyPassReverse "/" "http://172.17.0.2:80/"
</VirtualHost>
```
Le but ici est de fournir du contenu uniquement via l'url `demo.res.ch`. Dans ce cas, le reverse proxy redirigera les requêtes selon les lignes `ProxyPass` et `ProxyPassReverse` pour la réponse. Si on passe par `/api/quotes/`, on redirige sur le serveur express qui fourni nos citations. Si on ne spécifie rien de particulier, il redirige vers le serveur statique apache.

À noter que les addresses sont ici en dur, donc il faut les changer si les addresses des containers sont différentes, en les obtenant avec un `docker inspect <nom du container>`.

### Image docker

Le container Docker du reverse proxy est construit avec le docker file suivant :
```dockerfile
FROM php:5.6-apache

RUN apt-get update && \
	apt-get install -y vim
    
COPY conf/ /etc/apache2

RUN a2enmod proxy proxy_http
RUN a2ensite 000* 001*
```

On copie donc les données avec le dossier conf en les ajoutant à la configuration de apache.

Les deux lignes de run lancent des scripts apache prédéfinis. `a2enmod` permet de lancer des modules apache, en l'occurence pour activer les modules proxy dont on a besoin. `a2ensite` permet d'activer des sites virtuels qui sont après copie seulement disponibles, mais pas actifs. Il va donc activer tous les sites commençant par `000` ou  `001`, et donc les deux hôtes virtuels définis plus haut.

### Utilisation

Étant donné que nous somme sur windows avec docker dans une machine virtuelle linux, pour faire la requête via le navigateur en utilisant l'addresse `demo.res.ch:8080` il nous faut changer le fichier hosts de windows dans `C:\Windows\System32\drivers\etc\hosts` et ajouter la ligne `192.168.99.100	demo.res.ch` pour faire le lien entre l'addresse et le nom de domaine. Les requêtes  ainsi faites dans le navigateur se feront avec le nom d'hôte correspondant tout en menant à la bonne addresse ip.

Il nous suffit donc d'accéder aux deux sites via cette addresse comme suit :

commande | ressource
---|---
`http://demo.res.ch:8080` | accès au site statique sur le serveur apache
`http://demo.res.ch:8080/api/quotes/` | accès au site dynamique sur le serveur express

## Partie 4

### AJAX (JQuery)
Dans cette partie, on va créer un script JavaScript en utilisant JQuery et faire une requête AJAX pour actualiser la page .html
### Outil vim
Pour ceci, d'abord, on va rajouter 2 lignes dans chaque Dockerfile de chaque image pour pouvoir faire des modifications sur les fichiers en local et pouvoir tester avant de faire des réelles modifications sur les fichiers que l'on va utiliser par la suite. Les lignes sont les suivante: 
``` dockerfile
RUN apt-get update && \
  apt-get install -y vim
```
La premère sert à actualiser les applications dans l'image et celle d'après pour installer l'outil vim, pour pouvoir modifier les fichiers en local d'abord. On utilisait ceci à l'étape précedente, mais que en local, donc il faut le faire maintenant à chaque fois que l'on construit les imgaes docker.
### Fichier JavaScript
Après avoir reconstruit et lancé les images, on va utiliser la commande ``` docker exec -it <nom image statique> /bin/bash ``` pour acceder au fichier .html de notre page web et créer un fichier .js pour faire les requêtes Ajax.

Pour ceci, on va d'abord créer une copie de notre page .html pour pouvoir garder l'original et on va rajouter à la fin du fichier, où se trouvent les scripts d'affichage de la page web, les lignes suivantes:
``` html
<!-- Custom script to load quotes -->
<script src="js/<nom du fichier JavaScript>.js"></script>
```
Ces lignes seront utilisées pour créer le script de JQuery, mais si on regarde maintenant dans notre page web en faisant click-droit de la souris et un allant sur l'option "Inspecter", on peut voir dans la console qu'il y a une erreur car il ne trouve pas le fichier .js que l'on vient de rajouter (dans notre cas, quotes.js, mais le nom peut être différent si voulu).

Dans l'onglet Sources, on peut voir les sources de notre fichier .html, et dans l'onglet Network, on verra plus en détail l'erreur par rapport à ce fichier, car quand il fait une requête GET, il ne le trouve pas, donc on va le créer (toujours en local).

Pour créer le fichier, on execute la commande ``` touch <nom du fichier JavaScript>.js ``` et après ``` vi <nom du fichier JavaScript>.js ``` pour pouvoir le modifier.

Dans le fichier .js, on va écrire les lignes nécessaire pour pouvoir changer la page .html selon ce qu'on veut. Nous avons écrit ceci dans notre fichier .js:
``` js
$(function() {
    console.log("Loading quotes");

    function loadQuotes() {
        $.getJSON("api/quotes/", function(quotes) {
            console.log(quotes);
            var content = "<h1>No quotes for you (no quote found)</h1>";
            if(quotes.length > 0) {

                content = "";

                for (var i = quotes.length - 1; i >= 0; i--) {
                    content +=
                    "<div class=\"col-lg-12\">" +
                    "<h4>" + quotes[i].quote + "</h4>" +
                    "<h5>" + quotes[i].country + ", " + quotes[i].date + "</h5>" +
                    "<p class=\"text-muted\">" + quotes[i].author + "</p>" +
                    "<a href=\"" + quotes[i].source + "\">source</a>" +
                    "<hr>" +
                    "</div>";
                }

                
            }

            $("div.quotes-place").html(content);
        });
    };

    loadQuotes();
    setInterval(loadQuotes, 3000);
});
```
Le fichier servira à modifier les quotes qui sont générées aléatoirement sur la page web dans le nouvel en-tête Quotes, qui les modifiera chaque 3 secondes.

Les lignes à remarquer seraient:

Ligne JS | Explication
--- | ---
` $.getJSON("api/quotes/", function(quotes) ` | Requête JQuery pour récuperer les quotes dans l'adresse ` api/quotes/ `, lequels vont s'afficher sur la page web
`for (var i = quotes.length - 1; i >= 0; i--) {...}`| Boucle pour construire toutes les quotes en html telles qu'affichées
` $("div.quotes-place").html(content); ` | JQuery pour sélectionner la classe dans laquelle on va afficher les quotes
` setInterval(loadQuotes, 3000); ` | On donne un intervalle pour actualiser les quotes chaque 3000 ms 

Après avoir fait ces modifications en local, on vérifie directement sur la page web que l'on a bien fait les modifications et que les quotes s'affichent bien. Si c'est le cas, on prend les modifications des différents fichiers et on crée ces mêmes fichers dans nos propre dossiers. Donc le fichier .js ira dans le dossier ` content/js/ ` et il faudra modifier le fichier .html pour pouvoir utiliser le script .js.
## Partie 5

### Configuration dynamique
Dans cette partie nous allons configurer les adresses IP dynamiquement dans un autre fichier que le fichier config du début du laboratoire.

### Variables d'environement
Nous allons donc passer des variables d'environement à notre reverse proxy qui contiendront les adresses IP des containers que l'on va lancer. Tout d'abord, nous allons chercher dans le git officiel de php sur cette page [PHP Official GIT](https://github.com/docker-library/php/blob/master/) et on va chercher dans PHP 5.6 le fichier apache2-foreground, dans lequel on va rajouter les lignes suivantes:
```
#Add setup for RES lab
echo "Setup for the RES lab..."
echo "Static App URL: $STATIC_APP"
echo "Dynamic App URL: $DYNAMIC_APP"
```
Ceci va nous permettre de passer les variables d'environement que l'on veut, dans notre cas, les adresses IP des containers statique et dynamique. Dans le Dockerfile du reverse proxy nous allons rajouter la ligne ` COPY apache2-foreground /usr/local/bin/ ` pour pouvoir utiliser le fichier "apache2-foreground", on construit l'image, on la démarre avec la commande ` docker run -e STATIC_APP=172.17.0.5:80 -e DYNAMIC_APP=172.17.0.8:3000 res/apache_rp ` et on verra que le terminal affichera les ligne que l'on a ajouter dans le fichier apache2 et que les adresses sont les mêmes que sur la commande.

### Template PHP
Cette partie consiste à créer un fichier template de PHP pour lier les adresses passées dans les variables d'envirenement avec celle du reverse proxy pour ateindre les bons containers.

Dans le fichier .php, on va donc rajouter le nécessaire pour faire ce lien, qui serait : 
``` php
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
```
On peut voir que l'on rajoute le lignes de VirtualHost que l'on avait dans le fichier 001-reverse-proxy.config, mais cette fois on modifie ceci pour qu'il y ait des variables à la place d'avoir les adresses écrites en dur dans la configuration. Dans notre fichier config-template.php on a directement rajouter le bon port dans lequel communiquent les containers pour pas devoir l'écrire à chaque fois. Donc le but est d'avoir des variables à la place des adresses en dur et de changer les doubles guimets par des simples.

Après avoir fini ces modifications, on mettra d'abord ce fichier template dans un dossier templates et après dans le Dockerfile on rajoute la ligne ` COPY templates /var/apache2/templates ` pour rajouter le fichier config-template dans l'image à l'endroit spécifier avec ` /var/apache2/templates `.

Dans le fichier "apache2-foreground" on rajoute la ligne ` php /var/apache2/templates/config-template.php > /etc/apache2/sites-available/001-reverse-proxy.conf ` pour pouvoir écrire notre configuration dans config-template.php et la mettre dans le dossier de configuration en écrasant le fichier 001-reverse-proxy.conf pour utiliser le .php à la place.

### Plusieurs containers en même temps
Pour cette partie, on va donc vérifier les étapes précédentes en lançant plusieurs containers et en passant en paramètre les adresses IP des bons containers pour notre page web.

On lance donc plusiers fois l'image de res/apache_static et l'image res/express_dynamic, on donne à une de ces images un nom (avec ` --name <nom de l'image> ` et on va faire un ` docker inspect <nom de l'image> | grep -i ipaddr ` pour qu'il nous dise l'adresse IP de ce container et donc la passer comme argument au moment de lancer le reverse proxy.

On lance le reverse proxy avec ` docker run -d -e STATIC_APP=<adresse ip> -e DYNAMIC_APP=<adresse ip> --name <nom de l'image> -p 8080:80 res/apache_rp `, on affiche notre page web et on vérifie que tout s'est bien passé.
