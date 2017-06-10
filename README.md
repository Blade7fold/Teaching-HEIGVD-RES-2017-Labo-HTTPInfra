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

partie de requête | explication
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
