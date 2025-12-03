# Structure Goûts Utilisateur

## Informations à Collecter

### Section 1: Passions & Intérêts
- **Domaines technologiques** (dev, data, design, infra, etc.)
- **Domaines scientifiques** (biologie, physique, mathématiques, etc.)
- **Thèmes transversaux** (environnement, santé, éducation, finance, gaming, espace, IA, cybersécurité)
- **Industries d'intérêt** (startup, grande entreprise, ESS, recherche, public)
- **Types de problèmes à résoudre**

### Section 2: Activités & Hobbies
- **Activités créatives** (codage, design, écriture, art)
- **Activités analytiques** (résolution de problèmes, jeux stratégiques, débats)
- **Activités sociales** (mentoring, leadership, communication, événements)
- **Activités autonomes** (apprentissage autodidacte, projets perso, expérimentation)

### Section 3: Valeurs & Impact
- **Impact souhaité** (créer, innover, optimiser, aider, découvrir)
- **Cause** (combattre le changement climatique, démocratiser la tech, etc.)
- **Environnement de travail préféré** (startup dynamique, labo de recherche, gouvernement, associatif)

### Section 4: Contexte Métier
- **Secteurs attirants**
- **Type d'entreprise**
- **Type de mission**
- **Rythme de travail préféré** (stable, varié, challenge constant)

## Questions Initiales (Chauffeur)

1. "Quel domaine de la technologie ou de la science te fascine le plus ?"
2. "Y a-t-il un problème dans le monde que tu aimerais aider à résoudre ?"
3. "Décris une activité qui te rend vraiment heureux(se) et engagé(e)."
4. "Préfères-tu créer des choses nouvelles ou améliorer ce qui existe ?"
5. "Quel secteur d'activité te semble attractif pour travailler ?"

## Questions Adaptatives (Évoluent selon réponses)

### Si l'utilisateur mentionne :

**Domaine spécifique (ex: espace, IA, cybersécurité)**
- "C'est intéressant ! Qu'est-ce qui te fascine particulièrement dans [domaine] ?"
- "Aimerais-tu l'étudier académiquement ou le maîtriser pratiquement ?"
- "Sais-tu déjà quels métiers existent dans [domaine] ?"

**Impact social/environnemental**
- "C'est admirable ! Quel est ton rôle préféré : créer la solution ou l'implémenter ?"
- "Préfères-tu travailler à grande échelle ou avec des communautés locales ?"
- "Veux-tu une structure traditionnelle ou plus flexible (startup, ONG) ?"

**Créativité & Innovation**
- "Aimes-tu aussi prototyper et tester tes idées ?"
- "Travailles-tu mieux avec d'autres créatifs ou préfères-tu ton univers ?"
- "Quel support créatif te plaît ? (code, design, vidéo, autre)"

**Analyse & Optimisation**
- "Quelle type de données ou de systèmes te fascinent ?"
- "Aimes-tu l'approche théorique ou pratique ?"
- "Tu cherches à comprendre 'pourquoi' ou 'comment faire' ?"

**Travail autonome / Entrepreneuriat**
- "Envisages-tu de créer ta propre entreprise ?"
- "Quel style d'organisation te convient ? (flexible, structuré, hybride)"
- "Aimes-tu prendre des risques ou préfères-tu de la stabilité ?"

## Schéma de Questions Adaptatif

```
Questions Goûts Initiales
    ↓
Identifie domaine(s) mentionné(s)
    ↓
Branche 1: Tech/Science
    ├─ Si domaine spécifique → Approfondir
    └─ Si générique → Explorer différentes facettes
    ↓
Branche 2: Impact & Valeurs
    ├─ Si impact social → Questions impact
    ├─ Si impact environnemental → Questions durabilité
    └─ Si profit/innovation → Questions entrepreneuriat
    ↓
Branche 3: Mode de travail
    ├─ Si créatif → Questions création
    ├─ Si analytique → Questions logique
    └─ Si social → Questions collaboration
    ↓
Raffiner secteur d'activité & entreprise idéale
    ↓
Profil complet des goûts professionnels
```

## Données Stockées

```json
{
  "user_id": "unique_id",
  "gouts": {
    "domaines_tech": ["string"],
    "domaines_science": ["string"],
    "themes_transversaux": ["string"],
    "industries_interet": ["string"],
    "type_problemes": ["string"],
    "activites_creatives": ["string"],
    "activites_analytiques": ["string"],
    "activites_sociales": ["string"],
    "activites_autonomes": ["string"],
    "impact_souhaite": "creer|innover|optimiser|aider|decouvrir",
    "causes": ["string"],
    "environnement_prefere": "startup|grande_entreprise|recherche|public|ess",
    "secteurs_attractants": ["string"],
    "type_mission": ["string"],
    "rythme_travail": "stable|varie|challenge_constant",
    "niveau_prise_risque": "prudent|equilibre|aventurier",
    "valeurs_professionnelles": ["string"],
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

## Mapping Goûts → Métiers d'Ingénierie

| Goûts | Métiers Possibles |
|-------|-------------------|
| IA + Impact social | Data Scientist, ML Engineer, IA Ethique |
| Cybersécurité + Autonomie | Security Engineer, Pentester, CISO |
| Espace + Innovation | Aerospace Engineer, Satellite Engineer |
| Environnement + Tech | Clean Tech Engineer, Green Software Engineer |
| Création + Frontend | UX/UI Designer, Frontend Developer |
| Données + Analyse | Data Analyst, Business Intelligence |
| Infrastructure + Système | DevOps, SRE, Architect Infra |
| Jeux vidéo + Code | Game Developer, Graphics Programmer |
