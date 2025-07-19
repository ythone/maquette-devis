/**
 * Script de gestion de la liste des devis
 * Implémente les fonctionnalités EF-LIST-DEV-001, EF-LIST-DEV-002, EF-LIST-DEV-003
 */

// === Variables globales ===
let allQuotations = [];
let filteredQuotations = [];
let activeFilters = {
    search: '',
    status: 'all',
    period: 'all'
};

// === Initialisation ===
document.addEventListener('DOMContentLoaded', function() {
    initializeDevisList();
});

function initializeDevisList() {
    // Charger les données
    loadQuotations();
    
    // Configurer les événements
    setupEventListeners();
    
    // Afficher la liste initiale
    setTimeout(() => {
        hideLoadingState();
        displayQuotations(allQuotations);
    }, 1000); // Simulation du chargement
}

// === Chargement des données ===
function loadQuotations() {
    try {
        // Charger depuis les données de test
        allQuotations = MockData.SAMPLE_QUOTATIONS || [];
        filteredQuotations = [...allQuotations];
        
        console.log('Devis chargés:', allQuotations.length);
    } catch (error) {
        console.error('Erreur lors du chargement des devis:', error);
        showErrorState();
    }
}

// === Configuration des événements ===
function setupEventListeners() {
    // Recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Filtres de période
    const periodFilter = document.getElementById('periodFilter');
    if (periodFilter) {
        periodFilter.addEventListener('change', handlePeriodFilter);
    }
}

// === Gestion de la recherche ===
function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    const isVisible = !searchBar.classList.contains('hidden');
    
    if (isVisible) {
        searchBar.classList.add('hidden');
        clearSearch();
    } else {
        searchBar.classList.remove('hidden');
        document.getElementById('searchInput').focus();
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    activeFilters.search = '';
    applyFilters();
}

function handleSearch(event) {
    activeFilters.search = event.target.value.toLowerCase().trim();
    applyFilters();
}

// === Gestion des filtres ===
function toggleFilters() {
    const filtersPanel = document.getElementById('filtersPanel');
    const isVisible = filtersPanel.classList.contains('show');
    
    if (isVisible) {
        filtersPanel.classList.remove('show');
    } else {
        filtersPanel.classList.add('show');
    }
}

function toggleStatusFilter(status) {
    // Mettre à jour l'interface
    document.querySelectorAll('.status-filter').forEach(btn => {
        btn.classList.remove('active', 'bg-primary', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-700');
    });
    
    event.target.classList.remove('bg-gray-100', 'text-gray-700');
    event.target.classList.add('active', 'bg-primary', 'text-white');
    
    // Mettre à jour le filtre
    activeFilters.status = status;
}

function handlePeriodFilter(event) {
    activeFilters.period = event.target.value;
}

function applyFilters() {
    filteredQuotations = allQuotations.filter(quotation => {
        // Filtre de recherche
        if (activeFilters.search) {
            const searchText = activeFilters.search;
            const matchesSearch = 
                quotation.name.toLowerCase().includes(searchText) ||
                quotation['objet-devis'].toLowerCase().includes(searchText) ||
                quotation.chantier.name.toLowerCase().includes(searchText) ||
                quotation.chantier.proprietaire.name.toLowerCase().includes(searchText);
            
            if (!matchesSearch) return false;
        }
        
        // Filtre de statut
        if (activeFilters.status !== 'all') {
            if (quotation.status.status !== activeFilters.status) return false;
        }
        
        // Filtre de période
        if (activeFilters.period !== 'all') {
            const emissionDate = new Date(quotation.status['emission-date']);
            const now = new Date();
            let daysDiff;
            
            switch (activeFilters.period) {
                case '7days':
                    daysDiff = 7;
                    break;
                case '30days':
                    daysDiff = 30;
                    break;
                case '3months':
                    daysDiff = 90;
                    break;
                default:
                    return true;
            }
            
            const diffTime = Math.abs(now - emissionDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > daysDiff) return false;
        }
        
        return true;
    });
    
    displayQuotations(filteredQuotations);
    updateActiveFiltersDisplay();
}

function resetFilters() {
    // Réinitialiser les filtres
    activeFilters = {
        search: '',
        status: 'all', 
        period: 'all'
    };
    
    // Réinitialiser l'interface
    document.getElementById('searchInput').value = '';
    document.getElementById('periodFilter').value = 'all';
    
    // Réinitialiser les boutons de statut
    document.querySelectorAll('.status-filter').forEach(btn => {
        btn.classList.remove('active', 'bg-primary', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-700');
    });
    document.querySelector('.status-filter[onclick*="all"]').classList.add('active', 'bg-primary', 'text-white');
    document.querySelector('.status-filter[onclick*="all"]').classList.remove('bg-gray-100', 'text-gray-700');
    
    // Appliquer les filtres réinitialisés
    applyFilters();
    
    // Fermer le panneau de filtres
    document.getElementById('filtersPanel').classList.remove('show');
}

function updateActiveFiltersDisplay() {
    const activeFiltersDiv = document.getElementById('activeFilters');
    const filtersContainer = activeFiltersDiv.querySelector('div');
    
    // Effacer les filtres existants
    filtersContainer.innerHTML = '';
    
    let hasActiveFilters = false;
    
    // Filtre de recherche
    if (activeFilters.search) {
        hasActiveFilters = true;
        const badge = createFilterBadge(`Recherche: "${activeFilters.search}"`, 'search');
        filtersContainer.appendChild(badge);
    }
    
    // Filtre de statut
    if (activeFilters.status !== 'all') {
        hasActiveFilters = true;
        const statusLabels = {
            'DRAFT': 'Brouillon',
            'SENT': 'Envoyé',
            'ACCEPTED': 'Accepté',
            'REFUSED': 'Refusé',
            'PENDING_VALIDATION': 'En attente'
        };
        const badge = createFilterBadge(`Statut: ${statusLabels[activeFilters.status]}`, 'status');
        filtersContainer.appendChild(badge);
    }
    
    // Filtre de période
    if (activeFilters.period !== 'all') {
        hasActiveFilters = true;
        const periodLabels = {
            '7days': '7 derniers jours',
            '30days': '30 derniers jours',
            '3months': '3 derniers mois'
        };
        const badge = createFilterBadge(`Période: ${periodLabels[activeFilters.period]}`, 'period');
        filtersContainer.appendChild(badge);
    }
    
    // Afficher/masquer la section des filtres actifs
    if (hasActiveFilters) {
        activeFiltersDiv.classList.remove('hidden');
    } else {
        activeFiltersDiv.classList.add('hidden');
    }
}

function createFilterBadge(text, filterType) {
    const badge = document.createElement('span');
    badge.className = 'inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary text-white';
    badge.innerHTML = `
        ${text}
        <button onclick="removeFilter('${filterType}')" class="ml-2 hover:bg-primaryDark rounded-full p-1">
            <i class="fas fa-times text-xs"></i>
        </button>
    `;
    return badge;
}

function removeFilter(filterType) {
    switch (filterType) {
        case 'search':
            activeFilters.search = '';
            document.getElementById('searchInput').value = '';
            break;
        case 'status':
            activeFilters.status = 'all';
            // Réinitialiser les boutons de statut
            document.querySelectorAll('.status-filter').forEach(btn => {
                btn.classList.remove('active', 'bg-primary', 'text-white');
                btn.classList.add('bg-gray-100', 'text-gray-700');
            });
            document.querySelector('.status-filter[onclick*="all"]').classList.add('active', 'bg-primary', 'text-white');
            document.querySelector('.status-filter[onclick*="all"]').classList.remove('bg-gray-100', 'text-gray-700');
            break;
        case 'period':
            activeFilters.period = 'all';
            document.getElementById('periodFilter').value = 'all';
            break;
    }
    applyFilters();
}

// === Affichage des devis ===
function displayQuotations(quotations) {
    const devisList = document.getElementById('devisList');
    const emptyState = document.getElementById('emptyState');
    
    if (quotations.length === 0) {
        devisList.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    devisList.classList.remove('hidden');
    
    // Générer les cartes de devis
    devisList.innerHTML = quotations.map(quotation => createQuotationCard(quotation)).join('');
}

function createQuotationCard(quotation) {
    const margin = quotation.calculateTechnicianMargin();
    const finalPrice = DevisModels.DevisCalculator.formatPrice(quotation['financial-details']['final-price']);
    const emissionDate = DevisModels.DevisCalculator.formatDate(quotation.status['emission-date']);
    const expirationDate = DevisModels.DevisCalculator.formatDate(quotation.status['expiration-date']);
    
    return `
        <div onclick="viewQuotationDetail('${quotation.id}')" 
             class="bg-white rounded-lg shadow-sm border border-border p-4 cursor-pointer hover:shadow-md transition-shadow">
            
            <!-- En-tête de la carte -->
            <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                        <h3 class="font-medium text-textPrimary">${quotation.name}</h3>
                        <span class="px-2 py-1 rounded-full text-xs font-medium ${quotation.getStatusBadgeClass()}">
                            ${quotation.getStatusLabel()}
                        </span>
                    </div>
                    <p class="text-sm text-textSecondary">${quotation['objet-devis']}</p>
                </div>
                <i class="fas fa-chevron-right text-textSecondary"></i>
            </div>
            
            <!-- Informations client/chantier -->
            <div class="space-y-2 mb-3">
                <div class="flex items-center text-sm text-textSecondary">
                    <i class="fas fa-map-marker-alt mr-2 w-4"></i>
                    <span>${quotation.chantier.name}</span>
                </div>
                <div class="flex items-center text-sm text-textSecondary">
                    <i class="fas fa-user mr-2 w-4"></i>
                    <span>${quotation.chantier.proprietaire.name}</span>
                </div>
                ${quotation.chantier.proprietaire.phone ? `
                <div class="flex items-center text-sm text-textSecondary">
                    <i class="fas fa-phone mr-2 w-4"></i>
                    <span>${quotation.chantier.proprietaire.phone}</span>
                </div>
                ` : ''}
            </div>
            
            <!-- Informations financières et délais -->
            <div class="flex items-center justify-between pt-3 border-t border-border">
                <div class="text-left">
                    <div class="text-lg font-bold text-textPrimary">${finalPrice}</div>
                    <div class="text-xs text-textSecondary">
                        ${quotation.planning['estimated-executions'] > 0 ? 
                            `${quotation.planning['estimated-executions']} ${quotation.planning.unit === 'day' ? 'jours' : quotation.planning.unit}` : 
                            'Délai non défini'
                        }
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-sm text-textSecondary">Émis le ${emissionDate}</div>
                    ${expirationDate ? `<div class="text-xs text-textSecondary">Expire le ${expirationDate}</div>` : ''}
                </div>
            </div>
            
            <!-- Marge technicien (affichage conditionnel) -->
            ${margin.gainNet > 0 ? `
            <div class="mt-2 pt-2 border-t border-border">
                <div class="flex items-center justify-between text-xs">
                    <span class="text-textSecondary">Gain estimé:</span>
                    <span class="font-medium text-secondary">${DevisModels.DevisCalculator.formatPrice(margin.gainNet)}</span>
                </div>
            </div>
            ` : ''}
        </div>
    `;
}

// === Gestion des états ===
function hideLoadingState() {
    const loadingState = document.getElementById('loadingState');
    loadingState.classList.add('hidden');
}

function showErrorState() {
    const loadingState = document.getElementById('loadingState');
    const devisList = document.getElementById('devisList');
    
    loadingState.classList.add('hidden');
    devisList.innerHTML = `
        <div class="text-center py-12">
            <i class="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
            <h3 class="text-lg font-medium text-textPrimary mb-2">Erreur de chargement</h3>
            <p class="text-textSecondary mb-6">Impossible de charger les devis</p>
            <button onclick="location.reload()" class="bg-primary text-white px-6 py-3 rounded-lg font-medium">
                <i class="fas fa-redo mr-2"></i>
                Réessayer
            </button>
        </div>
    `;
}

// === Actions ===
function viewQuotationDetail(quotationId) {
    // Navigation vers la page de détail du devis
    window.location.href = `detail.html?id=${quotationId}`;
}

function createNewQuotation() {
    // Navigation vers le wizard de création
    window.location.href = `create-step1.html`;
}

// === Utilitaires ===
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// === Menu drawer (pour mobile) ===
function toggleDrawer() {
    // Implémentation du menu latéral si nécessaire
    console.log('Toggle drawer');
}

// === Export pour utilisation globale ===
window.DevisList = {
    initializeDevisList,
    viewQuotationDetail,
    createNewQuotation,
    toggleSearch,
    toggleFilters,
    toggleStatusFilter,
    applyFilters,
    resetFilters
}; 