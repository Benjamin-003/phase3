# Laboratoire - Système de Planification

## Description

Ce projet propose une solution algorithmique pour l'ordonnancement automatisé d'analyses médicales au sein d'un laboratoire. L'objectif est d'optimiser l'utilisation des ressources humaines (techniciens) et matérielles (équipements) tout en garantissant le respect strict des priorités médicales. Le système résout la problématique complexe de la synchronisation entre la disponibilité des échantillons, les compétences spécifiques des techniciens et les cycles de maintenance/nettoyage des machines.

## Installation

1. Assurez-vous d'avoir Node.js installé sur votre environnement.
2. Clonez ou téléchargez le répertoire du projet.
3. Ouvrez un terminal à la racine du projet et installez les dépendances nécessaires :
   npm install

## Utilisation

1. Placez vos données d'entrée (échantillons, techniciens, équipements) dans le dossier /data au format JSON.
2. Pour compiler le code TypeScript en JavaScript :
   npm run build
3. Pour exécuter l'algorithme de planification :
   npm start
4. Le résultat de la planification ainsi que les indicateurs de performance seront générés dans le fichier :
   /output/output-example.json

## Évolution depuis version SIMPLE

Cette version "Intermédiaire" apporte plusieurs améliorations critiques par rapport au modèle de base :

* Gestion des priorités : Implémentation d'un tri multicritère (STAT, URGENT, ROUTINE) couplé à l'heure d'arrivée.
* Spécialisation des ressources : Filtrage des techniciens par compétences métier (Hématologie, Biochimie, etc.) et des équipements par compatibilité d'analyse.
* Efficacité variable : Prise en compte d'un coefficient d'efficacité par technicien impactant la durée réelle de chaque analyse.
* Contraintes opérationnelles : Intégration automatique de temps de nettoyage obligatoires entre deux utilisations d'un équipement.
* Gestion des pauses : Décalage intelligent des tâches non-prioritaires pour respecter les créneaux de déjeuner des techniciens.
* Analyse de performance : Génération automatique de métriques incluant le temps d'attente moyen par priorité et le taux d'utilisation des ressources.