/* ==========================================================
   TES PROJETS — ajoute un projet en copiant un bloc { ... }
   ----------------------------------------------------------
   title     : nom du projet
   category  : "Web", "Desktop", "C", "Base de données" ou "Système"
   desc      : 1 à 2 phrases
   tags      : technologies utilisées
   cover     : image de couverture (dans images/art/ ou ta propre image)
   github    : lien du dépôt GitHub ("" pour masquer le bouton)
   demo      : lien de démo en ligne ("" pour masquer le bouton)

   Astuce : tu peux aussi ajouter un projet directement depuis la
   page « Projets » avec le bouton « Ajouter un projet » (il reste
   enregistré dans ton navigateur uniquement).
   ========================================================== */
window.PROJECTS = [
  {
    title: "CEPS — Gestion pharmacie et cosmétique",
    category: "Web",
    desc: "Application web PHP MVC sécurisée pour gérer les produits de santé et cosmétiques, avec rôles administrateur et client.",
    tags: ["PHP", "MVC", "MySQL"],
    cover: "images/art/cepsweb.png",
    github: "",
    demo: ""
  },{
   title: "CEPS — Gestion pharmacie et cosmétique",
    category: "Mobile",
    desc: "Application mobile java sécurisée pour gérer les produits de santé et cosmétiques, avec rôles administrateur et client.",
    tags: ["JAVA", "MVC", "PostgreSQL"],
    cover: "images/art/cepsapk.jpeg",
    github: "",
    demo: ""
  },
  {
    title: "Gestion de commissariat (PNH)",
    category: "Web",
    desc: "Application web PHP MVC et version desktop Java Swing, partageant le même modèle MVC et la même base de données.",
    tags: ["PHP", "Java Swing", "MySQL"],
    cover: "images/art/pnh.png",
    github: "",
    demo: ""
  },
  {
    title: "Gestion d'une banque",
    category: "C",
    desc: "Comptes, dépôts, retraits, virements et historique, avec tri, recherche, statistiques et sauvegarde dans un fichier.",
    tags: ["C", "Fichiers", "Algorithmique"],
    cover: "images/art/bank.png",
    github: "",
    demo: ""
  },
  {
    title: "Gestion d'un restaurant",
    category: "C",
    desc: "Menu, commandes, facturation et ventes, avec recherche, tri, statistiques et sauvegarde dans un fichier.",
    tags: ["C", "Structures", "Fichiers"],
    cover: "images/art/res.jpeg",
    github: "",
    demo: ""
  },
   {
    title: "G&G Boutique en ligne",
    category: "HTML",
    desc: "Menu, commandes, facturation et ventes des produit , informatique,livres,vetements.",
    tags: ["HTML/CSS","JavaScript"],
    cover: "images/art/gg.png",
    github: "https://github.com/glemaudezechiel7-lang/G-G/",
    demo: "https://glemaudezechiel7-lang.github.io/G-G/"
  },
  {
    title: "Base de données des inscrits et résultats",
    category: "Base de données",
    desc: "Base relationnelle conçue avec MySQL Workbench : modélisation entité-relation et optimisation des requêtes.",
    tags: ["MySQL", "Workbench", "SQL"],
    cover: "images/art/bdd.jpeg",
    github: "",
    demo: ""
  },
  {
    title: "Sécurisation d'un serveur Linux",
    category: "Système",
    desc: "Serveur local sous Linux avec règles de pare-feu iptables et connexions distantes renforcées par SSH.",
    tags: ["Linux", "iptables", "SSH"],
    cover: "images/art/lunix.jpeg",
    github: "",
    demo: ""
  }
];
