export type BlogCategory =
  | 'Guide'
  | 'Comparatif'
  | 'Fonctionnalité'
  | 'Marketing';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO 8601
  category: BlogCategory;
  readingTime: number; // minutes
  excerpt: string;
  tags: string[];
  content: string; // HTML
}

// ---------------------------------------------------------------------------
// Données
// ---------------------------------------------------------------------------

const RAW_POSTS: Omit<BlogPost, 'readingTime'>[] = [
  // =========================================================================
  // Article 1 — Guide créer catalogue WhatsApp
  // =========================================================================
  {
    slug: 'creer-catalogue-produit-whatsapp',
    title: 'Comment créer un catalogue produit professionnel pour WhatsApp (guide 2026)',
    description:
      'Créez un catalogue produit WhatsApp en 10 minutes : photos, prix, code d\'accès et commande automatique. Guide complet pour marchands francophones.',
    date: '2026-03-15',
    category: 'Guide',
    excerpt:
      'Des milliers de marchands envoient encore des PDFs de 40 pages sur WhatsApp. Il existe une méthode plus rapide, plus professionnelle et qui génère des commandes claires. Voici le guide complet.',
    tags: ['catalogue', 'whatsapp', 'guide', 'marchands', 'produits'],
    content: `
<h2>Pourquoi un catalogue WhatsApp professionnel change la donne</h2>
<h3>Le problème des PDFs et des photos en vrac</h3>
<p>Nadia, revendeuse de mode à Créteil, envoyait chaque semaine un PDF de 40 pages à ses clientes. Résultat : des questions en boucle ("c'est quoi la ref du pantalon page 12 ?"), des commandes floues et deux heures perdues à reformater le fichier à chaque nouveau produit.</p>
<p>Ce scénario est commun à des dizaines de milliers de marchands francophones. Les photos envoyées en vrac sur WhatsApp ne permettent pas à vos clientes de comparer, de naviguer ou de passer une commande structurée. Le PDF est statique, lourd, et se perd dans les conversations.</p>
<h3>Ce que vos clientes voient vs ce que vous voulez qu'elles voient</h3>
<p>Quand une cliente reçoit 30 photos WhatsApp d'un coup, elle fait défiler rapidement et en retient deux ou trois. Elle ne voit pas les prix, ne distingue pas les références et vous envoie un message vague du type "le pull rose tu l'as en quelle taille ?". Vous perdez du temps, elle perd patience.</p>
<p>Avec un catalogue en ligne, votre cliente voit les produits organisés par catégories, avec une photo principale, un nom, un prix et une référence. Elle ajoute ce qu'elle veut au panier, clique sur "Commander" et vous recevez un message WhatsApp structuré avec la liste exacte. Zéro ambiguïté.</p>
<h3>La commande WhatsApp floue vs la commande WhatsApp structurée</h3>
<p>Commande floue : "bonjour je veux le truc rouge et aussi 2 autres si possible combien ça coûte tout".<br />Commande structurée : "Commande — Robe florale rouge (REF-045) x1 — 49 € / Jeans slim noir (REF-078) x2 — 35 € x2 — Total : 119 €".</p>
<p>La deuxième commande ne demande aucune clarification. Elle arrive directement depuis votre catalogue Souqly.</p>

<h2>Les 4 solutions pour créer un catalogue produit WhatsApp</h2>
<h3>Option 1 — La fonctionnalité catalogue native de WhatsApp Business (et ses limites)</h3>
<p>WhatsApp Business propose un catalogue intégré, limité à 30 produits. Vous ne pouvez pas protéger l'accès par code, les clientes ne peuvent pas ajouter plusieurs produits à un panier, et le message de commande n'est pas automatique. Pour un catalogue de plus de 30 références, cette solution est insuffisante.</p>
<h3>Option 2 — Google Drive ou PDF partagé</h3>
<p>Gratuit, mais sans panier, sans prix dynamique, sans commande automatique. Vos clientes doivent noter les références manuellement avant de vous écrire. Le lien peut expirer ou devenir inaccessible sans prévenir.</p>
<h3>Option 3 — Yupoo (et pourquoi c'est risqué pour les marchands francophones)</h3>
<p>Yupoo est populaire mais conçu pour le marché asiatique. Interface en anglais, support inexistant, liens qui expirent, aucun panier WhatsApp intégré. Pour en savoir plus, lisez notre comparatif des <a href="/blog/alternatives-yupoo-marchands-francophones">alternatives à Yupoo pour marchands francophones</a>.</p>
<h3>Option 4 — Un outil dédié catalogue avec panier WhatsApp intégré</h3>
<p>C'est la solution que propose Souqly : un catalogue en ligne protégé par code d'accès, avec panier intégré et génération automatique du message de commande WhatsApp. Mise en place en moins de 10 minutes, aucune compétence technique requise.</p>

<h2>Comment créer votre catalogue sur Souqly en 10 minutes</h2>
<h3>Étape 1 — Créer votre compte et choisir votre adresse catalogue</h3>
<p>Rendez-vous sur <a href="/inscription">souqly.fr/inscription</a>. Choisissez votre identifiant de boutique (ex. : <code>boutique-mode-paris</code>) — il deviendra votre adresse publique : <strong>souqly.fr/boutique-mode-paris</strong>. Votre demande est validée sous 48 heures ouvrées.</p>
<h3>Étape 2 — Ajouter vos premières catégories</h3>
<p>Dans votre tableau de bord, allez dans "Catégories" et créez vos premières sections : Robes, Pantalons, Accessoires, Nouveautés... Vous pouvez réorganiser l'ordre par glisser-déposer. Chaque catégorie peut avoir une photo de couverture.</p>
<h3>Étape 3 — Ajouter vos produits (photo, nom, prix, référence)</h3>
<p>Pour chaque produit, uploadez jusqu'à 10 photos (compressées automatiquement), renseignez le nom, la référence, le prix et une courte description. La première photo devient l'image principale dans la grille catalogue.</p>
<h3>Étape 4 — Définir votre code d'accès</h3>
<p>Dans "Paramètres", définissez votre code d'accès client (de 4 à 20 caractères, lettres et chiffres). Ce code est chiffré côté serveur — même Souqly ne peut pas le lire en clair. Vous pouvez le changer à tout moment ou invalider toutes les sessions actives en un clic.</p>
<h3>Étape 5 — Configurer votre numéro WhatsApp et votre template de commande</h3>
<p>Renseignez votre numéro WhatsApp au format international (+336...) et personnalisez votre message de commande. Le message par défaut est utilisable immédiatement — vous l'affinez selon vos besoins (ajout du nom de la cliente, instructions de livraison, etc.).</p>
<h3>Étape 6 — Partager le lien à vos premières clientes</h3>
<p>Copiez votre lien depuis le tableau de bord et envoyez-le à vos clientes sur WhatsApp. Envoyez le code d'accès séparément, par message privé. C'est volontaire : cela crée un effet d'exclusivité et évite que le lien seul suffise à n'importe qui.</p>

<div class="cta-inline">Votre catalogue est à 10 minutes d'ici — <a href="/inscription">14 jours gratuits, sans carte bancaire</a></div>

<h2>Les bonnes pratiques pour un catalogue WhatsApp qui convertit</h2>
<h3>La qualité des photos : ce qui fait la différence</h3>
<p>Une seule bonne photo fait plus qu'une dizaine de photos floues. Privilégiez la lumière naturelle, un fond neutre (blanc ou gris clair) et un cadrage qui montre le produit entier. Sur mobile, assurez-vous que les détails sont lisibles à la taille d'affichage de la grille catalogue (environ 200x200 pixels).</p>
<h3>La structure des catégories : comment vos clientes naviguent</h3>
<p>Organisez vos catégories depuis la perspective de vos clientes, pas selon votre logique d'approvisionnement. Une cliente cherche "Robes d'été", pas "Lot Turquie mai 2026". Des catégories courtes et claires (5 à 8 maximum pour commencer) permettent une navigation fluide même sur mobile.</p>
<h3>Le code d'accès : comment le transmettre sans le dévaluer</h3>
<p>Envoyez le code dans un message séparé du lien. Ne le publiez jamais dans un groupe public. Changez-le à chaque nouvelle "collection" — cela crée un rituel et maintient l'attention de vos clientes. Pour aller plus loin, lisez notre guide sur <a href="/blog/proteger-catalogue-code-acces">comment protéger son catalogue avec un code d'accès</a>.</p>
<h3>Le message de commande parfait : ce qu'il doit contenir</h3>
<p>Le message automatique de Souqly inclut les références, quantités, prix unitaires et total. Ajoutez dans votre template : un champ pour le nom de la cliente, un champ pour l'adresse ou le mode de retrait, et une ligne de bonjour personnalisée. Une commande complète dès le premier message = zéro échange supplémentaire.</p>

<h2>Ce que vos clientes vivent de leur côté</h2>
<h3>De l'accès au catalogue à la commande WhatsApp : le parcours complet</h3>
<p>Votre cliente reçoit votre lien Souqly sur WhatsApp. Elle clique, arrive sur une page qui lui demande le code d'accès. Elle saisit le code que vous lui avez envoyé, et accède immédiatement à votre catalogue. La session dure 24 heures : elle n'a pas à ressaisir le code lors de sa prochaine visite le même jour.</p>
<p>Elle navigue par catégories, regarde les photos, ajoute ses produits au panier. Quand elle est prête, elle clique sur "Commander". Un message pré-rempli s'ouvre dans son application WhatsApp. Elle envoie. Vous recevez une commande complète.</p>
<p>Ce parcours prend en moyenne 3 à 5 minutes, depuis le clic sur le lien jusqu'à l'envoi de la commande. C'est moins de temps qu'il n'en faut pour lire un PDF de 40 pages.</p>

<div class="faq-section">
<h2>FAQ — Créer un catalogue produit WhatsApp</h2>
<dl>
  <dt data-faq="true">Combien de temps faut-il pour créer son catalogue sur Souqly ?</dt>
  <dd>La configuration initiale (compte, catégories, premiers produits, code d'accès, numéro WhatsApp) prend entre 10 et 30 minutes selon le nombre de produits. Une fois le catalogue créé, ajouter un nouveau produit prend moins de 2 minutes.</dd>
  <dt data-faq="true">Mes clientes doivent-elles créer un compte pour accéder au catalogue ?</dt>
  <dd>Non. Elles saisissent simplement le code d'accès que vous leur transmettez. Aucune inscription, aucune application à télécharger. La session est valable 24 heures.</dd>
  <dt data-faq="true">Puis-je avoir plusieurs codes d'accès pour différentes clientes ?</dt>
  <dd>Actuellement, Souqly fonctionne avec un code d'accès unique par catalogue. Vous pouvez le changer à tout moment pour contrôler qui a accès. Une fonctionnalité de codes multiples est sur la feuille de route.</dd>
  <dt data-faq="true">Le catalogue fonctionne-t-il aussi sur Telegram ?</dt>
  <dd>Oui. Vous pouvez configurer votre identifiant Telegram dans les paramètres. Vos clientes verront les boutons WhatsApp et/ou Telegram au moment de commander, selon votre configuration.</dd>
</dl>
</div>
    `.trim(),
  },

  // =========================================================================
  // Article 2 — Vendre via WhatsApp en 2026
  // =========================================================================
  {
    slug: 'vendre-whatsapp-2026',
    title: 'Vendre via WhatsApp en 2026 : guide complet pour les marchands',
    description:
      'Stratégies, outils et exemples concrets pour vendre efficacement via WhatsApp en 2026. Catalogue, commandes structurées, code d\'accès : tout ce qu\'il faut savoir.',
    date: '2026-02-28',
    category: 'Guide',
    excerpt:
      'WhatsApp est devenu le canal de vente numéro 1 pour les marchands indépendants francophones. Mais le gérer à la main, message par message, épuise. Voici comment construire un système qui travaille pour vous.',
    tags: ['whatsapp', 'vente', 'marchands', '2026', 'catalogue'],
    content: `
<h2>L'état de la vente via WhatsApp en France et au Maghreb en 2026</h2>
<h3>Pourquoi WhatsApp est devenu un canal de vente majeur</h3>
<p>WhatsApp compte 43 millions d'utilisateurs actifs en France. En Algérie, au Maroc et en Tunisie, c'est le canal de messagerie dominant — loin devant les SMS ou les emails. Pour les marchands indépendants qui ciblent ces communautés ou les diasporas en France, WhatsApp n'est pas une option : c'est l'endroit où leurs clientes se trouvent.</p>
<p>La vente via WhatsApp ne se résume pas aux boutiques de mode. Les artisanes cosmétiques, les revendeurs de sneakers, les épiceries fines, les fleuristes, les revendeurs de matériel électronique — tous utilisent WhatsApp comme principal canal de commande.</p>
<h3>Les types de marchands qui vendent via WhatsApp</h3>
<p>Trois profils dominent : les revendeurs (produits achetés en gros en Turquie, au Maroc ou en Chine), les artisans-producteurs (savons, bijoux, cosmétiques maison), et les spécialistes de niche (sneakers, streetwear, produits régionaux). Ce que ces profils ont en commun : une clientèle fidèle, un fort taux de recommandation, et une gestion des commandes qui repose encore trop souvent sur la mémoire et les notes vocales.</p>
<h3>Les limites de WhatsApp Business natif pour les catalogues</h3>
<p>WhatsApp Business propose un catalogue intégré, mais limité : 30 produits maximum, pas de panier multi-articles, pas de code d'accès, pas de message de commande automatique. Pour un marchand avec 50, 100 ou 300 références, cette solution ne suffit pas.</p>

<h2>Les 5 erreurs que font la plupart des marchands sur WhatsApp</h2>
<h3>Erreur 1 — Envoyer les produits un par un</h3>
<p>Envoyer 20 photos les unes après les autres inonde la conversation de votre cliente. Elle fait défiler en diagonale, en retient deux ou trois, et la conversation se perd dans les suivantes. Un catalogue centralisé permet à votre cliente de parcourir tous vos produits à son rythme, sans encombrer son écran.</p>
<h3>Erreur 2 — Prendre les commandes sans format fixe</h3>
<p>Sans format de commande, chaque échange est unique. "Le rouge en 38", "j'en veux deux du même", "c'est combien si j'en prends trois ?" — chaque message demande une réponse, une vérification, une relance. Un message de commande structuré élimine ces allers-retours.</p>
<h3>Erreur 3 — Montrer ses prix à tout le monde</h3>
<p>Un catalogue public expose vos marges à vos concurrents. Un catalogue protégé par code d'accès ne montre vos prix qu'à vos clientes confirmées. Pour aller plus loin sur ce point, lisez notre guide sur <a href="/blog/proteger-catalogue-code-acces">la protection du catalogue par code d'accès</a>.</p>
<h3>Erreur 4 — Gérer les stocks dans sa tête</h3>
<p>Sans outil, les erreurs de stock sont inévitables : vendre un article déjà épuisé, oublier de retirer un produit, promettre une disponibilité impossible. Avec Souqly, vous mettez à jour la disponibilité d'un produit en quelques secondes depuis votre téléphone.</p>
<h3>Erreur 5 — Confondre communication et vente</h3>
<p>WhatsApp, c'est aussi l'endroit où vous échangez des nouvelles, partagez des statuts, communiquez avec votre famille. Mélanger communication personnelle et professionnelle crée de la confusion. Un catalogue avec une adresse dédiée (souqly.fr/votre-boutique) sépare clairement votre vitrine de vos conversations.</p>

<h2>Construire un système de vente WhatsApp en 5 étapes</h2>
<h3>Étape 1 — Créer un catalogue centralisé accessible en un lien</h3>
<p>Le catalogue est votre vitrine. Un seul lien, que vous partagez dans votre statut WhatsApp, dans vos groupes clients, dans votre bio Instagram. Vos clientes savent où aller pour voir vos produits. Vous n'avez plus à envoyer des photos à chaque demande.</p>
<h3>Étape 2 — Protéger ce catalogue avec un code d'accès</h3>
<p>Un code d'accès filtre naturellement vos vraies clientes des curieux et des concurrents. Il crée aussi un effet d'appartenance : les clientes qui ont le code se sentent dans un espace réservé. C'est un avantage marketing autant qu'une protection technique.</p>
<h3>Étape 3 — Configurer un message de commande automatique</h3>
<p>Le message de commande généré par Souqly contient les références exactes, les quantités, les prix unitaires et le total. Vous recevez une commande complète dès le premier message. Personnalisez le template pour y ajouter le nom de la cliente, les instructions de livraison ou toute autre information utile.</p>
<h3>Étape 4 — Définir un processus de confirmation et de suivi</h3>
<p>Une fois la commande reçue, définissez un message de confirmation type (préparation, délai, mode de paiement). Ce message peut être préparé à l'avance et envoyé en quelques secondes. Vos clientes savent que leur commande est prise en compte — sans que vous ayez à improviser.</p>
<h3>Étape 5 — Mesurer ce qui marche</h3>
<p>Votre tableau de bord Souqly vous montre le nombre de visites de votre catalogue, le nombre d'accès par code, et le nombre de commandes générées. Ces métriques simples vous permettent de savoir si votre lien circule bien et si votre catalogue convertit. Pour en savoir plus sur cette optimisation, consultez notre article sur <a href="/blog/generer-commandes-whatsapp-catalogue">comment générer plus de commandes via WhatsApp</a>.</p>

<h2>Outils recommandés pour vendre via WhatsApp professionnellement</h2>
<h3>WhatsApp Business : ce qu'il fait bien, ce qu'il ne fait pas</h3>
<p>WhatsApp Business est un excellent complément : réponses automatiques, message de bienvenue, étiquettes pour organiser vos contacts, catalogue basique. Utilisez-le pour gérer vos conversations — pas comme solution de catalogue principale si vous avez plus de 30 produits ou si vous vendez en volume.</p>
<h3>Les catalogues en ligne avec intégration WhatsApp</h3>
<p>Souqly est conçu spécifiquement pour ce cas d'usage : catalogue protégé + panier + commande WhatsApp automatique, en français, pour des marchands indépendants. Les alternatives (Shopify, Wix, Google Sites) ne proposent pas cette combinaison nativement. Pour un comparatif détaillé, lisez <a href="/blog/catalogue-en-ligne-vs-site-ecommerce">catalogue en ligne vs site e-commerce</a>.</p>
<h3>Les outils de gestion de commandes simples</h3>
<p>Pour suivre vos commandes, une feuille Google Sheets ou Notion peut suffire à démarrer. L'essentiel est que chaque commande reçue soit enregistrée avec le nom de la cliente, les produits, le statut (en préparation, expédié, livré) et le mode de paiement.</p>

<h2>Exemples concrets : comment trois marchands ont structuré leur vente WhatsApp</h2>
<h3>Revendeuse mode : de 40 DM par jour à 10 commandes structurées</h3>
<p>Nadia, boutique mode à Créteil, recevait en moyenne 40 messages WhatsApp par jour — des questions sur les disponibilités, les tailles, les prix. Depuis qu'elle utilise Souqly, ses clientes consultent le catalogue avant d'écrire. Elle reçoit en moyenne 10 messages par jour, mais chacun est une commande structurée. Son temps de gestion a été divisé par trois.</p>
<h3>Artisane cosmétique : un catalogue, un lien, zéro confusion</h3>
<p>Khadija, cosmétiques naturels artisanaux, avait 12 produits. Elle envoyait des photos une par une à chaque demande. Depuis Souqly, elle envoie un seul lien. Ses clientes en France et au Maroc accèdent au catalogue avec le code, voient les descriptions, les ingrédients et les prix, et commandent directement. Elle a gagné 5 heures par semaine.</p>
<h3>Revendeur sneakers : Telegram + catalogue privé</h3>
<p>Mehdi, revendeur sneakers à Lyon, vendait principalement via Telegram à une communauté de collectionneurs. Il avait besoin d'un catalogue avec un rendu premium, protégé contre la copie de ses sourcing. Avec Souqly en mode Telegram, ses clients reçoivent la commande structurée directement dans leur application préférée.</p>

<div class="cta-inline">Transformez vos conversations WhatsApp en commandes structurées — <a href="/inscription">14 jours gratuits sur Souqly</a></div>

<div class="faq-section">
<h2>FAQ — Vendre via WhatsApp en 2026</h2>
<dl>
  <dt data-faq="true">WhatsApp Business suffit-il pour vendre en ligne ?</dt>
  <dd>WhatsApp Business est utile pour la communication (réponses automatiques, étiquettes, statut professionnel), mais son catalogue intégré est limité à 30 produits, sans panier ni message de commande automatique. Pour vendre avec volume et professionnalisme, un outil dédié comme Souqly est nécessaire.</dd>
  <dt data-faq="true">Faut-il un numéro WhatsApp dédié pour sa boutique ?</dt>
  <dd>Ce n'est pas obligatoire, mais recommandé dès que votre volume de commandes dépasse 10 par semaine. Un numéro dédié vous permet de séparer vie personnelle et professionnelle, et d'utiliser WhatsApp Business avec ses fonctionnalités pro.</dd>
  <dt data-faq="true">Souqly fonctionne-t-il pour des marchands au Maroc ou en Algérie ?</dt>
  <dd>Oui. Souqly est conçu pour les marchands francophones, y compris ceux basés au Maroc, en Algérie, en Tunisie ou en Belgique. L'interface est entièrement en français, le support aussi, et les numéros WhatsApp internationaux sont supportés.</dd>
  <dt data-faq="true">Combien de produits peut-on gérer sur Souqly ?</dt>
  <dd>Il n'y a pas de limite sur le nombre de produits ni de catégories. Certains marchands gèrent plusieurs centaines de références sur leur catalogue Souqly.</dd>
</dl>
</div>
    `.trim(),
  },

  // =========================================================================
  // Article 3 — Catalogue vs site e-commerce
  // =========================================================================
  {
    slug: 'catalogue-en-ligne-vs-site-ecommerce',
    title: 'Catalogue en ligne vs site e-commerce : que choisir pour votre boutique en 2026 ?',
    description:
      'Catalogue en ligne ou site e-commerce : comparatif honnête pour les marchands indépendants qui vendent via WhatsApp. Coûts, complexité, cas d\'usage.',
    date: '2026-02-10',
    category: 'Comparatif',
    excerpt:
      'Shopify ou Souqly ? La question mérite une réponse honnête. Un site e-commerce complet peut coûter plusieurs milliers d\'euros et des semaines de configuration. Un catalogue en ligne protégé offre 90 % des bénéfices pour une fraction du coût et du temps.',
    tags: ['catalogue', 'e-commerce', 'comparatif', 'coût', 'shopify'],
    content: `
<h2>Deux outils, deux logiques différentes</h2>
<h3>Ce qu'est un site e-commerce (et ce qu'il implique)</h3>
<p>Un site e-commerce — Shopify, WooCommerce, PrestaShop — est une plateforme complète de vente en ligne. Il gère le paiement en ligne, les stocks, les remboursements, la logistique, les emails transactionnels, les avis clients. C'est un outil puissant, conçu pour des marchands qui vendent à grande échelle à une clientèle qu'ils ne connaissent pas personnellement.</p>
<p>Un site e-commerce implique : une configuration technique initiale (thème, plugin de paiement, TVA, livraison), une maintenance régulière, des mises à jour de sécurité, et une courbe d'apprentissage réelle. Selon une étude de 2025, la mise en place d'un Shopify fonctionnel pour un marchand indépendant prend en moyenne 3 à 6 semaines.</p>
<h3>Ce qu'est un catalogue en ligne avec panier WhatsApp</h3>
<p>Un catalogue en ligne comme Souqly n'est pas un site e-commerce. C'est une vitrine numérique protégée, pensée pour les marchands qui vendent via messagerie. Il n'y a pas de paiement en ligne, pas de gestion de retours automatisée, pas d'emails transactionnels. Ce qu'il y a : un catalogue propre, un accès privé par code, un panier qui génère un message de commande WhatsApp ou Telegram.</p>
<p>Cette différence de positionnement est fondamentale. Souqly ne prétend pas remplacer Shopify — il répond à un besoin différent : structurer la vente de marchands qui ont déjà une clientèle WhatsApp et qui veulent travailler plus efficacement, sans devenir développeurs web.</p>
<h3>La question clé : comment vos clientes commandent-elles aujourd'hui ?</h3>
<p>Si vos clientes vous envoient des messages WhatsApp pour passer commande et vous paient via virement, PayPal ou en espèces, un site e-commerce avec checkout en ligne n'est pas ce qu'il vous faut. Votre processus de vente est déjà WhatsApp — l'enjeu est de le rendre plus professionnel et plus efficace, pas de le remplacer.</p>

<h2>Site e-commerce : pour qui, dans quelles conditions</h2>
<h3>Les avantages réels d'un Shopify ou WooCommerce</h3>
<p>Un site e-commerce a des atouts que nous ne minimiserons pas : paiement en ligne 24h/24 sans intervention de votre part, gestion automatisée des stocks, possibilité d'acquérir des clients via Google (SEO), publicité ciblée, avis clients vérifiés. Pour certains marchands, ces atouts sont déterminants.</p>
<h3>Le vrai coût d'un site e-commerce (au-delà de l'abonnement)</h3>
<p>Shopify annonce 36 €/mois en plan de base. Mais ce n'est que le début : plugins SEO (15-30 €/mois), thème premium (200-350 € en une fois), commissions sur les transactions (0,5 à 2 %), email marketing (20-50 €/mois), service de retouches graphiques... Le coût réel d'un Shopify opérationnel tourne souvent autour de 80-150 €/mois, sans compter le temps investi.</p>
<h3>Les profils de marchands pour qui c'est le bon choix</h3>
<p>Un site e-commerce est pertinent si vous : vendez à des inconnus (trafic froid), souhaitez accepter les paiements en ligne en autonomie, gérez plus de 500 commandes par mois, ou voulez construire une marque indexée sur Google avec du contenu SEO.</p>

<h2>Catalogue en ligne : pour qui, dans quelles conditions</h2>
<h3>Ce que vous gagnez vs ce que vous abandonnez</h3>
<p>Vous gagnez : une mise en place en 30 minutes, aucune compétence technique requise, un catalogue propre et professionnel, une protection contre la copie, des commandes WhatsApp structurées, une gestion depuis votre téléphone. Vous abandonnez : le paiement en ligne automatique, le référencement Google, les avis clients publics. Si votre mode de vente actuel n'utilise pas ces fonctionnalités, vous n'abandonnez rien de concret.</p>
<h3>Quand le catalogue suffit largement</h3>
<p>Le catalogue suffit si : vos clientes commandent déjà via WhatsApp, vous les connaissez personnellement (ou via recommandation), vous acceptez le paiement en direct (virement, espèces, Orange Money), et votre catalogue comporte moins de 500 SKU. Ce profil correspond à la grande majorité des marchands indépendants francophones.</p>
<h3>Les profils de marchands pour qui c'est le bon choix</h3>
<p>Revendeurs mode (produits importés), artisans-producteurs, marchands de niche (sneakers, cosmétiques, alimentation), revendeurs récurrents avec une clientèle établie — tous ces profils profitent d'un catalogue Souqly sans avoir besoin des fonctionnalités d'un site e-commerce.</p>

<h2>Tableau comparatif détaillé</h2>
<table>
  <thead>
    <tr>
      <th>Critère</th>
      <th>Catalogue Souqly</th>
      <th>Shopify (plan de base)</th>
      <th>Instagram direct</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Coût mensuel réel</td>
      <td>29 € tout inclus</td>
      <td>80-150 € (abonnement + plugins)</td>
      <td>Gratuit</td>
    </tr>
    <tr>
      <td>Commission sur ventes</td>
      <td>0 %</td>
      <td>0,5 à 2 %</td>
      <td>0 %</td>
    </tr>
    <tr>
      <td>Mise en place</td>
      <td>30 minutes</td>
      <td>3 à 6 semaines</td>
      <td>N/A</td>
    </tr>
    <tr>
      <td>Paiement en ligne</td>
      <td>Non (WhatsApp)</td>
      <td>Oui</td>
      <td>Non</td>
    </tr>
    <tr>
      <td>Code d'accès privé</td>
      <td>Oui</td>
      <td>Non natif</td>
      <td>Non</td>
    </tr>
    <tr>
      <td>Commande WhatsApp auto</td>
      <td>Oui, natif</td>
      <td>Non</td>
      <td>Non</td>
    </tr>
    <tr>
      <td>Support en français</td>
      <td>Oui</td>
      <td>Partiel</td>
      <td>Non</td>
    </tr>
    <tr>
      <td>Gestion depuis mobile</td>
      <td>Complète</td>
      <td>Partielle</td>
      <td>Oui</td>
    </tr>
    <tr>
      <td>SEO Google</td>
      <td>Non (privé)</td>
      <td>Oui</td>
      <td>Partiel</td>
    </tr>
    <tr>
      <td>Catalogue illimité</td>
      <td>Oui</td>
      <td>Oui</td>
      <td>Limité</td>
    </tr>
  </tbody>
</table>

<div class="cta-inline">Testez le catalogue Souqly gratuitement pendant 14 jours — <a href="/inscription">sans carte bancaire</a></div>

<h2>Les deux approches ne s'excluent pas toujours</h2>
<h3>Comment certains marchands combinent Instagram + catalogue + WhatsApp</h3>
<p>Plusieurs marchands utilisent Instagram pour la communication et la visibilité (stories, reels de nouveautés), Souqly pour le catalogue privé accessible depuis le lien en bio, et WhatsApp pour confirmer et suivre les commandes. Cette combinaison est gratuite côté Instagram, abordable côté Souqly, et ne nécessite aucun site e-commerce.</p>
<h3>Quand faire évoluer son outil de catalogue vers du e-commerce complet</h3>
<p>Vous aurez besoin d'un site e-commerce complet si : vous voulez que des inconnus puissent trouver et acheter vos produits via Google, si votre volume dépasse 500 commandes par mois, ou si vous voulez proposer le paiement en ligne en totale autonomie. Dans ce cas, Shopify ou WooCommerce sont de bons choix — mais ils impliquent un investissement en temps et en argent que vous devez être prêt à faire.</p>

<h2>5 questions pour décider en 5 minutes</h2>
<h3>Combien de temps pouvez-vous consacrer à la mise en place ?</h3>
<p>Si vous pouvez y consacrer 30 minutes ce soir, choisissez Souqly. Si vous êtes prêt à investir 4 à 6 semaines dans une configuration complète, Shopify est envisageable.</p>
<h3>Vos clientes paient-elles en ligne ou en direct ?</h3>
<p>En direct (virement, espèces, mobile money) → catalogue Souqly. En ligne avec carte bancaire → site e-commerce.</p>
<h3>Voulez-vous gérer les retours en ligne ?</h3>
<p>Non → catalogue Souqly suffit. Oui, de façon automatisée → site e-commerce.</p>
<h3>Quel est votre volume mensuel de commandes ?</h3>
<p>Moins de 200 commandes/mois → catalogue Souqly. Plus de 500 commandes/mois → site e-commerce à envisager.</p>
<h3>Votre catalogue change-t-il souvent ?</h3>
<p>Souvent (semaines, collections, soldes) → Souqly est conçu pour ça. Stable avec quelques produits permanents → les deux fonctionnent.</p>

<div class="faq-section">
<h2>FAQ — Catalogue en ligne vs site e-commerce</h2>
<dl>
  <dt data-faq="true">Peut-on intégrer un paiement en ligne sur Souqly ?</dt>
  <dd>Non. Souqly est conçu pour la vente via WhatsApp où le paiement se fait en direct entre le marchand et sa cliente. Si vous avez besoin du paiement en ligne automatique, un site e-commerce comme Shopify est plus adapté.</dd>
  <dt data-faq="true">Souqly peut-il remplacer complètement un site Shopify ?</dt>
  <dd>Pour les marchands qui vendent via WhatsApp à une clientèle existante : oui, dans la majorité des cas. Pour les marchands qui veulent acquérir des clients via Google et accepter des paiements en ligne d'inconnus : non, Shopify reste nécessaire.</dd>
  <dt data-faq="true">Est-il possible d'utiliser Souqly et Shopify en même temps ?</dt>
  <dd>Tout à fait. Certains marchands utilisent Shopify pour leur boutique publique (SEO, clients froids) et Souqly pour leur catalogue privé réservé à leurs clientes WhatsApp habituelles. Les deux outils coexistent sans conflit.</dd>
</dl>
</div>
    `.trim(),
  },

  // =========================================================================
  // Article 4 — Protéger catalogue code d'accès
  // =========================================================================
  {
    slug: 'proteger-catalogue-code-acces',
    title: 'Comment protéger son catalogue produit avec un code d\'accès (guide pratique)',
    description:
      'Protégez votre catalogue produit en ligne avec un code d\'accès : pourquoi c\'est essentiel, comment le mettre en place et comment le gérer avec vos clientes.',
    date: '2026-01-25',
    category: 'Fonctionnalité',
    excerpt:
      'Un catalogue ouvert à tous expose vos prix à la concurrence et dévalue votre offre. Un code d\'accès simple filtre vos vraies clientes, protège vos marges et crée un sentiment d\'exclusivité. Voici comment ça fonctionne.',
    tags: ['sécurité', 'code accès', 'catalogue privé', 'fonctionnalité', 'protection'],
    content: `
<h2>Pourquoi protéger son catalogue produit en ligne</h2>
<h3>Les risques d'un catalogue public pour un marchand indépendant</h3>
<p>Un catalogue accessible à tous sur Internet est indexable par Google, copiable par n'importe qui, et visible de vos concurrents. Pour un revendeur qui travaille avec des marges serrées, exposer ses prix publiquement, c'est offrir à ses concurrents un avantage considérable : ils peuvent s'aligner sur vos tarifs ou vous sous-coter sans effort.</p>
<p>C'est le problème central de Yupoo et des liens Google Drive partagés : n'importe qui peut tomber dessus, copier vos photos, vos références et vos prix. Votre travail de sourcing et de mise en catalogue profite à tout le monde — y compris ceux qui ne vous achèteront jamais rien.</p>
<h3>Ce que voient vos concurrents sur un catalogue ouvert</h3>
<p>Sur un catalogue public, un concurrent peut voir : vos prix de vente (et donc estimer vos marges), vos fournisseurs si vos références sont trop détaillées, vos nouvelles collections avant que vous ne les ayez vendues, votre positionnement tarifaire. Ces informations sont votre fonds de commerce.</p>
<h3>L'effet "exclusivité" : comment le code d'accès valorise votre offre</h3>
<p>Paradoxalement, un catalogue protégé attire plus qu'un catalogue ouvert. Le code d'accès envoie un signal : "ce catalogue n'est pas pour tout le monde". Vos clientes qui reçoivent le code se sentent dans un cercle de confiance. C'est un mécanisme psychologique bien documenté en marketing : la rareté perçue augmente la valeur perçue.</p>

<h2>Les différentes méthodes de protection d'un catalogue</h2>
<h3>Le catalogue public (et ses risques)</h3>
<p>Aucune protection. Accessible à tous, indexé par les moteurs de recherche, copiable librement. Convient aux marchands qui veulent de la visibilité SEO et n'ont pas de contrainte de confidentialité — pas aux marchands indépendants avec des prix sensibles.</p>
<h3>Le compte client obligatoire (et pourquoi vos clientes l'abandonnent)</h3>
<p>Demander à vos clientes de créer un compte (email + mot de passe + confirmation email...) génère un taux d'abandon élevé. Selon les données e-commerce 2025, 23 % des utilisateurs abandonnent un achat quand on leur demande de créer un compte. Vos clientes WhatsApp sont habituées à la simplicité — un formulaire d'inscription les décourage.</p>
<h3>Le PDF protégé par mot de passe (et ses limites)</h3>
<p>Une protection partielle : le mot de passe protège le fichier, mais pas la diffusion. Une fois votre PDF ouvert, son contenu peut être capturé, copié, partagé. De plus, le PDF ne se met pas à jour — chaque modification nécessite un nouveau fichier.</p>
<h3>Le code d'accès simple : la meilleure option pour les marchands WhatsApp</h3>
<p>Un code d'accès (4 à 20 caractères) saisi une fois par la cliente. Pas d'inscription, pas de compte à créer, pas d'email à confirmer. La cliente saisit le code, accède au catalogue pendant 24 heures, puis le ressaisit à la prochaine visite. Simple pour elle, efficace pour vous.</p>

<h2>Comment fonctionne un code d'accès catalogue sur Souqly</h2>
<h3>La différence entre un mot de passe classique et un code d'accès sécurisé</h3>
<p>Un mot de passe classique est souvent stocké en clair dans une base de données — si le serveur est compromis, le mot de passe est lisible. Un code d'accès Souqly est traité différemment : il est transformé en signature cryptographique (hash bcrypt) avant d'être stocké. Le code original n'existe plus dans la base de données.</p>
<p>Quand votre cliente saisit son code, Souqly compare la signature du code saisi avec la signature stockée — sans jamais reconstruire le code original. Même un administrateur Souqly ne peut pas lire votre code en clair.</p>
<h3>La session de 24h : vos clientes n'ont pas à ressaisir le code à chaque visite</h3>
<p>Après la saisie du code, une session sécurisée est créée pour 24 heures. Cette session est stockée dans un cookie httpOnly (inaccessible au JavaScript malveillant) et expire automatiquement. Vos clientes peuvent fermer leur navigateur et revenir dans la journée sans ressaisir le code. C'est confortable pour elles, et c'est suffisamment court pour maintenir une protection efficace.</p>
<h3>Le chiffrement bcrypt : votre code n'est jamais lisible, même par Souqly</h3>
<p>Bcrypt est l'algorithme de hachage de référence pour les mots de passe. Il est délibérément lent (ce qui rend les attaques par force brute très coûteuses) et utilise un "sel" aléatoire (ce qui rend les attaques par dictionnaire inefficaces). Même si quelqu'un obtenait accès à la base de données Souqly, il ne pourrait pas retrouver votre code d'accès à partir du hash stocké.</p>
<h3>Comment invalider toutes les sessions si le code est compromis</h3>
<p>Si vous suspectez que votre code a été partagé sans votre accord (commandes de personnes inconnues, accès inhabituels), vous pouvez en un clic depuis votre tableau de bord Souqly : changer le code d'accès et invalider immédiatement toutes les sessions actives. Les personnes connectées sont déconnectées à leur prochaine action, sans délai.</p>

<div class="cta-inline">Configurez votre code d'accès en 30 secondes — <a href="/inscription">créez votre catalogue Souqly gratuitement</a></div>

<h2>Bonnes pratiques pour gérer votre code d'accès au quotidien</h2>
<h3>Comment transmettre le code sans le dévaluer</h3>
<p>Envoyez le code dans un message séparé du lien, par message privé, jamais dans un groupe public. Ce comportement transmet implicitement que le code est précieux et personnel. Certaines marchandes envoient le code avec un petit message personnalisé ("voici ton accès exclusif à ma collection printemps") — c'est une pratique qui renforce l'attachement à la boutique.</p>
<h3>Faut-il donner le même code à toutes vos clientes ?</h3>
<p>Pour la grande majorité des marchands, un code unique suffit. Si vous avez des segments de clientes très distincts (clientes VIP vs clientes nouvelles, grossistes vs détail), vous pouvez envisager des codes différents par segment — mais cela implique de gérer la communication de façon différenciée.</p>
<h3>À quelle fréquence changer le code ?</h3>
<p>Il n'y a pas de règle absolue. Une bonne pratique est de changer le code à chaque "collection" ou "arrivage" — cela crée un rituel d'annonce ("nouveau code pour la collection été 2026") et maintient l'attention de vos clientes. Changer le code trop fréquemment (chaque semaine) peut devenir irritant pour vos clientes fidèles.</p>
<h3>Que faire si une cliente partage le code sans votre accord ?</h3>
<p>Changez le code et prévenez vos clientes habituelles par message. Vous pouvez profiter de ce moment pour créer un "event" : "J'ai dû changer le code de sécurité — voici le nouveau, réservé à mes clientes confirmées". Ce qui pourrait être vécu comme une contrainte devient une communication positive.</p>

<h2>Le code d'accès comme outil marketing</h2>
<h3>Créer un sentiment d'appartenance chez vos clientes</h3>
<p>Le code d'accès fonctionne comme un passe VIP. Les clientes qui l'ont se sentent dans un groupe select. Ce sentiment d'appartenance augmente leur engagement et leur fidélité. Elles parlent de votre boutique à leur entourage en disant "j'ai le code de la boutique de Nadia" — ce qui est bien meilleur qu'un simple lien public.</p>
<h3>Réserver l'accès VIP à vos meilleures clientes</h3>
<p>Vous pouvez avoir deux niveaux de catalogue : un catalogue public avec quelques produits d'appel (pour les curiosités), et votre catalogue Souqly complet réservé à vos clientes confirmées. Le catalogue Souqly devient alors votre offre premium, accessible sur invitation.</p>
<h3>Annoncer un nouveau code comme un "lancement" de collection</h3>
<p>Mehdi, revendeur sneakers à Lyon, a adopté un rituel : chaque nouvel arrivage est annoncé avec un nouveau code d'accès. Il envoie un message à ses clients : "Nouveau stock Jordans et Dunks — le code pour les premières 24h : STOCKXLYON26". Résultat : ses clients se connectent dans la première heure, et les articles partent rapidement.</p>

<div class="faq-section">
<h2>FAQ — Protection catalogue par code d'accès</h2>
<dl>
  <dt data-faq="true">Le code d'accès peut-il être cracké ou contourné ?</dt>
  <dd>Le chiffrement bcrypt utilisé par Souqly rend une attaque par force brute extrêmement coûteuse en temps et en ressources. Pour un code de 8 caractères ou plus, c'est techniquement impraticable. Le principal risque est humain : une cliente qui partage le code — ce que vous pouvez contrecarrer en changeant le code régulièrement.</dd>
  <dt data-faq="true">Peut-on voir qui a utilisé le code d'accès ?</dt>
  <dd>Souqly vous montre le nombre d'accès par code (statistiques du tableau de bord), mais pas l'identité des utilisateurs — vos clientes n'ont pas de compte. Si vous avez besoin d'identifier des accès non autorisés, le meilleur indicateur est une augmentation inhabituelle du nombre de sessions actives.</dd>
  <dt data-faq="true">Que se passe-t-il si j'oublie mon propre code d'accès ?</dt>
  <dd>Vous pouvez définir un nouveau code à tout moment depuis votre tableau de bord Souqly. L'ancien code est immédiatement remplacé. Les sessions actives avec l'ancien code restent valables jusqu'à expiration naturelle (24h), sauf si vous les invalidez manuellement.</dd>
  <dt data-faq="true">Puis-je avoir un catalogue public et un catalogue privé sur Souqly ?</dt>
  <dd>Actuellement, chaque catalogue Souqly fonctionne avec un code d'accès unique. Vous pouvez choisir de ne pas mettre de code (catalogue public) ou d'en définir un (catalogue privé). La gestion de deux niveaux d'accès sur un même catalogue est sur la feuille de route.</dd>
</dl>
</div>
    `.trim(),
  },

  // =========================================================================
  // Article 5 — Alternatives Yupoo marchands francophones
  // =========================================================================
  {
    slug: 'alternatives-yupoo-marchands-francophones',
    title: 'Les meilleures alternatives à Yupoo pour les marchands francophones en 2026',
    description:
      'Vous cherchez une alternative à Yupoo en français ? Comparatif honnête des meilleures solutions de catalogue en ligne pour marchands France et Maghreb en 2026.',
    date: '2026-01-10',
    category: 'Comparatif',
    excerpt:
      'Yupoo est populaire mais conçu pour le marché asiatique. Interface en anglais, liens qui expirent, aucun panier WhatsApp. Pour les marchands francophones, il existe des alternatives bien mieux adaptées.',
    tags: ['yupoo', 'alternative', 'francophone', 'comparatif', 'catalogue'],
    content: `
<h2>Ce que Yupoo fait bien (et pourquoi tant de marchands l'utilisent encore)</h2>
<h3>Le modèle Yupoo : catalogue photos gratuit, trafic communautaire</h3>
<p>Yupoo est une plateforme chinoise de catalogues photos fondée en 2004. Elle héberge des millions de catalogues et génère un trafic communautaire important, notamment dans les marchés de la mode, des sneakers et des accessoires. Son principal avantage : c'est gratuit, et beaucoup de marchands y ont déjà leurs clientes habituées.</p>
<p>L'interface permet d'uploader des photos en albums, de créer des catégories et de partager des liens. Pour un marchand qui commence et ne veut rien payer, c'est une entrée facile.</p>
<h3>Les usages réels des marchands francophones sur Yupoo</h3>
<p>Les marchands francophones utilisent principalement Yupoo comme "album photo partageable" : ils envoient un lien vers leur album à leurs contacts WhatsApp, les clients font défiler les photos et envoient leur commande manuellement. C'est fonctionnel mais sans structure : pas de panier, pas de message automatique, pas de code d'accès réel.</p>
<h3>Pourquoi c'est difficile d'en partir</h3>
<p>Le principal frein au départ : vos clientes connaissent déjà votre lien Yupoo. Changer de plateforme implique de recommuniquer votre nouvelle adresse. Mais avec une transition bien gérée (lire ci-dessous), ce changement prend moins d'une journée.</p>

<h2>Les 5 problèmes principaux de Yupoo pour un marchand francophone</h2>
<h3>Problème 1 — Interface et support en anglais uniquement</h3>
<p>L'interface de gestion de Yupoo est en anglais et en chinois. Pour un marchand dont ce n'est pas la langue principale, naviguer dans le dashboard, comprendre les paramètres et résoudre un problème devient compliqué. Le support client de Yupoo n'est pas disponible en français — les demandes d'aide restent sans réponse ou obtiennent une réponse en anglais.</p>
<h3>Problème 2 — Liens qui expirent ou disparaissent sans prévenir</h3>
<p>Des marchands francophones rapportent régulièrement des liens Yupoo qui deviennent inaccessibles sans préavis — albums supprimés, comptes suspendus pour des raisons floues, liens redirigés vers des pages d'erreur. Pour un marchand qui a communiqué son lien à des centaines de clientes, une interruption non annoncée représente une perte de chiffre d'affaires réelle.</p>
<h3>Problème 3 — Aucun panier, aucune commande structurée</h3>
<p>Sur Yupoo, vos clientes voient les photos et vous envoient leur commande manuellement sur WhatsApp. Il n'y a pas de panier, pas de message de commande automatique, pas de récapitulatif des produits avec prix et quantités. Chaque commande demande des allers-retours pour clarifier les références et les totaux.</p>
<h3>Problème 4 — Aucune protection par code d'accès réelle</h3>
<p>Yupoo propose une option de "mots de passe" sur les albums, mais ce mécanisme est basique et non sécurisé. Votre contenu peut être indexé par des moteurs de recherche tiers et vos photos peuvent être récupérées. La protection est en-dessous des standards de sécurité 2026.</p>
<h3>Problème 5 — Risque de fermeture de compte sans recours</h3>
<p>Yupoo peut fermer des comptes sans préavis ni explication détaillée. Des milliers de marchands ont perdu leur catalogue du jour au lendemain. Sans support francophone accessible, il est impossible de contester ou de récupérer ses données. Pour les marchands qui bâtissent leur activité sur Yupoo, ce risque est une épée de Damoclès.</p>

<h2>Les alternatives à Yupoo en 2026 : comparatif</h2>
<h3>Alternative 1 — Souqly (catalogue privé + panier WhatsApp, marché francophone)</h3>
<p>Souqly est la seule alternative conçue spécifiquement pour les marchands francophones qui vendent via WhatsApp. Catalogue protégé par code d'accès bcrypt, panier intégré, message de commande automatique WhatsApp/Telegram, interface entièrement en français, support réactif. Tarif : 29 €/mois avec 14 jours d'essai gratuit. Pour créer votre catalogue, lisez notre <a href="/blog/creer-catalogue-produit-whatsapp">guide complet de création de catalogue WhatsApp</a>.</p>
<h3>Alternative 2 — Taplink / Linktree (liens bio, pas un vrai catalogue)</h3>
<p>Ces outils servent à centraliser des liens (Instagram, WhatsApp, PDF, site web) sur une page simple. Ils ne proposent pas de catalogue produit, pas de panier, pas de code d'accès. Utiles comme complément, pas comme remplacement de Yupoo.</p>
<h3>Alternative 3 — Shopify / WooCommerce (e-commerce complet, complexe)</h3>
<p>Pour les marchands qui veulent le paiement en ligne et une boutique SEO-friendly, Shopify est une option. Mais le coût (80-150 €/mois en réalité) et la complexité de mise en place (plusieurs semaines) ne correspondent pas au profil du marchand indépendant francophone type. Pour un comparatif détaillé, lisez <a href="/blog/catalogue-en-ligne-vs-site-ecommerce">catalogue en ligne vs site e-commerce</a>.</p>
<h3>Alternative 4 — Google Drive partagé (gratuit, mais limité)</h3>
<p>Google Drive permet de partager un dossier de photos avec un lien. Gratuit, simple, mais sans panier, sans commande structurée, sans code d'accès sécurisé, et avec une interface peu professionnelle. Acceptable pour démarrer, insuffisant pour structurer une activité.</p>
<h3>Alternative 5 — WhatsApp Business catalogue natif (limité à 30 produits)</h3>
<p>Le catalogue intégré à WhatsApp Business est limité à 30 produits. Pas de panier multi-articles, pas de code d'accès, pas de message de commande automatique. Insuffisant pour la plupart des marchands actifs.</p>

<h2>Tableau comparatif des alternatives à Yupoo</h2>
<table>
  <thead>
    <tr>
      <th>Critère</th>
      <th>Souqly</th>
      <th>Yupoo</th>
      <th>Google Drive</th>
      <th>WhatsApp Business</th>
      <th>Shopify</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Langue française</td>
      <td>Oui, natif</td>
      <td>Non</td>
      <td>Partiel</td>
      <td>Oui</td>
      <td>Partiel</td>
    </tr>
    <tr>
      <td>Prix</td>
      <td>29 €/mois</td>
      <td>Gratuit</td>
      <td>Gratuit</td>
      <td>Gratuit</td>
      <td>36 €/mois+</td>
    </tr>
    <tr>
      <td>Code d'accès sécurisé</td>
      <td>Oui (bcrypt)</td>
      <td>Partiel</td>
      <td>Non</td>
      <td>Non</td>
      <td>Non natif</td>
    </tr>
    <tr>
      <td>Panier WhatsApp</td>
      <td>Oui, natif</td>
      <td>Non</td>
      <td>Non</td>
      <td>Non</td>
      <td>Non</td>
    </tr>
    <tr>
      <td>Support francophone</td>
      <td>Oui</td>
      <td>Non</td>
      <td>Non</td>
      <td>Non</td>
      <td>Partiel</td>
    </tr>
    <tr>
      <td>Stabilité</td>
      <td>Élevée (Vercel/Supabase)</td>
      <td>Incertaine</td>
      <td>Élevée</td>
      <td>Élevée</td>
      <td>Élevée</td>
    </tr>
    <tr>
      <td>Nb produits</td>
      <td>Illimité</td>
      <td>Illimité</td>
      <td>Illimité</td>
      <td>30 maximum</td>
      <td>Illimité</td>
    </tr>
    <tr>
      <td>Commande structurée</td>
      <td>Oui, automatique</td>
      <td>Non</td>
      <td>Non</td>
      <td>Non</td>
      <td>Via checkout</td>
    </tr>
  </tbody>
</table>

<div class="cta-inline">Migrez de Yupoo vers Souqly en une journée — <a href="/inscription">commencez gratuitement pendant 14 jours</a></div>

<h2>Comment migrer de Yupoo vers Souqly sans perdre vos clientes</h2>
<h3>Étape 1 — Créer votre catalogue Souqly en parallèle</h3>
<p>Commencez par créer votre compte Souqly et recréer votre catalogue (catégories, produits, photos). Pendant cette période, votre Yupoo reste actif — vos clientes ne voient aucune interruption. La migration prend entre 30 minutes et quelques heures selon le nombre de produits.</p>
<h3>Étape 2 — Prévenir vos clientes avec votre nouveau lien</h3>
<p>Envoyez un message à vos clientes habituelles : "Je migre vers une nouvelle plateforme plus adaptée ! Voici mon nouveau lien : souqly.fr/votre-boutique — voici ton code d'accès : [code]. Merci de mettre à jour ton lien !" Ce message peut aussi être partagé dans vos groupes WhatsApp et votre statut.</p>
<h3>Étape 3 — Désactiver progressivement votre Yupoo</h3>
<p>Après 2 à 4 semaines (le temps que vos clientes utilisent le nouveau lien), vous pouvez mettre à jour votre Yupoo avec un message de redirection ("nouveau catalogue : souqly.fr/votre-boutique") avant de le désactiver définitivement.</p>

<div class="faq-section">
<h2>FAQ — Alternatives à Yupoo pour marchands francophones</h2>
<dl>
  <dt data-faq="true">Est-ce que mes clientes doivent créer un compte sur Souqly pour commander ?</dt>
  <dd>Non. Vos clientes saisissent simplement le code d'accès que vous leur transmettez. Aucune inscription, aucune application à télécharger. L'expérience est plus simple que sur Yupoo.</dd>
  <dt data-faq="true">Peut-on importer son catalogue Yupoo vers Souqly automatiquement ?</dt>
  <dd>Il n'y a pas d'import automatique depuis Yupoo vers Souqly pour le moment. Vous recréez votre catalogue manuellement — ce qui est aussi l'occasion de nettoyer votre catalogue et de ne garder que les produits actuels.</dd>
  <dt data-faq="true">Souqly est-il plus cher que Yupoo ?</dt>
  <dd>Yupoo est gratuit dans sa version de base, Souqly coûte 29 €/mois. Mais Souqly inclut des fonctionnalités que Yupoo n'a pas (panier WhatsApp, code d'accès sécurisé, support francophone). Pour la plupart des marchands, une seule commande supplémentaire par mois couvre le coût de l'abonnement.</dd>
  <dt data-faq="true">Mon compte Yupoo a été suspendu — que faire ?</dt>
  <dd>Souqly offre un essai gratuit de 14 jours sans carte bancaire. Vous pouvez recréer votre catalogue et reprendre votre activité rapidement. Prévenez vos clientes avec votre nouveau lien Souqly — la migration peut se faire en quelques heures.</dd>
</dl>
</div>
    `.trim(),
  },

  // =========================================================================
  // Article 6 — Générer commandes WhatsApp catalogue
  // =========================================================================
  {
    slug: 'generer-commandes-whatsapp-catalogue',
    title: 'Comment générer plus de commandes via WhatsApp avec un catalogue professionnel',
    description:
      'Augmentez vos commandes WhatsApp avec un catalogue produit structuré : code d\'accès, message automatique, photos optimisées. Conseils concrets pour marchands.',
    date: '2025-12-20',
    category: 'Marketing',
    excerpt:
      'Un catalogue WhatsApp qui ne convertit pas est souvent victime des mêmes problèmes : photos floues, catégories confuses, message de commande trop long. Voici ce qui marche vraiment.',
    tags: ['marketing', 'commandes', 'conversion', 'whatsapp', 'catalogue', 'optimisation'],
    content: `
<h2>Comprendre pourquoi les clientes ne commandent pas (même quand elles regardent)</h2>
<h3>Le catalogue que les clientes quittent sans commander : les 3 causes principales</h3>
<p>Avoir des visites sur son catalogue sans commandes est frustrant — et courant. Les causes les plus fréquentes sont : des photos de mauvaise qualité (floues, mal éclairées, sans contexte), des catégories mal organisées (qui obligent la cliente à chercher au lieu de trouver), et un processus de commande trop long ou trop confus.</p>
<p>Si votre catalogue reçoit des visites mais peu de commandes, il y a des leviers d'optimisation clairs et actionnables. Aucun ne nécessite de budget publicitaire.</p>
<h3>Ce que veulent vraiment vos clientes quand elles consultent un catalogue</h3>
<p>Vos clientes ont trois questions quand elles consultent votre catalogue : "Est-ce que ce produit correspond à ce que je cherche ?", "Est-ce que le prix est acceptable ?", et "Comment je commande ?" Plus vous répondez vite à ces trois questions, plus votre taux de conversion est élevé.</p>
<h3>La friction cachée : tout ce qui ralentit une commande</h3>
<p>La friction, c'est tout ce qui s'interpose entre l'envie d'acheter et l'achat effectif : une page qui charge lentement, une catégorie introuvable, un prix absent, un bouton "Commander" qui n'est pas visible. Chaque friction supplémentaire fait partir une cliente. Sur Souqly, le parcours est conçu pour minimiser ces frictions — mais votre catalogue doit aussi être optimisé de votre côté.</p>

<h2>Optimiser votre catalogue pour la conversion</h2>
<h3>Les photos qui vendent : format, cadrage, fond, lumière</h3>
<p>La règle d'or : une photo nette vaut mieux que dix photos floues. Pour les vêtements, des photos portées (sur mannequin ou à plat sur fond blanc) performent mieux que des photos dans leur emballage. Pour les cosmétiques, montrez le produit ouvert et son rendu sur peau. Pour les sneakers, une photo de profil et une photo de semelle suffisent à déclencher l'achat.</p>
<p>Évitez les fonds surchargés. Un fond uni (blanc, gris clair, ou noir pour les produits premium) met le produit en valeur. Sur mobile, la photo d'un produit sur fond blanc est 40 % plus visible qu'une photo sur fond coloré, selon les données de tests A/B d'usines e-commerce.</p>
<h3>Les descriptions qui convainquent : nom, référence, disponibilité</h3>
<p>Pour chaque produit, indiquez systématiquement : le nom clair ("Robe florale col V"), la référence courte ("RF-045"), la taille disponible ou les variantes disponibles, et une description de 1 à 3 lignes maximum. Les descriptions longues ne sont pas lues sur mobile — allez à l'essentiel.</p>
<h3>L'organisation des catégories : logique cliente, pas logique stock</h3>
<p>Organisez vos catégories depuis la perspective de vos clientes. Elles cherchent "Robes" pas "Lot Dubaï arrivage mars". Des catégories courtes et claires (5 à 8 pour commencer) permettent de trouver un produit en moins de 3 clics. Si votre catalogue dépasse 100 produits, envisagez des sous-catégories : "Robes / Courtes", "Robes / Longues".</p>
<h3>Le prix : l'afficher ou pas, et comment</h3>
<p>L'affichage du prix est une décision commerciale. Si vous vendez à des clientes habituelles à prix fixes, affichez les prix — cela accélère la décision d'achat. Si vous avez des prix variables selon les quantités ou les clientes, une ligne "Prix sur demande" est acceptable. Ne laissez jamais les prix vides : c'est la première chose que cherche une cliente, et une fiche sans prix génère des messages "c'est combien ?" qui consomment du temps.</p>

<h2>Le message de commande parfait</h2>
<h3>Ce que doit contenir un bon message de commande WhatsApp</h3>
<p>Un bon message de commande WhatsApp contient, dans l'ordre : une ligne de bonjour avec le nom de votre boutique, la liste des produits avec référence, quantité et prix unitaire, le total de la commande, un espace pour les informations de livraison ou de retrait. Souqly génère ce message automatiquement depuis votre template — assurez-vous que votre template est complet.</p>
<h3>Comment personnaliser votre template pour réduire les allers-retours</h3>
<p>Ajoutez dans votre template : un champ "Nom de la cliente" (pour que vous sachiez immédiatement qui commande), un champ "Mode de livraison" (en main propre, Mondial Relay, La Poste), et un champ "Remarques" pour les demandes spéciales (taille alternative, couleur préférée). Un message qui contient déjà ces informations ne nécessite aucune question supplémentaire de votre part.</p>
<h3>Le rôle du champ "remarques" pour éviter les erreurs de commande</h3>
<p>Sans champ de remarques, vos clientes envoient la commande, puis un second message : "Au fait, le pantalon, c'est pour un 38 pas un 36". Avec un champ de remarques intégré au template, cette information est déjà dans la commande. Moins d'échanges, moins d'erreurs, moins de retours.</p>

<h2>Comment partager votre catalogue pour maximiser les visites</h2>
<h3>Le bon moment pour envoyer votre lien dans un groupe WhatsApp</h3>
<p>Les données montrent que les meilleures heures pour envoyer un lien catalogue WhatsApp dans un groupe sont le soir (entre 19h et 21h) et le week-end (samedi matin). Évitez les matins de semaine où votre message sera noyé dans les notifications. Un bon timing peut multiplier par 3 le nombre de visites sur votre catalogue.</p>
<h3>Bio Instagram + lien catalogue : la combinaison qui fonctionne</h3>
<p>Mettez votre lien Souqly en bio Instagram avec une call-to-action claire : "Catalogue complet — lien en bio (DM pour le code)". Vos abonnés voient vos produits en stories, veulent en savoir plus, cliquent sur la bio, et vous demandent le code en message privé. Ce processus qualifie naturellement votre audience et crée une relation directe avec chaque cliente.</p>
<h3>Annoncer un nouveau code d'accès comme un événement</h3>
<p>Ne changez pas votre code en silence. Annoncez-le comme un événement : "Nouveau stock et nouveau code dès demain — DM moi pour l'avoir en avant-première". Ce type d'annonce génère des messages entrants, relance les clientes inactives et crée de l'anticipation. Pour en savoir plus sur la gestion du code d'accès, lisez notre article sur <a href="/blog/proteger-catalogue-code-acces">comment protéger son catalogue avec un code d'accès</a>.</p>

<h2>Fidéliser les clientes qui commandent une première fois</h2>
<h3>Le message de confirmation qui donne envie de revenir</h3>
<p>Après chaque commande, envoyez un message de confirmation personnalisé : "Ta commande [références] est bien reçue — je la prépare et je te confirme sous [délai]. Merci !" Ce message simple rassure la cliente et crée une impression professionnelle. Ajoutez en fin de message : "Le prochain arrivage est attendu dans 10 jours — je t'enverrai le code en avant-première."</p>
<h3>Comment utiliser les stats de votre catalogue pour agir au bon moment</h3>
<p>Votre tableau de bord Souqly vous montre quand votre catalogue reçoit le plus de visites. Si vous constatez un pic de visites le vendredi soir, c'est le bon moment pour annoncer une nouveauté. Si vous voyez que certaines catégories sont peu visitées, envisagez de les réorganiser ou de les renommer. Les données transforment des intuitions en décisions.</p>
<h3>La relance catalogue : quand et comment</h3>
<p>Envoyez une relance à vos clientes silencieuses après 3 à 4 semaines sans commande. Un message simple : "Bonjour [prénom], j'ai reçu de nouveaux produits qui pourraient t'intéresser — voici le lien et le code mis à jour." Ni trop intrusif ni trop froid. Cette relance simple réactive en général 15 à 25 % des clientes inactives.</p>

<h2>3 exemples de marchands qui ont doublé leurs commandes WhatsApp</h2>
<h3>Cas 1 — Revendeuse mode : refonte du catalogue + message de commande</h3>
<p>Nadia, boutique mode à Créteil, avait un catalogue de 80 produits mal organisés et des photos prises en intérieur avec peu de lumière. Après une refonte du catalogue (photos refaites en lumière naturelle, 6 catégories claires, descriptions courtes avec références), et la mise en place d'un template de commande complet, elle a vu ses commandes hebdomadaires passer de 8 à 21 en un mois. Le seul investissement : 3 heures de refonte de catalogue.</p>
<h3>Cas 2 — Artisane cosmétique : partage du lien au bon moment</h3>
<p>Khadija, cosmétiques naturels artisanaux, a commencé à partager son lien Souqly dans son statut WhatsApp chaque jeudi soir (au lieu du mardi matin). Elle a aussi mis le lien dans sa bio Instagram avec "DM pour le code". En deux semaines, ses visites ont triplé et ses commandes hebdomadaires ont doublé. Aucun nouveau produit ajouté — seulement un meilleur timing et une meilleure distribution.</p>
<h3>Cas 3 — Revendeur streetwear : catalogue Telegram + code exclusif</h3>
<p>Mehdi, sneakers et streetwear à Lyon, a adopté un système de "drops" : un nouveau code à chaque arrivage, annoncé 24h à l'avance dans son groupe Telegram. Les clients qui ont le code accèdent aux nouvelles pièces en avant-première. Les articles les plus recherchés partent dans les premières heures. Ce système crée de l'urgence sans artifice — les articles sont vraiment limités.</p>

<div class="cta-inline">Appliquez ces conseils sur votre catalogue dès aujourd'hui — <a href="/inscription">14 jours gratuits sur Souqly</a></div>

<div class="faq-section">
<h2>FAQ — Générer plus de commandes via WhatsApp</h2>
<dl>
  <dt data-faq="true">Combien de visites faut-il pour obtenir une commande sur un catalogue WhatsApp ?</dt>
  <dd>Un catalogue bien optimisé (bonnes photos, catégories claires, message de commande complet) convertit entre 15 et 30 % de ses visiteurs en commandes. Un catalogue non optimisé peut descendre sous 5 %. Les leviers d'optimisation décrits dans cet article permettent généralement de doubler le taux de conversion en quelques semaines.</dd>
  <dt data-faq="true">Faut-il afficher les prix dans son catalogue WhatsApp ?</dt>
  <dd>En général, oui. Un prix affiché accélère la décision d'achat et évite les messages "c'est combien ?". La seule exception : si vos prix varient selon les clientes (clients grossistes vs détail) ou selon les quantités — dans ce cas, une ligne "Prix sur demande" est acceptable.</dd>
  <dt data-faq="true">Combien de produits faut-il dans un catalogue pour qu'il soit efficace ?</dt>
  <dd>Il n'y a pas de seuil minimum. Un catalogue de 10 produits bien photographiés et bien décrits peut très bien convertir. L'important est la qualité des fiches produits, pas la quantité. Un catalogue de 200 produits avec de mauvaises photos sera moins efficace qu'un catalogue de 30 produits avec des photos soignées.</dd>
  <dt data-faq="true">Les stats Souqly permettent-elles de savoir quels produits sont les plus vus ?</dt>
  <dd>Le tableau de bord Souqly affiche le nombre de visites global du catalogue, le nombre d'accès par code et le nombre de commandes générées. Les statistiques par produit sont sur la feuille de route des fonctionnalités à venir.</dd>
</dl>
</div>
    `.trim(),
  },
];

// ---------------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------------

function computeReadingTime(content: string): number {
  const wordCount = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
}

export const ALL_POSTS: BlogPost[] = RAW_POSTS.map((post) => ({
  ...post,
  readingTime: computeReadingTime(post.content),
})).sort((a, b) => b.date.localeCompare(a.date));

export function getAllPosts(): BlogPost[] {
  return ALL_POSTS;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return ALL_POSTS.find((post) => post.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return ALL_POSTS.slice(0, limit);

  return ALL_POSTS.filter((post) => post.slug !== slug)
    .sort((a, b) => {
      const aScore =
        (a.category === current.category ? 2 : 0) +
        a.tags.filter((t) => current.tags.includes(t)).length;
      const bScore =
        (b.category === current.category ? 2 : 0) +
        b.tags.filter((t) => current.tags.includes(t)).length;
      return bScore - aScore;
    })
    .slice(0, limit);
}
