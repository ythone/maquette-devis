/**
 * Script pour l'étape 1 du wizard de création de devis
 * Implémente l'initialisation et le contexte du devis (QuotationInitScreen)
 */

// === Variables globales ===
let formData = {
    chantier: null,
    typeDevis: '',
    finishingLevel: '',
    coveringType: '',
    finishingAspects: [],
    objetDevis: '',
    dateEmission: '',
    dateExpiration: '',
    numeroDevis: '',
    selectedTemplate: null
};

let availableChantiers = [];
let availableTemplates = [];

// === Initialisation ===
document.addEventListener('DOMContentLoaded', function() {
    initializeStep1();
});

function initializeStep1() {
    // Charger les données de base
    loadChantiers();
    loadTemplates();
    
    // Configurer les dates par défaut
    setupDefaultDates();
    
    // Générer le numéro de devis
    generateQuotationNumber();
    
    // Configurer les événements
    setupEventListeners();
    
    // Vérifier si on édite ou duplique un devis existant
    checkEditMode();
    
    console.log('Étape 1 initialisée');
}

function loadChantiers() {
    try {
        availableChantiers = MockData.CHANTIERS_DATA || [];
        console.log('Chantiers chargés:', availableChantiers.length);
    } catch (error) {
        console.error('Erreur lors du chargement des chantiers:', error);
        availableChantiers = [];
    }
}

function loadTemplates() {
    try {
        availableTemplates = MockData.QUOTE_TEMPLATES || [];
        console.log('Modèles chargés:', availableTemplates.length);
    } catch (error) {
        console.error('Erreur lors du chargement des modèles:', error);
        availableTemplates = [];
    }
}

function setupDefaultDates() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 30); // 30 jours par défaut
    
    document.getElementById('dateEmission').value = today.toISOString().split('T')[0];
    document.getElementById('dateExpiration').value = expirationDate.toISOString().split('T')[0];
    
    formData.dateEmission = today.toISOString().split('T')[0];
    formData.dateExpiration = expirationDate.toISOString().split('T')[0];
}

function generateQuotationNumber() {
    // Générer selon la configuration du technicien (simulé)
    const technician = MockData.CURRENT_TECHNICIAN;
    const prefix = "TA-PAUL-";
    const suffix = "-2024";
    const nextNumber = getNextNumber(); // Simuler le prochain numéro
    
    const numeroDevis = `${prefix}${nextNumber}${suffix}`;
    document.getElementById('numeroDevis').value = numeroDevis;
    formData.numeroDevis = numeroDevis;
}

function getNextNumber() {
    // Simuler la récupération du prochain numéro
    const existingQuotations = MockData.SAMPLE_QUOTATIONS || [];
    return existingQuotations.length + 1;
}

function setupEventListeners() {
    // Recherche de chantier
    const chantierSearch = document.getElementById('chantierSearch');
    chantierSearch.addEventListener('input', handleChantierSearch);
    
    // Type de devis
    const typeDevis = document.getElementById('typeDevis');
    typeDevis.addEventListener('change', handleTypeDevisChange);
    
    // Objet du devis
    const objetDevis = document.getElementById('objetDevis');
    objetDevis.addEventListener('input', () => {
        formData.objetDevis = objetDevis.value;
        clearFieldError('objetDevis');
    });
    
    // Dates
    const dateEmission = document.getElementById('dateEmission');
    const dateExpiration = document.getElementById('dateExpiration');
    
    dateEmission.addEventListener('change', () => {
        formData.dateEmission = dateEmission.value;
        clearFieldError('dateEmission');
    });
    
    dateExpiration.addEventListener('change', () => {
        formData.dateExpiration = dateExpiration.value;
        clearFieldError('dateExpiration');
    });
}

function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    const duplicateId = urlParams.get('duplicate');
    
    if (editId) {
        loadExistingQuotation(editId);
    } else if (duplicateId) {
        loadQuotationForDuplication(duplicateId);
    }
}

// === Gestion de la recherche de chantier ===
function handleChantierSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    const resultsContainer = document.getElementById('chantierSearchResults');
    
    if (query.length < 2) {
        resultsContainer.classList.add('hidden');
        return;
    }
    
    const filteredChantiers = availableChantiers.filter(chantier => 
        chantier.name.toLowerCase().includes(query) ||
        chantier.description.toLowerCase().includes(query) ||
        chantier.proprietaire.name.toLowerCase().includes(query) ||
        chantier.address.toLowerCase().includes(query)
    );
    
    displayChantierResults(filteredChantiers);
}

function displayChantierResults(chantiers) {
    const resultsContainer = document.getElementById('chantierSearchResults');
    
    if (chantiers.length === 0) {
        resultsContainer.innerHTML = '<p class="text-textSecondary italic p-3">Aucun chantier trouvé</p>';
        resultsContainer.classList.remove('hidden');
        return;
    }
    
    const resultsHTML = chantiers.map(chantier => `
        <div onclick="selectChantier('${chantier.id}')" 
             class="chantier-card bg-white border border-border rounded-lg p-3 hover:shadow-md transition-shadow">
            <h3 class="font-medium text-textPrimary">${chantier.name}</h3>
            <p class="text-sm text-textSecondary">${chantier.address}</p>
            <div class="flex items-center mt-2 text-sm text-textSecondary">
                <i class="fas fa-user mr-1"></i>
                <span>${chantier.proprietaire.name}</span>
                ${chantier.proprietaire.phone ? `
                <i class="fas fa-phone ml-3 mr-1"></i>
                <span>${chantier.proprietaire.phone}</span>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = resultsHTML;
    resultsContainer.classList.remove('hidden');
}

function selectChantier(chantierId) {
    const chantier = availableChantiers.find(c => c.id === chantierId);
    if (!chantier) return;
    
    formData.chantier = chantier;
    
    // Masquer les résultats de recherche
    document.getElementById('chantierSearchResults').classList.add('hidden');
    document.getElementById('chantierSearch').value = chantier.name;
    
    // Afficher les détails du chantier sélectionné
    displaySelectedChantier(chantier);
    
    // Supprimer l'erreur
    clearFieldError('chantier');
}

function displaySelectedChantier(chantier) {
    const selectedDiv = document.getElementById('selectedChantier');
    const proprietaire = chantier.proprietaire;
    
    // Remplir les informations
    document.getElementById('selectedChantierName').textContent = chantier.name;
    document.getElementById('selectedChantierAddress').textContent = chantier.address;
    document.getElementById('selectedClientName').textContent = proprietaire.name;
    document.getElementById('selectedClientPhone').textContent = proprietaire.phone || '';
    document.getElementById('selectedClientEmail').textContent = proprietaire.email || '';
    
    // Avatar du client
    const initials = getClientInitials(proprietaire);
    document.getElementById('selectedClientAvatar').textContent = initials;
    
    // Avertissement si identification incomplète
    const ownerWarning = document.getElementById('ownerWarning');
    if (chantier['owner-identification-status'] !== 'FULLY_IDENTIFIED') {
        ownerWarning.classList.remove('hidden');
    } else {
        ownerWarning.classList.add('hidden');
    }
    
    selectedDiv.classList.remove('hidden');
}

function getClientInitials(client) {
    if (client.firstName && client.lastName) {
        return (client.firstName.charAt(0) + client.lastName.charAt(0)).toUpperCase();
    } else if (client.name) {
        const words = client.name.split(' ');
        if (words.length >= 2) {
            return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
        } else {
            return client.name.charAt(0).toUpperCase();
        }
    }
    return 'CL';
}

function clearChantierSelection() {
    formData.chantier = null;
    document.getElementById('selectedChantier').classList.add('hidden');
    document.getElementById('chantierSearch').value = '';
    document.getElementById('chantierSearchResults').classList.add('hidden');
}

// === Gestion du type de devis ===
function handleTypeDevisChange(event) {
    const typeDevis = event.target.value;
    formData.typeDevis = typeDevis;
    
    clearFieldError('typeDevis');
    
    // Afficher/masquer les critères spécifiques à la peinture
    const paintingCriteria = document.getElementById('paintingCriteria');
    if (typeDevis === 'Paint') {
        paintingCriteria.classList.remove('hidden');
    } else {
        paintingCriteria.classList.add('hidden');
        // Réinitialiser les critères peinture
        resetPaintingCriteria();
    }
    
    // Rechercher le modèle approprié
    searchForTemplate();
}

function resetPaintingCriteria() {
    formData.finishingLevel = '';
    formData.coveringType = '';
    formData.finishingAspects = [];
    formData.selectedTemplate = null;
    
    // Réinitialiser l'interface
    document.querySelectorAll('[id^="finishing"]').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-white', 'text-textPrimary');
    });
    
    document.querySelectorAll('[id^="covering"]').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-white', 'text-textPrimary');
    });
    
    document.querySelectorAll('.aspect-chip').forEach(chip => {
        chip.classList.remove('selected');
    });
    
    // Masquer les résultats de recherche de modèle
    document.getElementById('templateSearchResult').classList.add('hidden');
    document.getElementById('templateError').classList.add('hidden');
}

// === Gestion des critères de finition ===
function selectFinishingLevel(level) {
    formData.finishingLevel = level;
    
    // Mettre à jour l'interface
    document.querySelectorAll('[id^="finishing"]').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-white', 'text-textPrimary');
    });
    
    const selectedBtn = document.getElementById(`finishing${level}`);
    selectedBtn.classList.remove('bg-white', 'text-textPrimary');
    selectedBtn.classList.add('bg-primary', 'text-white');
    
    clearFieldError('finishingLevel');
    searchForTemplate();
}

function selectCoveringType(type) {
    formData.coveringType = type;
    
    // Mettre à jour l'interface
    document.querySelectorAll('[id^="covering"]').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-white', 'text-textPrimary');
    });
    
    const selectedBtn = document.getElementById(`covering${type.charAt(0) + type.slice(1).toLowerCase()}`);
    selectedBtn.classList.remove('bg-white', 'text-textPrimary');
    selectedBtn.classList.add('bg-primary', 'text-white');
    
    clearFieldError('coveringType');
    searchForTemplate();
}

function toggleFinishingAspect(aspect) {
    // Mapping des aspects vers les IDs des éléments HTML
    const aspectIdMap = {
        'MATE': 'aspectMate',
        'VELOURS': 'aspectVelours', 
        'SATINEE_BRILLANTE': 'aspectSatinee'
    };
    
    const chip = document.getElementById(aspectIdMap[aspect]);
    
    if (!chip) {
        console.error(`Element not found for aspect: ${aspect}`);
        return;
    }
    
    if (formData.finishingAspects.includes(aspect)) {
        // Désélectionner
        formData.finishingAspects = formData.finishingAspects.filter(a => a !== aspect);
        chip.classList.remove('selected');
    } else {
        // Sélectionner
        formData.finishingAspects.push(aspect);
        chip.classList.add('selected');
    }
    
    clearFieldError('finishingAspects');
    searchForTemplate();
}

// === Recherche de modèle ===
function searchForTemplate() {
    if (formData.typeDevis !== 'Paint') {
        // Pour les autres types, pas de recherche de modèle pour l'instant
        return;
    }
    
    if (!formData.finishingLevel || !formData.coveringType || formData.finishingAspects.length === 0) {
        // Critères incomplets
        hideTemplateResults();
        return;
    }
    
    // DEBUG: Afficher les critères sélectionnés
    console.log('=== DEBUG RECHERCHE DE MODÈLE ===');
    console.log('Critères sélectionnés par le technicien:');
    console.log('- Type de devis:', formData.typeDevis);
    console.log('- Niveau de finition:', formData.finishingLevel);
    console.log('- Type de revêtement:', formData.coveringType);
    console.log('- Aspects de finition:', formData.finishingAspects);
    console.log('Nombre de modèles disponibles:', availableTemplates.length);
    
    // Analyser chaque modèle
    console.log('\nAnalyse des modèles disponibles:');
    availableTemplates.forEach((template, index) => {
        const finishingDef = template['finishing-type-definitions'];
        console.log(`\nModèle ${index + 1}: ${template['template-name']}`);
        console.log('- Niveau requis:', finishingDef['finishing-level']);
        console.log('- Type revêtement requis:', finishingDef['covering-type']);
        console.log('- Aspects requis:', finishingDef['finishing-aspect']);
        
        const levelMatch = finishingDef['finishing-level'] === formData.finishingLevel;
        const coveringMatch = finishingDef['covering-type'] === formData.coveringType;
        const aspectsMatch = formData.finishingAspects.every(aspect => 
            finishingDef['finishing-aspect'].includes(aspect)
        );
        
        console.log(`- Match niveau: ${levelMatch}`);
        console.log(`- Match revêtement: ${coveringMatch}`);
        console.log(`- Match aspects: ${aspectsMatch}`);
        console.log(`- Match global: ${levelMatch && coveringMatch && aspectsMatch}`);
    });
    
    // Rechercher le modèle correspondant
    const matchingTemplate = availableTemplates.find(template => {
        const finishingDef = template['finishing-type-definitions'];
        return finishingDef['finishing-level'] === formData.finishingLevel &&
               finishingDef['covering-type'] === formData.coveringType &&
               formData.finishingAspects.every(aspect => 
                   finishingDef['finishing-aspect'].includes(aspect)
               );
    });
    
    if (matchingTemplate) {
        console.log('\n✅ MODÈLE TROUVÉ:', matchingTemplate['template-name']);
        displayTemplateFound(matchingTemplate);
        formData.selectedTemplate = matchingTemplate;
    } else {
        console.log('\n❌ AUCUN MODÈLE CORRESPONDANT TROUVÉ');
        displayTemplateNotFound();
        formData.selectedTemplate = null;
    }
    console.log('=== FIN DEBUG ===\n');
}

function displayTemplateFound(template) {
    const resultDiv = document.getElementById('templateSearchResult');
    const errorDiv = document.getElementById('templateError');
    
    document.getElementById('templateName').textContent = template['template-name'];
    document.getElementById('templateDescription').textContent = template['template-description'];
    
    resultDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');
}

function displayTemplateNotFound() {
    const resultDiv = document.getElementById('templateSearchResult');
    const errorDiv = document.getElementById('templateError');
    
    resultDiv.classList.add('hidden');
    errorDiv.classList.remove('hidden');
}

function hideTemplateResults() {
    document.getElementById('templateSearchResult').classList.add('hidden');
    document.getElementById('templateError').classList.add('hidden');
}

// === Validation ===
function validateStep1() {
    let isValid = true;
    
    // Vérifier le chantier
    if (!formData.chantier) {
        showFieldError('chantier', 'Veuillez sélectionner un chantier');
        isValid = false;
    }
    
    // Vérifier le type de devis
    if (!formData.typeDevis) {
        showFieldError('typeDevis', 'Veuillez sélectionner un type de devis');
        isValid = false;
    }
    
    // Vérifier les critères spécifiques à la peinture
    if (formData.typeDevis === 'Paint') {
        if (!formData.finishingLevel) {
            showFieldError('finishingLevel', 'Veuillez sélectionner un niveau de finition');
            isValid = false;
        }
        
        if (!formData.coveringType) {
            showFieldError('coveringType', 'Veuillez sélectionner un type de revêtement');
            isValid = false;
        }
        
        if (formData.finishingAspects.length === 0) {
            showFieldError('finishingAspects', 'Veuillez sélectionner au moins un aspect de finition');
            isValid = false;
        }
        
        if (!formData.selectedTemplate) {
            // Le modèle est obligatoire pour la peinture
            isValid = false;
        }
    }
    
    // Vérifier l'objet du devis
    if (!formData.objetDevis.trim()) {
        showFieldError('objetDevis', 'Veuillez saisir l\'objet du devis');
        isValid = false;
    }
    
    // Vérifier les dates
    if (!formData.dateEmission) {
        showFieldError('dateEmission', 'Veuillez sélectionner la date d\'émission');
        isValid = false;
    }
    
    if (!formData.dateExpiration) {
        showFieldError('dateExpiration', 'Veuillez sélectionner la date d\'expiration');
        isValid = false;
    }
    
    // Vérifier que la date d'expiration est après la date d'émission
    if (formData.dateEmission && formData.dateExpiration) {
        const emission = new Date(formData.dateEmission);
        const expiration = new Date(formData.dateExpiration);
        
        if (expiration <= emission) {
            showFieldError('dateExpiration', 'La date d\'expiration doit être postérieure à la date d\'émission');
            isValid = false;
        }
    }
    
    return isValid;
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}Error`);
    
    if (field) {
        field.classList.add('field-error');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}Error`);
    
    if (field) {
        field.classList.remove('field-error');
    }
    
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// === Actions ===
function nextStep() {
    // Mettre à jour les données depuis les champs
    updateFormDataFromFields();
    
    // Valider le formulaire
    if (!validateStep1()) {
        return;
    }
    
    // Sauvegarder les données dans le localStorage avec le nom attendu par l'étape 2
    localStorage.setItem('currentQuotation', JSON.stringify(formData));
    localStorage.setItem('wizardStep1Data', JSON.stringify(formData)); // Garder l'ancien pour compatibilité
    
    // Naviguer vers l'étape 2
    window.location.href = 'create-step2.html';
}

function updateFormDataFromFields() {
    formData.objetDevis = document.getElementById('objetDevis').value;
    formData.dateEmission = document.getElementById('dateEmission').value;
    formData.dateExpiration = document.getElementById('dateExpiration').value;
}

function saveDraft() {
    updateFormDataFromFields();
    
    // Créer un devis brouillon
    const quotation = new DevisModels.Quotation({
        name: formData.numeroDevis,
        'quote-template-id': formData.selectedTemplate?.id || '',
        'finishing-type-definition': formData.selectedTemplate ? 
            formData.selectedTemplate['finishing-type-definitions'] : 
            new DevisModels.FinishingTypeDefinition(),
        chantier: formData.chantier || new DevisModels.Chantier(),
        'objet-devis': formData.objetDevis,
        status: new DevisModels.QuoteStatus({
            'emission-date': formData.dateEmission,
            'expiration-date': formData.dateExpiration,
            status: 'DRAFT'
        }),
        createdBy: MockData.CURRENT_TECHNICIAN?.id || 'TECH-001'
    });
    
    console.log('Brouillon sauvegardé:', quotation);
    
    // Simuler la sauvegarde
    alert('Brouillon sauvegardé avec succès !');
}

function loadExistingQuotation(quotationId) {
    // Charger un devis existant pour modification
    const quotation = MockData.SAMPLE_QUOTATIONS.find(q => q.id === quotationId);
    if (!quotation) return;
    
    // Pré-remplir le formulaire
    if (quotation.chantier) {
        selectChantier(quotation.chantier.id);
    }
    
    // TODO: Implémenter le chargement complet des données
    console.log('Mode édition pour:', quotation);
}

function loadQuotationForDuplication(quotationId) {
    // Charger un devis existant pour duplication
    const quotation = MockData.SAMPLE_QUOTATIONS.find(q => q.id === quotationId);
    if (!quotation) return;
    
    // Pré-remplir le formulaire mais générer un nouveau numéro
    generateQuotationNumber();
    
    // TODO: Implémenter la duplication complète
    console.log('Mode duplication pour:', quotation);
}

function goBack() {
    if (confirm('Voulez-vous vraiment quitter ? Les modifications non sauvegardées seront perdues.')) {
        window.location.href = 'index.html';
    }
}

// === Export pour utilisation globale ===
window.WizardStep1 = {
    selectChantier,
    clearChantierSelection,
    selectFinishingLevel,
    selectCoveringType,
    toggleFinishingAspect,
    nextStep,
    saveDraft,
    goBack
}; 