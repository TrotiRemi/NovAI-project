# Structure Profil Utilisateur

## Informations à Collecter

### Section 1: Identité & Contexte
- **Prénom**
- **Âge**
- **Niveau d'études actuel** (lycée, bac, L1, L2, L3, master)
- **Localisation géographique**
- **Situation actuelle** (étudiant, en recherche, en transition)

### Section 2: Parcours & Expériences
- **Expériences scolaires marquantes**
- **Projets réalisés** (scolaires, personnels, associatifs)
- **Domaines explorés** (technologie, sciences, humanités, arts)
- **Réussites personnelles**
- **Défis surmontés**

### Section 3: Profil Psychologique (Modèle IAG)
- **I (Introversion/Extraversion)**: Préférence sociale
- **A (Analyste/Créatif)**: Mode de pensée
- **G (Généraliste/Spécialiste)**: Approche du travail

## Questions Initiales (Chauffeur)

1. "Bonjour ! Pour mieux te connaître, peux-tu me dire comment tu te décrirais en quelques mots ?"
2. "Quel est ton niveau d'études actuel ?"
3. "Peux-tu me parler d'un moment où tu t'es senti vraiment engagé dans une activité ou un projet ?"
4. "Aimes-tu plutôt travailler seul(e) ou en équipe ?"
5. "Comment aimes-tu apprendre : en expérimentant, en lisant, en écoutant, ou d'une autre façon ?"

## Questions Adaptatives (Évoluent selon réponses)

### Si l'utilisateur mentionne :
- **Travail d'équipe** → Approfondir: "Quel type de rôle préfères-tu dans une équipe ? Leader, coordinateur, expert technique ?"
- **Travail solitaire** → Approfondir: "Préfères-tu des tâches bien définies ou des projets où tu dois créer ta propre structure ?"
- **Création/innovation** → Orienter vers créatif: "Est-ce que tu aimes aussi mettre en place tes idées concrètement, ou tu préfères juste les imaginer ?"
- **Analyse/logique** → Orienter vers analytique: "Aimes-tu résoudre des problèmes complexes ? Donner un exemple."
- **Domaines technologiques** → Approfondir: "Quel type de tech t'intéresse ? Code, hardware, données, design ?"
- **Domaines scientifiques** → Approfondir: "Plutôt biologie, physique, chimie, ou mathématiques ?"

## Schéma de Questions Adaptatif

```
Profil Initial
    ↓
Question 1: Description personnelle
    ↓
Si créatif → Questions créativité | Si analytique → Questions logique
    ↓
Si collaboratif → Questions travail d'équipe | Si solitaire → Questions autonomie
    ↓
Si technophile → Questions technologie | Si humaniste → Questions impact social
    ↓
Approfondir les domaines mentionnés
    ↓
Construire portrait complet
```

## Données Stockées

```json
{
  "user_id": "unique_id",
  "profil": {
    "prenom": "string",
    "age": "number",
    "niveau_etudes": "string",
    "localisation": "string",
    "situation": "string",
    "description_personnelle": "string",
    "expériences": ["string"],
    "moments_engages": ["string"],
    "style_travail": "solo|equipe|mixte",
    "style_apprentissage": "experimental|lecture|ecoute|autre",
    "iad_profile": {
      "I": "introvert|extravert|equilibre",
      "A": "analyste|creativ|equilibre",
      "G": "generaliste|specialiste|equilibre"
    },
    "points_forts": ["string"],
    "defis": ["string"],
    "interests_domaines": ["string"],
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```
