/**
 * Simple in-memory user profile storage
 * En production, remplacer par une vraie base de données (MongoDB, PostgreSQL, etc.)
 */

const userProfiles = new Map();

// Generate a simple user ID (en prod, utiliser UUID)
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Initialize a new user profile
function initializeProfile(userId) {
    return {
        user_id: userId,
        profil: {
            prenom: null,
            age: null,
            niveau_etudes: null,
            localisation: null,
            situation: null,
            description_personnelle: null,
            experiences: [],
            moments_engages: [],
            style_travail: null,
            style_apprentissage: null,
            iad_profile: {
                I: null, // introvert|extravert|equilibre
                A: null, // analyste|creativ|equilibre
                G: null  // generaliste|specialiste|equilibre
            },
            points_forts: [],
            defis: [],
            interests_domaines: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        gouts: {
            domaines_tech: [],
            domaines_science: [],
            themes_transversaux: [],
            industries_interet: [],
            type_problemes: [],
            activites_creatives: [],
            activites_analytiques: [],
            activites_sociales: [],
            activites_autonomes: [],
            impact_souhaite: null,
            causes: [],
            environnement_prefere: null,
            secteurs_attractants: [],
            type_mission: [],
            rythme_travail: null,
            niveau_prise_risque: null,
            valeurs_professionnelles: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        capacites: {
            competences_techniques: [],
            competences_transversales: [],
            langages_programmes: [],
            outils_maitris: [],
            projets_realises: [],
            certifications: [],
            niveau_experience: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        conversation_history: {
            profil: [],
            gouts: [],
            capacites: [],
            personality: []
        }
    };
}

// Create or get user profile
function createOrGetProfile(userId) {
    if (!userProfiles.has(userId)) {
        const profile = initializeProfile(userId);
        userProfiles.set(userId, profile);
    }
    return userProfiles.get(userId);
}

// Update user profile field
function updateProfileField(userId, section, field, value) {
    const profile = createOrGetProfile(userId);
    if (profile[section] && field) {
        profile[section][field] = value;
        profile[section].updated_at = new Date().toISOString();
    }
    return profile;
}

// Add to conversation history
function addToConversationHistory(userId, section, role, content) {
    const profile = createOrGetProfile(userId);
    if (!profile.conversation_history[section]) {
        profile.conversation_history[section] = [];
    }
    profile.conversation_history[section].push({
        role: role,
        content: content,
        timestamp: new Date().toISOString()
    });
    return profile;
}

// Get conversation history for a section
function getConversationHistory(userId, section) {
    const profile = createOrGetProfile(userId);
    return profile.conversation_history[section] || [];
}

// Extract and store key information from conversation
function extractAndStore(userId, section, conversationHistory, aiAnalysis) {
    const profile = createOrGetProfile(userId);
    
    // Parse AI analysis to extract structured data
    // This is a placeholder - en prod, faire une vraie extraction avec NLP ou autre
    // Pour l'exemple, on pourrait faire une deuxième requête OpenAI pour extraire les infos
    
    profile[section].updated_at = new Date().toISOString();
    return profile;
}

// Get full user profile
function getUserProfile(userId) {
    return createOrGetProfile(userId);
}

// Export all profiles (for debugging/export)
function getAllProfiles() {
    const profiles = {};
    userProfiles.forEach((value, key) => {
        profiles[key] = value;
    });
    return profiles;
}

module.exports = {
    generateUserId,
    initializeProfile,
    createOrGetProfile,
    updateProfileField,
    addToConversationHistory,
    getConversationHistory,
    extractAndStore,
    getUserProfile,
    getAllProfiles
};
