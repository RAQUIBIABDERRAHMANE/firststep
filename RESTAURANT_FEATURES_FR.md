# Documentation des Fonctionnalités — Service de Restauration (FirstStep)

Le service de restauration de **FirstStep** est une solution complète, moderne et responsive, conçue pour digitaliser les opérations d'un restaurant, de la prise de commande autonome par QR code jusqu'à la facturation, en passant par le suivi en cuisine, la gestion des réservations et l'analyse mensuelle automatisée des performances.

---

## 1. Site Web & Expérience Client Public

Chaque restaurant dispose d'un site web dédié (accessible via un slug unique, par exemple `/[restaurant-slug]`) optimisé pour les mobiles et les ordinateurs, offrant les fonctionnalités suivantes :

*   **Menu Digital Interactif :**
    *   Affichage fluide des catégories et des plats du menu avec des photos, des descriptions, des tags (ex: 🌶️ Épicé, 🌱 Végétarien), et le statut de disponibilité (en stock / épuisé).
    *   **Options de Plats (Modificateurs) :** Possibilité de choisir des options exclusives (ex: cuisson de la viande : Bleue, À point, Bien cuite ; ou taille de pizza : Moyenne, Grande). Chaque choix peut modifier le prix de base.
    *   **Suppléments (Add-ons) :** Possibilité d'ajouter des extras (ex: double fromage, frites supplémentaires) avec un surcoût spécifié.
*   **Commande Autonome par Table (QR Code) :**
    *   Les clients installés à une table scannent un QR code unique qui les redirige vers le menu digital associé à leur numéro de table.
    *   Ils peuvent composer leur panier et valider leur commande en direct depuis leur smartphone.
    *   Les calculs de prix et d'options sont validés de manière sécurisée côté serveur.
*   **Services à Table Intégrés :**
    *   **Appel Serveur (`🔔 Appeler Serveur`) :** Bouton direct sur l'interface mobile pour signaler au serveur qu'il doit se rendre à la table.
    *   **Demande d'Addition (`🔔 Demander l'addition`) :** Bouton permettant de demander l'addition directement en salle.
*   **Formulaire de Réservation :**
    *   Permet aux clients extérieurs de planifier et de soumettre des demandes de réservation (nom, téléphone, e-mail, date, heure, nombre de couverts et notes spéciales).

---

## 2. Tableau de Bord d'Administration (Restaurant Admin Hub)

Le portail administratif permet au restaurateur de gérer l'intégralité du système. Il propose une vue globale ainsi que plusieurs modules spécialisés :

### 📊 Statistiques de l'Aperçu
*   **Tables Actives :** Nombre de tables physiques configurées.
*   **Plats au Menu :** Nombre total de plats créés et configurés.
*   **Commandes Totales :** Volume total de commandes traitées.
*   **Serveurs Actifs :** Effectif du personnel configuré.
*   **Réservations En Attente :** Compteur des nouvelles demandes de réservation à valider.

---

## 3. Les Modules d'Administration Spécifiques

### 🍔 Gestion du Menu (`/menu`)
*   **Catégories :**
    *   Création, modification, masquage et suppression de catégories (ex: Entrées, Plats principaux, Desserts, Boissons).
    *   Gestion de l'ordre d'affichage (Drag & drop ou classement numérique).
*   **Plats (Dishes) :**
    *   Ajout d'images (téléchargement ou lien R2), description, prix (en MAD) et ordre d'affichage.
    *   Configuration dynamique des options et des suppléments au format JSON (options de cuisson, suppléments, sauces).
    *   Ajout de tags descriptifs et activation/désactivation en temps réel (pour mettre rapidement un plat "Hors Stock").

### 📍 Gestion des Tables & Plan de Salle (`/tables`)
*   **Création Flexible :**
    *   Ajout unitaire de table avec numéro et capacité d'accueil (nombre de sièges).
    *   **Création en lot (Bulk Creation) :** Génération rapide de 1 à 500 tables avec préfixe (ex: "Table ", "T") et numéro de départ.
*   **Plan de Table Interactif (Floor Plan Builder) :**
    *   Interface visuelle en drag-and-drop permettant de disposer virtuellement les tables afin de représenter l'aménagement réel du restaurant.
*   **Génération de QR Codes :**
    *   Système d'impression (`TablePrintRequest`) permettant de demander l'impression groupée des QR codes pour les tables sélectionnées.
    *   Les QR codes intègrent un identifiant unique (CUID) pour sécuriser l'accès et lier directement la commande à la bonne table physique.

### 🎨 Studio de Design (`/design`)
*   **Modèles de Template (Design Templates) :**
    *   Choix parmi 4 thèmes graphiques premium : **Classic**, **Modern**, **Minimal**, et **Moroccan** (pour une ambiance orientale traditionnelle).
*   **Configuration de la Marque :**
    *   Personnalisation du titre de la page, du logo, et de l'image de couverture du site.
    *   Contrôle précis des couleurs (couleur principale, couleur d'arrière-plan, couleur du texte, couleur des cartes de plats).
*   **Paramètres d'Exploitation :**
    *   Définition des coordonnées (adresse complète, téléphone).
    *   Horaires d'ouverture globaux.
    *   Définition des créneaux horaires d'ouverture et de fermeture autorisés pour les réservations de tables.

### 👥 Gestion des Serveurs (`/waiters`)
*   **Profils Serveurs :** Création des comptes du personnel de salle avec leur nom et un code PIN sécurisé.
*   **Attribution des Tables :** Association des serveurs aux tables spécifiques pour qu'ils sachent quelles zones ils doivent servir et pour répartir les notifications d'appel serveur ou de demande d'addition.

### 📅 Réservations de Tables (`/reservations`)
*   **Gestion des Statuts :** Suivi des demandes avec possibilité de les accepter (`APPROVED`), les annuler/refuser (`CANCELLED`) ou les laisser en attente (`PENDING`).
*   **Attribution des Tables :** Possibilité d'affecter une table physique spécifique à une réservation confirmée.

### 📋 Suivi des Commandes en Temps Réel (`/orders`)
*   **Moniteur de Commande en Direct (KDS / Live Monitor) :**
    *   Affichage en temps réel de toutes les commandes actives arrivant des tables.
    *   Visualisation claire des détails de chaque commande : numéro de table, liste des plats avec les options choisies et suppléments sélectionnés, heure de création.
    *   **Changement de Statut Interactif :** Passage de la commande par différents états :
        *   `PENDING` (Envoyée/Reçue)
        *   `PREPARING` ou `COOKING` (En préparation/En cuisson)
        *   `READY` (Prête en cuisine)
        *   `SERVED` (Servie à table)
    *   **Gestion des Alertes de Salle :** Les notifications d'appel serveur et de demande d'addition apparaissent en premier et peuvent être validées par le personnel.

### 📈 Analytiques Live (`/analytics`)
*   Graphiques et statistiques d'activité dynamiques.
*   Suivi du Chiffre d'Affaires total et du nombre de transactions.
*   Filtres de consultation par **Jour**, **Mois**, ou **Année** pour une vision à court et long terme.

### 📄 Rapports Mensuels PDF & E-mails (`/reports`)
*   **Génération Automatique :** Le 1er de chaque mois, le système calcule l'ensemble des données d'analyse du mois écoulé.
*   **Envoi d'E-mail Automatisé :** Un e-mail contenant le récapitulatif ainsi que le rapport PDF en pièce jointe est automatiquement envoyé au propriétaire du restaurant.
*   **Contenu du Rapport PDF (2 Pages A4 Professionnelles) :**
    *   *Résumé Financier :* Chiffre d'affaires global, nombre total de commandes traitées, panier moyen (valeur moyenne par commande), et nombre de commandes payées.
    *   *Palmarès des Plats :* Tableau des 8 plats les plus vendus avec quantité écoulée et revenus générés.
    *   *Palmarès des Tables :* Tableau des 8 tables les plus rentables et actives en salle.
    *   *Activité Journalière :* Tableau détaillé jour par jour indiquant le nombre de commandes et les revenus quotidiens.
    *   *Graphique à barres :* Graphique de performance représentant l'évolution des revenus journaliers.
*   **Actions Administrateur :** Depuis l'interface, le restaurateur peut générer manuellement un rapport pour n'importe quel mois/année, télécharger le rapport PDF instantanément, renvoyer l'e-mail de synthèse ou supprimer un rapport.

---

## 4. Architecture de Données (Résumé Technique)

Les fonctionnalités s'appuient sur les modèles de base de données suivants (via Prisma ORM) :

*   `TenantWebsite` : Stocke le site, le slug, la configuration visuelle (JSON `config`) et le template.
*   `RestaurantCategory` & `RestaurantDish` : Stockent le menu, les plats, les prix, les options/suppléments (JSON) et l'ordre d'affichage.
*   `RestaurantTable` & `RestaurantWaiter` : Stockent les tables physiques, la capacité, la disposition visuelle de la salle (coordonnées 2D) et les serveurs affectés avec leur PIN de connexion.
*   `RestaurantOrder` & `RestaurantOrderItem` : Enregistrent chaque transaction avec l'état actuel (`PENDING`, `COOKING`, `READY`, `SERVED`, `PAID`) et la composition exacte avec options/suppléments choisis.
*   `RestaurantReservation` : Enregistre les coordonnées des clients, la date/heure de réservation, le nombre de personnes et la table affectée.
*   `RestaurantReport` : Enregistre les métriques mensuelles figées en JSON pour la génération du PDF.
*   `TablePrintRequest` : Enregistre les demandes d'impressions groupées de QR codes.
