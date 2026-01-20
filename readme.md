Voici ton **Cheat Sheet** converti en format Markdown (`.md`), prêt à être copié dans un fichier `RULES.md` à la racine de ton projet par exemple.

---

# 📋 Cheat Sheet : Système de Planification Labo

## 1. Hiérarchie des Priorités

Le moteur de tri suit un ordre strict pour déterminer quel échantillon passe en premier :

1. **STAT** : Priorité absolue (urgence vitale).
2. **URGENT** : Priorité intermédiaire.
3. **ROUTINE** : Traitement standard.

> **Règle de départage :** Si deux échantillons ont la même priorité, celui qui possède l'heure d'arrivée (`arrivalTime`) la plus ancienne est traité en premier (**FIFO - First In, First Out**).

---

## 2. Matrice de Compatibilité Ressources

Chaque analyse nécessite un binôme **Technicien + Équipement** adapté au type de l'échantillon.

| Type Échantillon | Spécialité Technicien | Type Équipement |
| --- | --- | --- |
| **BLOOD** | `BLOOD` ou `GENERAL` | `BLOOD` |
| **URINE** | `GENERAL` uniquement | `URINE` |

---

## 3. Logique Temporelle d'Assignation

L'heure de début d'une analyse () est déterminée par la disponibilité simultanée de trois facteurs :

* **Heure de Fin :**  (en minutes).
* **Mise à jour :** Une fois assignés, le technicien et l'équipement sont marqués "occupés" jusqu'à l'heure de fin calculée.

---

## 4. Contraintes de Capacité & Identité

* **Unicité :** Chaque technicien (`T001`, `T002`...) et chaque machine (`E001`, `E002`...) est une entité unique. Ils ne peuvent traiter qu'**un seul** échantillon à la fois.
* **Horaires :** Un technicien ne peut pas commencer une tâche avant son `startTime` ni la finir après son `endTime`.

---

## 5. Flux de Données

* **Input :** Fichiers JSON locaux (via `DataService`).
* **Sortie attendue :** Un tableau d'objets `ScheduledAnalysis` détaillant le planning complet.

---
