/**
 * Script de gestion de la page de détail d'un devis
 * Implémente les fonctionnalités EF-DETAIL-DEV-001, EF-DETAIL-DEV-002, EF-DETAIL-DEV-003
 */

// === Variables globales ===
let currentQuotation = null;
let quotationId = null;

// === Initialisation ===
document.addEventListener('DOMContentLoaded', function() {
    initializeDetailPage();
});

function initializeDetailPage() {
    // Récupérer l'ID du devis depuis l'URL
    quotationId = getQuotationIdFromURL();
    
    if (!quotationId) {
        showErrorState();
        return;
    }
    
    // Charger le devis
    loadQuotation(quotationId);
    
    // Configurer les événements
    setupEventListeners();
    
    // Simuler le chargement
    setTimeout(() => {
        displayQuotationDetails();
    }, 1000);
}

function getQuotationIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// === Chargement des données ===
function loadQuotation(id) {
    try {
        // Rechercher le devis dans les données de test
        currentQuotation = MockData.SAMPLE_QUOTATIONS.find(q => q.id === id);
        
        if (!currentQuotation) {
            console.error('Devis non trouvé:', id);
            showErrorState();
            return;
        }
        
        console.log('Devis chargé:', currentQuotation);
    } catch (error) {
        console.error('Erreur lors du chargement du devis:', error);
        showErrorState();
    }
}

// === Configuration des événements ===
function setupEventListeners() {
    // Clic en dehors du menu d'actions pour le fermer
    document.addEventListener('click', function(event) {
        const actionsMenu = document.getElementById('actionsMenu');
        const menuButton = event.target.closest('[onclick*="toggleActionsMenu"]');
        
        if (!menuButton && !actionsMenu.contains(event.target)) {
            actionsMenu.classList.add('hidden');
        }
    });
}

// === Affichage du devis ===
function displayQuotationDetails() {
    if (!currentQuotation) {
        showErrorState();
        return;
    }
    
    hideLoadingState();
    
    // Mettre à jour le titre de la page
    updatePageTitle();
    
    // Remplir les sections
    fillGeneralInfo();
    fillChantierInfo();
    fillPrestationsInfo();
    fillMarginAnalysis();
    fillFinancialSummary();
    fillNotesAndConditions();
    
    // Générer les actions contextuelles
    generateContextualActions();
    
    // Afficher le contenu
    document.getElementById('quotationContent').classList.remove('hidden');
}

function updatePageTitle() {
    document.getElementById('devisTitle').textContent = currentQuotation.name;
    document.getElementById('devisSubtitle').textContent = currentQuotation['objet-devis'];
    document.title = `MultiFlex - ${currentQuotation.name}`;
}

function fillGeneralInfo() {
    // Badge de statut
    const statusBadge = document.getElementById('statusBadge');
    statusBadge.textContent = currentQuotation.getStatusLabel();
    statusBadge.className = `px-3 py-1 rounded-full text-sm font-medium ${currentQuotation.getStatusBadgeClass()}`;
    
    // Informations générales
    document.getElementById('quotationNumber').textContent = currentQuotation.name;
    document.getElementById('emissionDate').textContent = 
        DevisModels.DevisCalculator.formatDate(currentQuotation.status['emission-date']);
    document.getElementById('expirationDate').textContent = 
        DevisModels.DevisCalculator.formatDate(currentQuotation.status['expiration-date']) || 'Non définie';
    
    const executionDelay = currentQuotation.planning['estimated-executions'];
    const unit = currentQuotation.planning.unit === 'day' ? 'jours' : currentQuotation.planning.unit;
    document.getElementById('executionDelay').textContent = 
        executionDelay > 0 ? `${executionDelay} ${unit}` : 'Non défini';
    
    document.getElementById('quotationObject').textContent = currentQuotation['objet-devis'];
}

function fillChantierInfo() {
    const chantier = currentQuotation.chantier;
    const proprietaire = chantier.proprietaire;
    
    // Informations du chantier
    document.getElementById('chantierName').textContent = chantier.name;
    document.getElementById('chantierAddress').textContent = chantier.address;
    
    // Informations du client
    document.getElementById('clientName').textContent = proprietaire.name;
    document.getElementById('clientPhone').textContent = proprietaire.phone || '';
    document.getElementById('clientEmail').textContent = proprietaire.email || '';
    
    // Avatar du client (initiales)
    const initials = getClientInitials(proprietaire);
    document.getElementById('clientAvatar').textContent = initials;
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

function fillPrestationsInfo() {
    const prestationsSummary = document.getElementById('prestationsSummary');
    const prestationsDetails = document.getElementById('prestationsDetails');
    
    if (!currentQuotation['quotation-items'] || currentQuotation['quotation-items'].length === 0) {
        prestationsSummary.innerHTML = '<p class="text-textSecondary italic">Aucune prestation définie</p>';
        prestationsDetails.innerHTML = '<p class="text-textSecondary italic">Aucun détail disponible</p>';
        return;
    }
    
    // Résumé des prestations
    const summaryHTML = currentQuotation['quotation-items'].map(item => {
        if (!item['is-active']) return '';
        
        const tasksCount = item.tasks ? item.tasks.length : 0;
        const itemTotal = calculateItemTotal(item);
        
        return `
            <div class="flex justify-between items-center p-3 bg-neutral rounded-lg">
                <div>
                    <h4 class="font-medium text-textPrimary">${item.name}</h4>
                    <p class="text-sm text-textSecondary">${tasksCount} tâche(s)</p>
                </div>
                <div class="text-right">
                    <div class="font-medium text-textPrimary">${DevisModels.DevisCalculator.formatPrice(itemTotal)}</div>
                </div>
            </div>
        `;
    }).filter(html => html).join('');
    
    prestationsSummary.innerHTML = summaryHTML;
    
    // Détails complets des prestations
    const detailsHTML = currentQuotation['quotation-items'].map(item => {
        if (!item['is-active']) return '';
        
        return `
            <div class="border border-border rounded-lg p-4 mb-4">
                <h3 class="text-lg font-medium text-textPrimary mb-3">${item.name}</h3>
                
                ${item.tasks ? item.tasks.map(task => `
                    <div class="ml-4 mb-4 last:mb-0">
                        <h4 class="font-medium text-textPrimary mb-2">${task.name}</h4>
                        
                        <!-- Procédé de main d'œuvre -->
                        <div class="bg-blue-50 rounded-lg p-3 mb-3">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-medium text-blue-800">Main d'œuvre</span>
                                <span class="text-blue-700">${task.superficie} ${task.uom}</span>
                            </div>
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="text-blue-600">Prix unitaire:</span>
                                    <span class="font-medium">${DevisModels.DevisCalculator.formatPrice(task['effective-price'] || task['base-price'])}</span>
                                </div>
                                <div>
                                    <span class="text-blue-600">Total:</span>
                                    <span class="font-medium">${DevisModels.DevisCalculator.formatPrice((task['effective-price'] || task['base-price']) * task.superficie)}</span>
                                </div>
                            </div>
                            ${task['nombre-tacherons'] ? `
                            <div class="mt-2 text-sm text-blue-600">
                                <i class="fas fa-users mr-1"></i>
                                ${task['nombre-tacherons']} tâcheron(s) prévu(s)
                            </div>
                            ` : ''}
                        </div>
                        
                        <!-- Produits liés -->
                        ${task['linked-products'] && task['linked-products'].length > 0 ? `
                        <div class="space-y-2">
                            <h5 class="font-medium text-textSecondary">Produits et matériels</h5>
                            ${task['linked-products'].map(linkedProduct => `
                                <div class="bg-green-50 rounded-lg p-3">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="font-medium text-green-800">${linkedProduct.product.designation}</span>
                                        <span class="text-green-700">${linkedProduct['ordered-quantity']} ${linkedProduct.product.uom.code}</span>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span class="text-green-600">Prix unitaire:</span>
                                            <span class="font-medium">${DevisModels.DevisCalculator.formatPrice(linkedProduct['effective-price'] || linkedProduct['base-price'])}</span>
                                        </div>
                                        <div>
                                            <span class="text-green-600">Total:</span>
                                            <span class="font-medium">${DevisModels.DevisCalculator.formatPrice((linkedProduct['effective-price'] || linkedProduct['base-price']) * linkedProduct['ordered-quantity'])}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        ` : ''}
                    </div>
                `).join('') : ''}
            </div>
        `;
    }).filter(html => html).join('');
    
    prestationsDetails.innerHTML = detailsHTML || '<p class="text-textSecondary italic">Aucun détail disponible</p>';
}

function calculateItemTotal(item) {
    let total = 0;
    
    if (item.tasks) {
        item.tasks.forEach(task => {
            // Main d'œuvre
            total += (task['effective-price'] || task['base-price']) * task.superficie;
            
            // Produits liés
            if (task['linked-products']) {
                task['linked-products'].forEach(linkedProduct => {
                    total += (linkedProduct['effective-price'] || linkedProduct['base-price']) * linkedProduct['ordered-quantity'];
                });
            }
        });
    }
    
    return total;
}

function fillMarginAnalysis() {
    const margin = currentQuotation.calculateTechnicianMargin();
    
    // Résumé de la marge
    document.getElementById('margineBrute').textContent = 
        DevisModels.DevisCalculator.formatPrice(margin.margeBrute);
    document.getElementById('gainNet').textContent = 
        DevisModels.DevisCalculator.formatPrice(margin.gainNet);
    
    // Ajouter une classe warning si marge négative
    const gainNetElement = document.getElementById('gainNet');
    if (margin.gainNet < 0) {
        gainNetElement.parentElement.classList.add('margin-warning');
        gainNetElement.className = 'text-xl font-bold text-error';
    } else {
        gainNetElement.parentElement.classList.remove('margin-warning');
        gainNetElement.className = 'text-xl font-bold text-primary';
    }
    
    // Détails de la marge
    const marginDetails = document.getElementById('marginDetails');
    marginDetails.innerHTML = `
        <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-green-50 rounded-lg p-3">
                    <h4 class="font-medium text-green-800 mb-2">Marge sur Produits</h4>
                    <div class="text-2xl font-bold text-green-700">
                        ${DevisModels.DevisCalculator.formatPrice(margin.marginProduits)}
                    </div>
                    <p class="text-sm text-green-600 mt-1">
                        Prix effectif - Prix technicien
                    </p>
                </div>
                
                <div class="bg-blue-50 rounded-lg p-3">
                    <h4 class="font-medium text-blue-800 mb-2">Marge sur Main d'Œuvre</h4>
                    <div class="text-2xl font-bold text-blue-700">
                        ${DevisModels.DevisCalculator.formatPrice(margin.marginMO)}
                    </div>
                    <p class="text-sm text-blue-600 mt-1">
                        Prix effectif MO - Coût tâcheron
                    </p>
                </div>
            </div>
            
            <div class="border-t border-border pt-4">
                <div class="flex justify-between items-center mb-2">
                    <span class="font-medium text-textPrimary">Marge Brute Totale</span>
                    <span class="text-xl font-bold text-secondary">
                        ${DevisModels.DevisCalculator.formatPrice(margin.margeBrute)}
                    </span>
                </div>
                
                <div class="flex justify-between items-center mb-2">
                    <span class="text-textSecondary">Remise globale appliquée</span>
                    <span class="text-error">
                        -${DevisModels.DevisCalculator.formatPrice(currentQuotation['financial-details']['global-discount'])}
                    </span>
                </div>
                
                <hr class="border-border my-3">
                
                <div class="flex justify-between items-center">
                    <span class="text-lg font-bold text-textPrimary">Gain Net Estimé</span>
                    <span class="text-2xl font-bold ${margin.gainNet >= 0 ? 'text-primary' : 'text-error'}">
                        ${DevisModels.DevisCalculator.formatPrice(margin.gainNet)}
                    </span>
                </div>
                
                ${margin.gainNet < 0 ? `
                <div class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div class="flex items-center text-red-700">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        <span class="font-medium">Attention: Marge négative!</span>
                    </div>
                    <p class="text-sm text-red-600 mt-1">
                        La remise appliquée fait passer la marge en négatif. Considérez une révision du devis.
                    </p>
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

function fillFinancialSummary() {
    const financialDetails = currentQuotation['financial-details'];
    
    document.getElementById('totalHT').textContent = 
        DevisModels.DevisCalculator.formatPrice(financialDetails['total-price-ht']);
    document.getElementById('globalDiscount').textContent = 
        `-${DevisModels.DevisCalculator.formatPrice(financialDetails['global-discount'])}`;
    document.getElementById('finalPrice').textContent = 
        DevisModels.DevisCalculator.formatPrice(financialDetails['final-price']);
    
    // Acompte
    if (financialDetails.deposit && financialDetails.deposit > 0) {
        document.getElementById('depositInfo').classList.remove('hidden');
        document.getElementById('depositAmount').textContent = 
            DevisModels.DevisCalculator.formatPrice(financialDetails.deposit);
    }
}

function fillNotesAndConditions() {
    const notesSection = document.getElementById('notesSection');
    let hasContent = false;
    
    // Garantie
    if (currentQuotation.garantie) {
        document.getElementById('guaranteeInfo').innerHTML = `
            <div>
                <label class="block text-sm font-medium text-textSecondary mb-1">Garantie</label>
                <p class="text-textPrimary">${currentQuotation.garantie}</p>
            </div>
        `;
        hasContent = true;
    }
    
    // Notes
    if (currentQuotation.notes) {
        document.getElementById('notesInfo').innerHTML = `
            <div>
                <label class="block text-sm font-medium text-textSecondary mb-1">Notes</label>
                <p class="text-textPrimary">${currentQuotation.notes}</p>
            </div>
        `;
        hasContent = true;
    }
    
    // Certifications
    if (currentQuotation.certifications && currentQuotation.certifications.length > 0) {
        document.getElementById('certificationsInfo').innerHTML = `
            <div>
                <label class="block text-sm font-medium text-textSecondary mb-1">Certifications</label>
                <div class="flex flex-wrap gap-2">
                    ${currentQuotation.certifications.map(cert => `
                        <span class="px-3 py-1 bg-primary text-white rounded-full text-sm">${cert}</span>
                    `).join('')}
                </div>
            </div>
        `;
        hasContent = true;
    }
    
    if (hasContent) {
        notesSection.classList.remove('hidden');
    }
}

function generateContextualActions() {
    const actionsMenu = document.getElementById('actionsMenu').querySelector('div');
    const floatingActions = document.getElementById('floatingActions');
    
    const actions = [];
    const status = currentQuotation.status.status;
    
    // Actions selon le statut
    if (status === 'DRAFT') {
        actions.push({
            icon: 'fa-edit',
            text: 'Continuer la modification',
            action: 'editQuotation',
            primary: true
        });
        actions.push({
            icon: 'fa-paper-plane',
            text: 'Envoyer au client',
            action: 'sendQuotation'
        });
    } else if (status === 'SENT') {
        actions.push({
            icon: 'fa-check',
            text: 'Marquer comme accepté',
            action: 'markAsAccepted',
            primary: true
        });
        actions.push({
            icon: 'fa-times',
            text: 'Marquer comme refusé',
            action: 'markAsRefused'
        });
        actions.push({
            icon: 'fa-redo',
            text: 'Renvoyer au client',
            action: 'resendQuotation'
        });
    } else if (status === 'ACCEPTED') {
        actions.push({
            icon: 'fa-clipboard-list',
            text: 'Générer bordereau de chantier',
            action: 'generateWorkOrder',
            primary: true
        });
    }
    
    // Actions communes
    actions.push({
        icon: 'fa-copy',
        text: 'Dupliquer le devis',
        action: 'duplicateQuotation'
    });
    actions.push({
        icon: 'fa-download',
        text: 'Télécharger PDF',
        action: 'downloadPDF'
    });
    actions.push({
        icon: 'fa-share',
        text: 'Partager',
        action: 'shareQuotation'
    });
    
    // Générer le menu d'actions
    actionsMenu.innerHTML = actions.map(action => `
        <button onclick="${action.action}()" class="w-full text-left px-4 py-2 text-sm text-textPrimary hover:bg-neutral transition-colors flex items-center">
            <i class="fas ${action.icon} mr-3 w-4"></i>
            ${action.text}
        </button>
    `).join('');
    
    // Générer les actions flottantes (seulement l'action principale)
    const primaryAction = actions.find(a => a.primary);
    if (primaryAction) {
        floatingActions.innerHTML = `
            <button onclick="${primaryAction.action}()" class="bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-primaryDark transition-colors">
                <i class="fas ${primaryAction.icon} text-xl"></i>
            </button>
        `;
        floatingActions.classList.remove('hidden');
    }
}

// === Gestion des sections extensibles ===
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const isCollapsed = section.classList.contains('collapsed');
    
    if (isCollapsed) {
        section.classList.remove('collapsed');
        section.classList.add('expanded');
    } else {
        section.classList.remove('expanded');
        section.classList.add('collapsed');
    }
    
    // Mettre à jour le texte et l'icône du bouton
    const toggleText = document.getElementById(sectionId.replace('Details', 'ToggleText'));
    const toggleIcon = document.getElementById(sectionId.replace('Details', 'ToggleIcon'));
    
    if (toggleText && toggleIcon) {
        if (isCollapsed) {
            toggleText.textContent = 'Masquer détails';
            toggleIcon.className = 'fas fa-chevron-up ml-1';
        } else {
            toggleText.textContent = 'Voir détails';
            toggleIcon.className = 'fas fa-chevron-down ml-1';
        }
    }
}

// === Gestion des états ===
function hideLoadingState() {
    document.getElementById('loadingState').classList.add('hidden');
}

function showErrorState() {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('errorState').classList.remove('hidden');
}

// === Actions contextuelles ===
function toggleActionsMenu() {
    const actionsMenu = document.getElementById('actionsMenu');
    actionsMenu.classList.toggle('hidden');
}

function editQuotation() {
    window.location.href = `create-step1.html?edit=${currentQuotation.id}`;
}

function sendQuotation() {
    if (confirm('Envoyer ce devis au client ?')) {
        // Simulation de l'envoi
        currentQuotation.status.status = 'SENT';
        currentQuotation.status['sent-date'] = new Date().toISOString().split('T')[0];
        
        alert('Devis envoyé avec succès !');
        location.reload();
    }
}

function markAsAccepted() {
    if (confirm('Marquer ce devis comme accepté par le client ?')) {
        currentQuotation.status.status = 'ACCEPTED';
        currentQuotation.status['accepted-date'] = new Date().toISOString().split('T')[0];
        
        alert('Devis marqué comme accepté !');
        location.reload();
    }
}

function markAsRefused() {
    if (confirm('Marquer ce devis comme refusé par le client ?')) {
        currentQuotation.status.status = 'REFUSED';
        
        alert('Devis marqué comme refusé.');
        location.reload();
    }
}

function resendQuotation() {
    alert('Fonctionnalité de renvoi en cours de développement');
}

function generateWorkOrder() {
    alert('Génération du bordereau de chantier en cours de développement');
}

function duplicateQuotation() {
    if (confirm('Créer un nouveau devis basé sur celui-ci ?')) {
        window.location.href = `create-step1.html?duplicate=${currentQuotation.id}`;
    }
}

function downloadPDF() {
    alert('Téléchargement du PDF en cours de développement');
}

function shareQuotation() {
    if (navigator.share) {
        navigator.share({
            title: currentQuotation.name,
            text: currentQuotation['objet-devis'],
            url: window.location.href
        });
    } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API de partage natif
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('Lien copié dans le presse-papiers !');
        });
    }
}

// === Navigation ===
function goBack() {
    if (document.referrer && document.referrer.includes(window.location.origin)) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
}

// === Export pour utilisation globale ===
window.DevisDetail = {
    initializeDetailPage,
    toggleSection,
    toggleActionsMenu,
    editQuotation,
    sendQuotation,
    markAsAccepted,
    markAsRefused,
    duplicateQuotation,
    downloadPDF,
    shareQuotation,
    goBack
}; 