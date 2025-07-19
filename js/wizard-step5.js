// ===============================================
// WIZARD STEP 5: Prévisualisation et Envoi
// ===============================================

// Données Mock des Techniciens (à remplacer par des données réelles en production)
const mockTechnicians = [
    {
        id: 1,
        name: "Paul MBARGA",
        type: "AMBASSADEUR",
        grade: "N2",
        quotationPrefix: "AMB-PAUL-",
        quotationSuffix: "-2024",
        nextQuotationNumber: 1,
        company: "BES SARL",
        phone: "+237 6 XX XX XX XX",
        email: "paul.mbarga@multiflex.cm"
    },
    {
        id: 2,
        name: "Marie NKOMO",
        type: "CERTIFIÉ",
        quotationPrefix: "CERT-MARIE-",
        quotationSuffix: "-2024", 
        nextQuotationNumber: 1,
        company: "BES SARL",
        phone: "+237 6 YY YY YY YY",
        email: "marie.nkomo@multiflex.cm"
    },
    {
        id: 3,
        name: "Jean FOUDA",
        type: "SIMPLE",
        quotationPrefix: "SIMP-JEAN-",
        quotationSuffix: "-2024",
        nextQuotationNumber: 1,
        company: "BES SARL", 
        phone: "+237 6 ZZ ZZ ZZ ZZ",
        email: "jean.fouda@multiflex.cm"
    }
];

class WizardStep5Manager {
    constructor() {
        this.currentQuotation = null;
        this.zoomLevel = 1.0;
        this.requiresValidation = false;
        this.validationReasons = [];
        
        this.init();
    }

    init() {
        try {
            this.loadQuotationData();
            
            // Ne continuer que si les données sont chargées
            if (!this.currentQuotation) {
                console.error('Impossible de continuer sans données de devis');
                return;
            }
            
            this.checkValidationRequirements();
            this.renderInterface();
            this.generatePDFPreview();
            
            console.log('✅ Initialisation de l\'étape 5 terminée avec succès');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation de l\'étape 5:', error);
            this.handleError(error, 'initialisation');
            
            // Essayer de rediriger vers l'étape précédente en cas d'erreur critique
            if (!this.currentQuotation) {
                alert('Erreur critique lors du chargement. Retour à l\'étape précédente.');
                window.location.href = 'create-step4.html';
            }
        }
    }

    loadQuotationData() {
        const savedData = localStorage.getItem('currentQuotation');
        if (!savedData) {
            console.error('Aucune donnée de devis trouvée');
            alert('Erreur: Aucune donnée de devis. Retour à l\'étape précédente.');
            window.location.href = 'create-step4.html';
            return;
        }

        try {
            this.currentQuotation = JSON.parse(savedData);
            console.log('Données chargées pour étape 5:', this.currentQuotation);
            
            // Valider la structure des données
            if (!this.validateQuotationData()) {
                console.error('Structure de données invalide');
                alert('Erreur: Données de devis incomplètes. Retour à l\'étape précédente.');
                window.location.href = 'create-step4.html';
                return;
            }
            
        } catch (error) {
            console.error('Erreur lors du parsing des données:', error);
            alert('Erreur: Données de devis corrompues. Retour à l\'étape précédente.');
            window.location.href = 'create-step4.html';
            return;
        }

        // Finaliser le numéro de devis si pas encore fait
        if (!this.currentQuotation.name || this.currentQuotation.name.startsWith('TEMP_')) {
            this.generateQuotationNumber();
        }

        // Mettre à jour les dates
        if (!this.currentQuotation.status) {
            this.currentQuotation.status = new QuoteStatus();
        }
        this.currentQuotation.status["emission-date"] = new Date().toISOString().split('T')[0];
        
        // Calculer date d'expiration (30 jours par défaut)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        this.currentQuotation.status["expiration-date"] = expirationDate.toISOString().split('T')[0];
        
        // Diagnostiquer la structure des données
        this.diagnosticQuotationData();
    }

    /**
     * Valide la structure des données du devis pour l'étape 5
     */
    validateQuotationData() {
        if (!this.currentQuotation) {
            console.error('Devis null ou undefined');
            return false;
        }

        // Vérifier les données essentielles pour la génération PDF
        const financialDetails = this.currentQuotation.financialDetails || this.currentQuotation['financial-details'];
        const planning = this.currentQuotation.planning;
        const items = this.currentQuotation.items || this.currentQuotation['quotation-items'];

        if (!financialDetails) {
            console.error('Données financières manquantes (financialDetails ou financial-details)');
                return false;
            }

        if (!planning) {
            console.error('Données de planning manquantes');
            return false;
        }

        // Vérifier les données client (stockées sous chantier.proprietaire)
        if (!this.currentQuotation.chantier || !this.currentQuotation.chantier.proprietaire) {
            console.error('Données client manquantes (chantier.proprietaire)');
            return false;
        }

        const client = this.currentQuotation.chantier.proprietaire;
        if (!client.name) {
            console.error('Nom du client manquant');
            return false;
        }

        // Vérifier que les items ont des données (optionnel pour MVP)
        if (items && Array.isArray(items) && items.length === 0) {
            console.warn('Aucun item dans le devis - continuera avec devis vide');
        }

        // Vérifier les données financières (déjà récupérées plus haut)
        if (!financialDetails["total-price-ht"] && !financialDetails["final-price"]) {
            console.error('Données financières manquantes');
            return false;
        }

        return true;
    }

    /**
     * Diagnostic détaillé des données du devis pour l'étape 5
     */
    diagnosticQuotationData() {
        console.group('🔍 Diagnostic des données du devis - Étape 5');
        
        console.log('Structure générale:', {
            hasClient: !!(this.currentQuotation.chantier && this.currentQuotation.chantier.proprietaire),
            hasItems: !!this.currentQuotation.items,
            itemsCount: this.currentQuotation.items?.length || 0,
            hasFinancialDetails: !!this.currentQuotation.financialDetails,
            hasPlanning: !!this.currentQuotation.planning,
            quotationName: this.currentQuotation.name
        });

        if (this.currentQuotation.chantier && this.currentQuotation.chantier.proprietaire) {
            console.log('Données client:', {
                name: this.currentQuotation.chantier.proprietaire.name,
                phone: this.currentQuotation.chantier.proprietaire.phone,
                hasAddress: !!this.currentQuotation.chantier.proprietaire.address
            });
        }

        if (this.currentQuotation.financialDetails) {
            console.log('Données financières:', {
                totalHT: this.currentQuotation.financialDetails["total-price-ht"],
                finalPrice: this.currentQuotation.financialDetails["final-price"],
                discount: this.currentQuotation.financialDetails["global-discount"]
            });
        }
        
        console.groupEnd();
    }

    generateQuotationNumber() {
        // Logique de génération du numéro basée sur le profil technicien
        const currentTechnician = mockTechnicians[0]; // Paul MBARGA
        const prefix = currentTechnician.quotationPrefix || 'AMB-PAUL-';
        const suffix = currentTechnician.quotationSuffix || '-2024';
        const nextNumber = currentTechnician.nextQuotationNumber || 1;
        
        this.currentQuotation.name = `${prefix}${String(nextNumber).padStart(3, '0')}${suffix}`;
        
        // Incrémenter pour le prochain devis (en production, ceci serait fait côté serveur)
        currentTechnician.nextQuotationNumber = nextNumber + 1;
    }

    checkValidationRequirements() {
        this.requiresValidation = false;
        this.validationReasons = [];
        
        const financialDetails = this.currentQuotation.financialDetails || this.currentQuotation['financial-details'];
        const totalAmount = financialDetails["final-price"] || 0;
        const discountAmount = financialDetails["global-discount"] || 0;
        const discountPercentage = totalAmount > 0 ? (discountAmount / (totalAmount + discountAmount)) * 100 : 0;
        
        // Règles de validation configurables
        const validationRules = {
            maxAmountWithoutValidation: 500000, // 500 000 FCFA
            maxDiscountPercentage: 15, // 15%
            maxDiscountAmount: 75000 // 75 000 FCFA
        };
        
        // Vérifier montant total
        if (totalAmount > validationRules.maxAmountWithoutValidation) {
            this.requiresValidation = true;
            this.validationReasons.push(`Montant supérieur à ${this.formatPrice(validationRules.maxAmountWithoutValidation)}`);
        }
        
        // Vérifier remise en pourcentage
        if (discountPercentage > validationRules.maxDiscountPercentage) {
            this.requiresValidation = true;
            this.validationReasons.push(`Remise supérieure à ${validationRules.maxDiscountPercentage}% (${discountPercentage.toFixed(1)}%)`);
        }
        
        // Vérifier remise en montant
        if (discountAmount > validationRules.maxDiscountAmount) {
            this.requiresValidation = true;
            this.validationReasons.push(`Remise supérieure à ${this.formatPrice(validationRules.maxDiscountAmount)}`);
        }
        
        console.log('Validation requise:', this.requiresValidation, 'Raisons:', this.validationReasons);
    }

    renderInterface() {
        this.updateQuotationStatus();
        this.updateSummary();
        this.updateActionButtons();
        this.updateValidationInfo();
    }

    updateQuotationStatus() {
        const statusElement = document.getElementById('quotationStatus');
        const currentStatus = this.currentQuotation.status.status || 'DRAFT';
        
        const statusConfig = {
            'DRAFT': { text: 'Brouillon', class: 'bg-gray-100 text-gray-700' },
            'PENDING_VALIDATION': { text: 'En attente de validation', class: 'bg-warning text-white' },
            'VALIDATED': { text: 'Validé', class: 'bg-success text-white' },
            'SENT': { text: 'Envoyé', class: 'bg-primary text-white' },
            'ACCEPTED': { text: 'Accepté', class: 'bg-success text-white' },
            'REFUSED': { text: 'Refusé', class: 'bg-danger text-white' }
        };
        
        const config = statusConfig[currentStatus] || statusConfig['DRAFT'];
        statusElement.textContent = config.text;
        statusElement.className = `px-3 py-1 rounded-full text-sm font-medium ${config.class}`;
    }

    updateSummary() {
        const quotation = this.currentQuotation;
        
        document.getElementById('quotationNumber').textContent = quotation.name || '-';
        document.getElementById('clientName').textContent = quotation.chantier?.proprietaire?.name || '-';
        document.getElementById('siteName').textContent = quotation.chantier?.name || '-';
        document.getElementById('quotationType').textContent = quotation.technicalCriteria?.typeDevis || '-';
        const financialDetails = quotation.financialDetails || quotation['financial-details'];
        const planning = quotation.planning;
        
        document.getElementById('totalAmount').textContent = this.formatPrice(financialDetails?.["final-price"] || 0);
        document.getElementById('deliveryTime').textContent = `${planning?.["estimated-lead-time-days"] || planning?.["estimated-executions"] || 0} jours`;
    }

    updateActionButtons() {
        const primaryActionBtn = document.getElementById('primaryAction');
        const primaryActionText = document.getElementById('primaryActionText');
        const bottomPrimaryActionText = document.getElementById('bottomPrimaryActionText');
        
        let actionText = '';
        let actionClass = 'w-full py-4 px-6 rounded-lg font-bold text-lg';
        
        if (this.requiresValidation) {
            actionText = 'Soumettre pour Validation';
            actionClass += ' bg-warning text-white';
        } else {
            actionText = 'Générer et Envoyer';
            actionClass += ' bg-primary text-white';
        }
        
        primaryActionText.textContent = actionText;
        bottomPrimaryActionText.textContent = actionText;
        primaryActionBtn.className = actionClass;
    }

    updateValidationInfo() {
        const validationInfo = document.getElementById('validationInfo');
        
        if (this.requiresValidation) {
            validationInfo.innerHTML = `
                <div class="bg-warning text-white p-3 rounded-lg">
                    <div class="flex items-center mb-2">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        <span class="font-medium">Validation Managériale Requise</span>
                    </div>
                    <div class="text-sm opacity-90">
                        Ce devis doit être approuvé par votre responsable avant envoi.
                    </div>
                </div>
                <div class="text-sm text-gray-600">
                    <div class="font-medium mb-1">Raisons :</div>
                    <ul class="list-disc list-inside space-y-1">
                        ${this.validationReasons.map(reason => `<li>${reason}</li>`).join('')}
                    </ul>
                </div>
            `;
        } else {
            validationInfo.innerHTML = `
                <div class="bg-success text-white p-3 rounded-lg">
                    <div class="flex items-center">
                        <i class="fas fa-check-circle mr-2"></i>
                        <span class="font-medium">Prêt pour Envoi Direct</span>
                    </div>
                    <div class="text-sm opacity-90 mt-1">
                        Ce devis peut être envoyé directement au client.
                    </div>
                </div>
            `;
        }
    }

    generatePDFPreview() {
        const preview = document.getElementById('pdfPreview');
        const quotation = this.currentQuotation;
        
        preview.innerHTML = `
            <!-- En-tête -->
            <div class="pdf-header flex justify-between items-start mb-6 pb-4">
                <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                        ${this.getInitials(quotation.technicianInfo?.name || 'Technicien')}
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold text-primary">DEVIS</h1>
                        <p class="text-lg font-semibold">${quotation.name}</p>
                        <p class="text-sm text-gray-600">
                            ${quotation.technicianInfo?.name || 'ETS BATI PRO SERVICES'}
                        </p>
                    </div>
                </div>
                <div class="text-right text-sm">
                    <p><strong>Date d'émission :</strong> ${this.formatDate(quotation.status["emission-date"])}</p>
                    <p><strong>Valable jusqu'au :</strong> ${this.formatDate(quotation.status["expiration-date"])}</p>
                    <p><strong>Délai d'exécution :</strong> ${quotation.planning?.["estimated-lead-time-days"] || 0} jours ouvrés</p>
                </div>
            </div>

            <!-- Informations Client -->
            <div class="pdf-section mb-6">
                <h2 class="text-lg font-bold text-primary border-b border-primary pb-2 mb-3">CLIENT</h2>
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <p><strong>Nom :</strong> ${quotation.chantier?.proprietaire?.name || '-'}</p>
                        <p><strong>Téléphone :</strong> ${quotation.chantier?.proprietaire?.phone || '-'}</p>
                        <p><strong>Email :</strong> ${quotation.chantier?.proprietaire?.email || '-'}</p>
                    </div>
                    <div>
                        <p><strong>Chantier :</strong> ${quotation.chantier?.name || '-'}</p>
                        <p><strong>Adresse :</strong> ${quotation.chantier?.address || '-'}</p>
                    </div>
                </div>
            </div>

            <!-- Détail des Prestations -->
            <div class="pdf-section mb-6">
                <h2 class="text-lg font-bold text-primary border-b border-primary pb-2 mb-3">PRESTATIONS</h2>
                ${this.generateServicesTable()}
            </div>

            <!-- Récapitulatif Financier -->
            <div class="pdf-section mb-6">
                <h2 class="text-lg font-bold text-primary border-b border-primary pb-2 mb-3">RÉCAPITULATIF FINANCIER</h2>
                ${this.generateFinancialSummary()}
            </div>

            <!-- Conditions -->
            ${this.generateConditionsSection()}

            <!-- Certifications -->
            ${this.generateCertificationsSection()}

            <!-- Médias -->
            ${this.generateMediaSection()}

            <!-- Signature -->
            <div class="pdf-section mt-8 pt-4 border-t-2 border-primary">
                <div class="grid grid-cols-2 gap-8">
                    <div class="text-center">
                        <p class="font-bold">Le Client</p>
                        <p class="text-sm text-gray-600 mt-1">(Bon pour accord, précédé de la mention "Lu et approuvé")</p>
                        <div class="h-16 border-b border-gray-300 mt-4"></div>
                        <p class="text-sm mt-2">Date et Signature</p>
                    </div>
                    <div class="text-center">
                        <p class="font-bold">${quotation.technicianInfo?.name || 'Le Technicien'}</p>
                        <p class="text-sm text-gray-600 mt-1">Technicien Ambassadeur Multiflex</p>
                        <div class="h-16 border-b border-gray-300 mt-4"></div>
                        <p class="text-sm mt-2">Date et Signature</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Extrait les tâches de la structure hiérarchique créée à l'étape 2
     * et les convertit en structure plate pour l'affichage
     */
    extractTasksFromHierarchy(items) {
        if (!Array.isArray(items)) return [];
        
        console.log('🔧 Extraction des tâches depuis la hiérarchie:', items.length, 'items');
        
        return items.map((item, itemIndex) => {
            const extractedItem = {
                name: item.name,
                "is-active": item["is-active"],
                "is-mandatory": item["is-mandatory"],
                tasks: []
            };
            
            // Extraire les tâches de la hiérarchie
            if (item.hierarchy && Array.isArray(item.hierarchy)) {
                extractedItem.tasks = this.extractTasksFromNodes(item.hierarchy);
                console.log(`  Item ${itemIndex + 1} "${item.name}": ${extractedItem.tasks.length} tâches extraites`);
            } else if (item.tasks && Array.isArray(item.tasks)) {
                // Structure déjà plate (rétrocompatibilité)
                extractedItem.tasks = item.tasks;
                console.log(`  Item ${itemIndex + 1} "${item.name}": structure déjà plate avec ${item.tasks.length} tâches`);
            } else {
                console.warn(`  Item ${itemIndex + 1} "${item.name}": aucune tâche trouvée`);
            }
            
            return extractedItem;
        });
    }
    
    /**
     * Extrait récursivement les tâches des nœuds de la hiérarchie
     */
    extractTasksFromNodes(nodes) {
        if (!Array.isArray(nodes)) return [];
        
        let tasks = [];
        
        nodes.forEach(node => {
            if (node.isLeaf && node.task && node["is-active"] !== false) {
                // C'est une tâche feuille active
                const task = {
                    ...node.task,
                    "is-active": node["is-active"],
                    "is-mandatory": node["is-mandatory"]
                };
                tasks.push(task);
            } else if (node.children && Array.isArray(node.children)) {
                // Continuer la récursion dans les enfants
                tasks = tasks.concat(this.extractTasksFromNodes(node.children));
            }
        });
        
        return tasks;
    }

    generateServicesTable() {
        // Récupérer les items depuis les différentes sources possibles
        let rawItems = this.currentQuotation.items || this.currentQuotation['quotation-items'] || [];
        
        console.log('🔍 Génération table services:', {
            hasRawItems: !!rawItems,
            rawItemsLength: rawItems.length,
            rawItemsType: Array.isArray(rawItems) ? 'array' : typeof rawItems,
            quotationKeys: Object.keys(this.currentQuotation || {}),
            rawItemsPreview: rawItems.slice(0, 2)
        });

        if (!Array.isArray(rawItems) || rawItems.length === 0) {
            return `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-tools text-4xl mb-4 text-gray-300"></i>
                    <p class="text-lg">Aucune prestation définie</p>
                    <p class="text-sm mt-2">Les prestations seront affichées ici une fois configurées</p>
                    <button onclick="debugStep5()" class="mt-4 px-4 py-2 bg-primary text-white rounded text-sm">
                        Debug données
                    </button>
                </div>
            `;
        }

        // Extraire les tâches de la structure hiérarchique (étape 2) vers structure plate
        let items = this.extractTasksFromHierarchy(rawItems);
        
        if (items.length === 0) {
            return `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4 text-warning"></i>
                    <p class="text-lg">Aucune tâche active trouvée</p>
                    <p class="text-sm mt-2">Vérifiez que des tâches sont configurées et actives à l'étape 2</p>
                    <button onclick="goToStep(2)" class="mt-4 px-4 py-2 bg-primary text-white rounded text-sm">
                        Retour étape 2
                    </button>
                </div>
            `;
        }

        // Version mobile-friendly avec cards au lieu de tableau
        let servicesHTML = `
            <div class="space-y-4">
        `;

        items.forEach((item, itemIndex) => {
            if (item["is-active"] !== false) { // Afficher si pas explicitement désactivé
                // Calculer le total de l'opération
                let operationTotal = 0;
                
                // En-tête d'opération (card)
                servicesHTML += `
                    <div class="service-card border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <div class="service-header text-white px-4 py-3">
                            <h3 class="font-bold text-lg">${item.name || `Opération ${itemIndex + 1}`}</h3>
                            ${item.description ? `<p class="text-sm opacity-90 mt-1">${item.description}</p>` : ''}
                        </div>
                        <div class="divide-y divide-gray-200">
                `;

                // Tasks (si disponibles)
                if (item.tasks && Array.isArray(item.tasks)) {
                    item.tasks.forEach((task, taskIndex) => {
                        const taskTotal = this.calculateTaskTotal(task);
                        operationTotal += taskTotal;
                        
                                                 servicesHTML += `
                             <div class="service-item p-4 bg-gray-50">
                                 <div class="flex justify-between items-start mb-2">
                                     <div class="flex-1">
                                         <h4 class="font-medium text-gray-900">${task.name || `Tâche ${taskIndex + 1}`}</h4>
                                         ${task.description ? `<p class="text-sm text-gray-600 mt-1">${task.description}</p>` : ''}
                                     </div>
                                     <div class="text-right ml-4">
                                         <div class="price-highlight font-bold">${this.formatPrice(taskTotal)}</div>
                                         <div class="text-xs text-gray-500">
                                             ${task.superficie || 0} ${task.uom || 'm²'} × ${this.formatPrice(task["effective-price"] || 0)}
                                             ${task["linked-products"]?.length ? ` + ${task["linked-products"].length} produit(s)` : ''}
                                         </div>
                                     </div>
                                 </div>
                                
                                <!-- Produits liés -->
                                ${this.generateLinkedProductsForTask(task)}
                            </div>
                        `;
                    });
                } else {
                    // Si pas de tasks, afficher l'item directement
                    const itemTotal = (item["effective-price"] || 0) * (item.quantity || 1);
                    operationTotal += itemTotal;
                    
                    servicesHTML += `
                        <div class="p-4">
                            <div class="flex justify-between items-center">
                                <div class="flex-1">
                                    <h4 class="font-medium text-gray-900">${item.name}</h4>
                                    ${item.description ? `<p class="text-sm text-gray-600 mt-1">${item.description}</p>` : ''}
                                </div>
                                                                 <div class="text-right">
                                     <div class="price-highlight font-bold">${this.formatPrice(itemTotal)}</div>
                                     <div class="text-xs text-gray-500">
                                         ${item.quantity || 1} ${item.uom || 'unité'} × ${this.formatPrice(item["effective-price"] || 0)}
                                     </div>
                                 </div>
                            </div>
                        </div>
                    `;
                }

                // Footer avec total de l'opération
                servicesHTML += `
                        </div>
                        <div class="bg-gray-100 px-4 py-3 flex justify-between items-center">
                            <span class="font-medium text-gray-900">Total ${item.name}</span>
                            <span class="price-highlight font-bold text-lg">${this.formatPrice(operationTotal)}</span>
                        </div>
                    </div>
                `;
            }
        });

        servicesHTML += `
            </div>
        `;

        return servicesHTML;
    }

    generateLinkedProductsForTask(task) {
        if (!task["linked-products"] || !Array.isArray(task["linked-products"]) || task["linked-products"].length === 0) {
            return '';
        }

        let productsHTML = `
            <div class="mt-3 pt-3 border-t border-gray-200">
                <h5 class="text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-box mr-1"></i>
                    Produits inclus (${task["linked-products"].length})
                </h5>
                <div class="space-y-2">
        `;

        task["linked-products"].forEach((linkedProduct, index) => {
            const productTotal = (linkedProduct["effective-price"] || 0) * (linkedProduct["ordered-quantity"] || 0);
            
            // Gérer différents formats de données produit
            let productName, productCode, productUom;
            
            if (linkedProduct.product) {
                if (typeof linkedProduct.product === 'string') {
                    // Référence par code
                    productCode = linkedProduct.product;
                    productName = linkedProduct.productInfo?.designation || productCode;
                    productUom = linkedProduct.productInfo?.uom || 'unité';
                } else if (typeof linkedProduct.product === 'object') {
                    // Objet produit complet
                    productName = linkedProduct.product.name || linkedProduct.product.designation;
                    productCode = linkedProduct.product.code;
                    productUom = linkedProduct.product.uom?.code || linkedProduct.product.uom || 'unité';
                }
            }
            
            productsHTML += `
                <div class="flex justify-between items-start text-sm bg-gray-50 p-2 rounded">
                    <div class="flex-1">
                        <span class="text-gray-800 font-medium">${productName || `Produit ${index + 1}`}</span>
                        ${productCode ? `<div class="text-gray-500 text-xs">${productCode}</div>` : ''}
                        ${linkedProduct["estimated-quantity"] !== linkedProduct["ordered-quantity"] ? 
                            `<div class="text-blue-600 text-xs">Estimé: ${linkedProduct["estimated-quantity"]}, Sécurité: +${linkedProduct["safety-quantity"] || 0}</div>` : ''}
                    </div>
                    <div class="text-right ml-3">
                        <div class="font-medium text-primary">${this.formatPrice(productTotal)}</div>
                        <div class="text-xs text-gray-500">
                            ${linkedProduct["ordered-quantity"] || 0} ${productUom} × ${this.formatPrice(linkedProduct["effective-price"] || 0)}
                        </div>
                    </div>
                </div>
            `;
        });

        productsHTML += `
                </div>
            </div>
        `;

        return productsHTML;
    }

    generateFinancialSummary() {
        const financial = this.currentQuotation.financialDetails || this.currentQuotation['financial-details'];
        
        if (!financial) {
            return `
                <div class="text-center py-4 text-gray-500">
                    <i class="fas fa-exclamation-triangle text-warning text-2xl mb-2"></i>
                    <p>Données financières non disponibles</p>
                </div>
            `;
        }
        
        const subtotal = financial["total-price-ht"] || 0;
        const discount = financial["global-discount"] || 0;
        const finalTotal = financial["final-price"] || 0;
        const deposit = financial.deposit || 0;
        const remaining = finalTotal - deposit;

        return `
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span>Sous-total HT :</span>
                    <span class="font-medium">${this.formatPrice(subtotal)}</span>
                </div>
                ${discount > 0 ? `
                    <div class="flex justify-between text-red-600">
                        <span>Remise commerciale :</span>
                        <span class="font-medium">- ${this.formatPrice(discount)}</span>
                    </div>
                ` : ''}
                <div class="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total HT :</span>
                    <span>${this.formatPrice(finalTotal)}</span>
                </div>
                <div class="text-sm text-gray-600">
                    <p>TVA : Non applicable (Exonération Multiflex)</p>
                </div>
                ${deposit > 0 ? `
                    <div class="mt-4 pt-2 border-t border-gray-300">
                        <div class="flex justify-between text-sm">
                            <span>Acompte à la commande :</span>
                            <span class="font-medium">${this.formatPrice(deposit)}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span>Solde à livraison :</span>
                            <span class="font-medium">${this.formatPrice(remaining)}</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    generateConditionsSection() {
        const warranty = this.currentQuotation.warranty;
        const conditions = this.currentQuotation.conditions;
        
        if (!warranty && !conditions?.contractualNotes && !conditions?.clientResponsibilities) {
            return '';
        }

        let content = `
            <div class="pdf-section mb-6">
                <h2 class="text-lg font-bold text-primary border-b border-primary pb-2 mb-3">CONDITIONS</h2>
        `;

        // Garantie
        if (warranty) {
            const warrantyText = warranty.duration > 12 ? 
                `${Math.floor(warranty.duration / 12)} an${warranty.duration > 24 ? 's' : ''}` :
                `${warranty.duration} mois`;
            
            content += `
                <div class="mb-4">
                    <h3 class="font-bold text-gray-900 mb-2">GARANTIE</h3>
                    <p class="text-sm">Garantie de ${warrantyText} sur les travaux de peinture.</p>
                    ${warranty.description ? `<p class="text-sm mt-2">${warranty.description}</p>` : ''}
                </div>
            `;
        }

        // Notes contractuelles
        if (conditions?.contractualNotes) {
            content += `
                <div class="mb-4">
                    <h3 class="font-bold text-gray-900 mb-2">CONDITIONS PARTICULIÈRES</h3>
                    <div class="text-sm whitespace-pre-line">${conditions.contractualNotes}</div>
                </div>
            `;
        }

        // Prestations client
        if (conditions?.clientResponsibilities) {
            content += `
                <div class="mb-4">
                    <h3 class="font-bold text-gray-900 mb-2">À LA CHARGE DU CLIENT</h3>
                    <div class="text-sm whitespace-pre-line">${conditions.clientResponsibilities}</div>
                </div>
            `;
        }

        content += '</div>';
        return content;
    }

    generateCertificationsSection() {
        if (!this.currentQuotation.certifications || this.currentQuotation.certifications.length === 0) {
            return '';
        }

        // Récupérer les certifications sélectionnées depuis l'étape 4
        const availableCertifications = [
            { id: 'cert_multiflex_n1', name: 'Applicateur Certifié Multiflex N1' },
            { id: 'cert_multiflex_n2', name: 'Applicateur Certifié Multiflex N2' },
            { id: 'cert_peinture_deco', name: 'Spécialiste Peinture Décorative' },
            { id: 'cert_artisan_qualifie', name: 'Artisan Qualifié BTP' },
            { id: 'cert_eco_responsable', name: 'Applicateur Éco-Responsable' }
        ];

        const selectedCertifications = this.currentQuotation.certifications
            .map(certId => availableCertifications.find(c => c.id === certId))
            .filter(cert => cert);

        if (selectedCertifications.length === 0) return '';

        return `
            <div class="pdf-section mb-6">
                <h2 class="text-lg font-bold text-primary border-b border-primary pb-2 mb-3">CERTIFICATIONS</h2>
                <div class="flex flex-wrap gap-2">
                    ${selectedCertifications.map(cert => `
                        <span class="inline-flex items-center px-3 py-1 bg-primary text-white text-sm rounded">
                            <i class="fas fa-award mr-2"></i>${cert.name}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generateMediaSection() {
        if (!this.currentQuotation.media || this.currentQuotation.media.length === 0) {
            return '';
        }

        return `
            <div class="pdf-section mb-6">
                <h2 class="text-lg font-bold text-primary border-b border-primary pb-2 mb-3">RÉFÉRENCES VISUELLES</h2>
                <div class="grid grid-cols-2 gap-4">
                    ${this.currentQuotation.media.map(media => `
                        <div class="text-center">
                            <img src="${media.url}" alt="${media.name}" class="w-full h-32 object-cover rounded border">
                            <p class="text-xs text-gray-600 mt-1">${media.name}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Calcule le total d'une tâche (main d'œuvre + produits)
     * Logique adaptée de l'étape 2
     */
    calculateTaskTotal(task) {
        if (!task || task["is-active"] === false) return 0;
        
        // Total main d'œuvre
        const laborTotal = (task["effective-price"] || 0) * (task.superficie || 0);
        
        // Total produits
        const productsTotal = (task["linked-products"] || []).reduce((total, lp) => {
            return total + ((lp["effective-price"] || 0) * (lp["ordered-quantity"] || 0));
        }, 0);
        
        return laborTotal + productsTotal;
    }

    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    }

    formatPrice(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount).replace('XAF', 'FCFA');
    }

    // Méthodes d'actions

    executePrimaryAction() {
        if (this.requiresValidation) {
            this.showValidationModal();
        } else {
            this.generateAndSend();
        }
    }

    showValidationModal() {
        const modal = document.getElementById('validationModal');
        const reasonsList = document.getElementById('validationReasons');
        
        reasonsList.innerHTML = `
            <p class="font-medium mb-2">Ce devis nécessite une validation pour les raisons suivantes :</p>
            <ul class="list-disc list-inside space-y-1">
                ${this.validationReasons.map(reason => `<li>${reason}</li>`).join('')}
            </ul>
        `;
        
        modal.classList.remove('hidden');
    }

    closeValidationModal() {
        document.getElementById('validationModal').classList.add('hidden');
    }

    submitForValidation() {
        this.closeValidationModal();
        this.showLoadingOverlay('Soumission pour validation...');
        
        // Simuler l'envoi pour validation
        setTimeout(() => {
            this.currentQuotation.status.status = 'PENDING_VALIDATION';
            this.currentQuotation.status["validation-date"] = new Date().toISOString().split('T')[0];
            
            this.hideLoadingOverlay();
            this.saveProgress();
            
            this.showSuccessModal('Devis soumis pour validation avec succès! Votre responsable sera notifié et pourra l\'approuver ou demander des modifications.');
        }, 2000);
    }

    generateAndSend() {
        this.showLoadingOverlay('Génération du PDF...');
        
        // Simuler la génération PDF
        setTimeout(() => {
            this.currentQuotation.status.status = 'SENT';
            this.currentQuotation.status["sent-date"] = new Date().toISOString().split('T')[0];
            
            this.hideLoadingOverlay();
            this.saveProgress();
            
            this.showSuccessModal('Devis généré et prêt à être envoyé! Vous pouvez maintenant le partager avec votre client.');
        }, 3000);
    }

    showLoadingOverlay(text) {
        document.getElementById('loadingText').textContent = text;
        document.getElementById('loadingOverlay').classList.remove('hidden');
    }

    hideLoadingOverlay() {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }

    showSuccessModal(message) {
        document.getElementById('successMessage').textContent = message;
        document.getElementById('successModal').classList.remove('hidden');
    }

    shareQuotation() {
        // Simuler le partage natif mobile
        if (navigator.share) {
            navigator.share({
                title: `Devis ${this.currentQuotation.name}`,
                text: `Devis de travaux de peinture pour ${this.currentQuotation.chantier?.proprietaire?.name}`,
                url: `https://multiflex.cm/devis/${this.currentQuotation.name}`
            });
        } else {
            // Fallback pour web
            const shareText = `Bonjour,\n\nVeuillez trouver en pièce jointe votre devis de travaux de peinture n°${this.currentQuotation.name}.\n\nCordialement,\n${this.currentQuotation.technicianInfo?.name || 'Votre technicien Multiflex'}`;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(shareText);
                alert('Texte de partage copié dans le presse-papiers');
            } else {
                alert('Fonctionnalité de partage disponible sur mobile');
            }
        }
    }

    goToQuotationsList() {
        localStorage.removeItem('currentQuotation');
        window.location.href = 'index.html';
    }

    // Méthodes utilitaires

    previewPDF() {
        // Ouvrir en mode plein écran
        const preview = document.getElementById('pdfPreview');
        const container = document.getElementById('pdfPreviewContainer');
        
        if (preview.requestFullscreen) {
            container.requestFullscreen();
        } else {
            alert('Aperçu complet disponible sur appareil mobile');
        }
    }

    saveDraft() {
        this.currentQuotation.status.status = 'DRAFT';
        this.saveProgress();
        alert('Brouillon sauvegardé avec succès');
    }

    toggleSummary() {
        const content = document.getElementById('summaryContent');
        const icon = document.getElementById('summaryToggleIcon');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.className = 'fas fa-chevron-up';
        } else {
            content.style.display = 'none';
            icon.className = 'fas fa-chevron-down';
        }
    }

    zoomIn() {
        this.zoomLevel = Math.min(2.0, this.zoomLevel + 0.1);
        this.applyZoom();
    }

    zoomOut() {
        this.zoomLevel = Math.max(0.5, this.zoomLevel - 0.1);
        this.applyZoom();
    }

    applyZoom() {
        const preview = document.getElementById('pdfPreview');
        preview.style.transform = `scale(${this.zoomLevel})`;
        document.getElementById('zoomLevel').textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }

    goToStep(stepNumber) {
        if (confirm('Êtes-vous sûr de vouloir modifier une étape précédente ? Vos modifications actuelles seront sauvegardées.')) {
            this.saveProgress();
            window.location.href = `create-step${stepNumber}.html`;
        }
    }

    goBack() {
        if (confirm('Êtes-vous sûr de vouloir revenir à l\'étape précédente ? Vos modifications seront sauvegardées.')) {
            this.saveProgress();
            window.location.href = 'create-step4.html';
        }
    }

    saveProgress() {
        try {
            // Sauvegarder les données principales
            localStorage.setItem('currentQuotation', JSON.stringify(this.currentQuotation));
            
            // Sauvegarder des métadonnées pour le partage entre étapes
            const metadata = {
                lastStep: 5,
                lastUpdated: new Date().toISOString(),
                quotationName: this.currentQuotation.name,
                hasValidationIssues: this.requiresValidation,
                dataVersion: '1.0'
            };
            localStorage.setItem('quotationMetadata', JSON.stringify(metadata));
            
            console.log('✅ Étape 5 - Progression sauvegardée avec métadonnées');
            
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde:', error);
            alert('Erreur lors de la sauvegarde. Vos modifications pourraient être perdues.');
        }
    }

    /**
     * Vérifie l'intégrité des données partagées entre les étapes
     */
    verifyDataIntegrity() {
        console.group('🔍 Vérification intégrité des données partagées');
        
        try {
            // Vérifier la présence des données principales
            const quotationData = localStorage.getItem('currentQuotation');
            const metadataStr = localStorage.getItem('quotationMetadata');
            
            console.log('Statut des données:', {
                hasQuotationData: !!quotationData,
                hasMetadata: !!metadataStr,
                quotationDataSize: quotationData ? quotationData.length : 0
            });
            
            if (metadataStr) {
                const metadata = JSON.parse(metadataStr);
                console.log('Métadonnées:', metadata);
                
                // Vérifier la cohérence
                const dataAge = new Date() - new Date(metadata.lastUpdated);
                const isDataFresh = dataAge < 24 * 60 * 60 * 1000; // 24h
                
                console.log('Cohérence des données:', {
                    dataAge: Math.round(dataAge / (60 * 1000)) + ' minutes',
                    isDataFresh,
                    expectedName: metadata.quotationName,
                    actualName: this.currentQuotation?.name
                });
                
                if (!isDataFresh) {
                    console.warn('⚠️ Les données semblent anciennes');
                }
                
                if (metadata.quotationName !== this.currentQuotation?.name) {
                    console.warn('⚠️ Incohérence du nom de devis');
                }
            }
            
        } catch (error) {
            console.error('❌ Erreur lors de la vérification:', error);
        }
        
        console.groupEnd();
    }

    showHelp() {
        alert('Aide - Prévisualisation et Envoi:\n\n' +
              '1. Vérifiez attentivement l\'aperçu de votre devis\n' +
              '2. Le système détecte automatiquement si une validation est requise\n' +
              '3. Utilisez les boutons de zoom pour examiner les détails\n' +
              '4. Modifiez les étapes précédentes si nécessaire\n' +
              '5. Envoyez directement ou soumettez pour validation\n' +
              '6. Partagez le devis avec votre client une fois généré\n\n' +
              'Une fois envoyé, le devis sera accessible à votre client et vous pourrez suivre son statut.');
    }

    /**
     * Analyse et affiche en détail les données disponibles pour debug
     */
    debugQuotationData() {
        console.group('🐛 DEBUG - Analyse détaillée des données Étape 5');
        
        // Analyse des données brutes
        console.log('📋 Données brutes currentQuotation:', this.currentQuotation);
        
        if (this.currentQuotation) {
            console.log('🔑 Clés disponibles:', Object.keys(this.currentQuotation));
            
            // Analyse des items
            const rawItems = this.currentQuotation.items || this.currentQuotation['quotation-items'];
            console.log('📦 Items bruts:', rawItems);
            
            if (rawItems && Array.isArray(rawItems)) {
                rawItems.forEach((item, index) => {
                    console.group(`Item ${index + 1}: ${item.name}`);
                    console.log('- Structure:', {
                        hasHierarchy: !!item.hierarchy,
                        hasTasks: !!item.tasks,
                        isActive: item["is-active"],
                        hierarchyLength: item.hierarchy?.length,
                        tasksLength: item.tasks?.length
                    });
                    
                    if (item.hierarchy) {
                        console.log('- Hiérarchie:', item.hierarchy);
                        this.debugHierarchyStructure(item.hierarchy, 0);
                    }
                    
                    if (item.tasks) {
                        console.log('- Tâches plates:', item.tasks);
                    }
                    console.groupEnd();
                });
                
                // Test d'extraction
                console.log('🔄 Test d\'extraction des tâches...');
                const extractedItems = this.extractTasksFromHierarchy(rawItems);
                console.log('✅ Items extraits:', extractedItems);
                
                extractedItems.forEach((item, index) => {
                    console.log(`  ${index + 1}. ${item.name}: ${item.tasks.length} tâches`);
                    item.tasks.forEach((task, taskIndex) => {
                        const total = this.calculateTaskTotal(task);
                        console.log(`    - ${task.name}: ${this.formatPrice(total)} (${task.superficie || 0} ${task.uom || 'm²'})`);
                    });
                });
                
            } else {
                console.warn('❌ Aucun item trouvé ou format invalide');
            }
            
            // Analyse données financières
            const financial = this.currentQuotation.financialDetails || this.currentQuotation['financial-details'];
            console.log('💰 Données financières:', financial);
            
            // Analyse localStorage
            console.log('💾 localStorage currentQuotation:', localStorage.getItem('currentQuotation'));
            
        } else {
            console.error('❌ Aucune donnée currentQuotation trouvée');
        }
        
        console.groupEnd();
        
        // Afficher aussi dans l'interface utilisateur
        const debugInfo = {
            hasQuotation: !!this.currentQuotation,
            hasItems: !!(this.currentQuotation?.items || this.currentQuotation?.['quotation-items']),
            itemsCount: (this.currentQuotation?.items || this.currentQuotation?.['quotation-items'] || []).length,
            localStorageSize: localStorage.getItem('currentQuotation')?.length || 0
        };
        
        alert(`Debug Info:\n${JSON.stringify(debugInfo, null, 2)}\n\nVoir console pour détails complets`);
    }
    
    /**
     * Debug récursif de la structure hiérarchique
     */
    debugHierarchyStructure(nodes, level = 0) {
        const indent = '  '.repeat(level);
        nodes.forEach((node, index) => {
            console.log(`${indent}Node ${index}:`, {
                name: node.name,
                isLeaf: node.isLeaf,
                isActive: node["is-active"],
                hasTask: !!node.task,
                hasChildren: !!node.children,
                childrenCount: node.children?.length
            });
            
            if (node.task) {
                console.log(`${indent}  Task:`, {
                    name: node.task.name,
                    superficie: node.task.superficie,
                    effectivePrice: node.task["effective-price"],
                    linkedProductsCount: node.task["linked-products"]?.length
                });
            }
            
            if (node.children && node.children.length > 0) {
                this.debugHierarchyStructure(node.children, level + 1);
            }
        });
    }

    /**
     * Teste toutes les fonctionnalités principales de l'étape 5
     * Utile pour déboguer et vérifier que tout fonctionne
     */
    testStep5Functionality() {
        console.group('🧪 Test des fonctionnalités Étape 5');
        
        try {
            // Debug des données d'abord
            this.debugQuotationData();
            
            // Test de chargement des données
            console.log('✅ Données chargées:', !!this.currentQuotation);
            
            // Test d'intégrité des données partagées
            this.verifyDataIntegrity();
            console.log('✅ Vérification intégrité terminée');
            
            // Test de validation des données
            const isValid = this.validateQuotationData();
            console.log('✅ Validation données:', isValid);
            
            // Test d'extraction des tâches de la hiérarchie
            const rawItems = this.currentQuotation.items || this.currentQuotation['quotation-items'] || [];
            const extractedItems = this.extractTasksFromHierarchy(rawItems);
            console.log('✅ Extraction tâches:', {
                rawItemsCount: rawItems.length,
                extractedItemsCount: extractedItems.length,
                totalTasks: extractedItems.reduce((sum, item) => sum + item.tasks.length, 0)
            });
            
            // Test de génération du numéro de devis
            const originalName = this.currentQuotation.name;
            this.generateQuotationNumber();
            console.log('✅ Génération numéro devis:', this.currentQuotation.name);
            
            // Test de vérification des exigences de validation
            this.checkValidationRequirements();
            console.log('✅ Vérification validation:', {
                requiresValidation: this.requiresValidation,
                reasons: this.validationReasons
            });
            
            // Test de rendu de l'interface
            this.renderInterface();
            console.log('✅ Rendu interface réussi');
            
            // Test de génération PDF preview
            this.generatePDFPreview();
            console.log('✅ Génération aperçu PDF réussi');
            
            // Test de sauvegarde
            this.saveProgress();
            console.log('✅ Test sauvegarde réussi');
            
            console.log('🎉 Tous les tests passés avec succès');
            
        } catch (error) {
            console.error('❌ Erreur pendant les tests:', error);
            console.log('Données actuelles du devis:', this.currentQuotation);
            this.handleError(error, 'test');
        }
        
        console.groupEnd();
    }

    /**
     * Gère les erreurs globales et fournit des solutions
     */
    handleError(error, context = 'général') {
        console.error(`Erreur dans le contexte ${context}:`, error);
        
        // Solutions communes selon le type d'erreur
        if (error.message.includes('Cannot read properties of undefined')) {
            console.warn('💡 Solution: Vérifiez que les données du devis sont bien chargées depuis les étapes précédentes');
            
            if (!this.currentQuotation) {
                console.warn('   → currentQuotation est null/undefined');
            }
        }
        
        if (error.message.includes('is not defined')) {
            console.warn('💡 Solution: Une variable ou fonction n\'est pas définie');
        }
        
        if (context === 'PDF' && error.message.includes('Element not found')) {
            console.warn('💡 Solution: Un élément DOM requis pour la génération PDF est manquant');
        }
        
        // Réinitialiser les données si nécessaire
        if (context === 'chargement' && !this.currentQuotation) {
            console.warn('🔄 Tentative de rechargement des données...');
            this.loadQuotationData();
        }
    }
}

// Variables globales
let wizardManager;

// Initialisation sécurisée
document.addEventListener('DOMContentLoaded', function() {
    try {
        wizardManager = new WizardStep5Manager();
        console.log('✅ WizardStep5Manager initialisé avec succès');
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        alert('Erreur lors du chargement de la page. Veuillez recharger.');
    }
});

// Fonction utilitaire pour vérifier l'initialisation
function checkWizardManager(functionName) {
    if (!wizardManager) {
        console.error(`❌ ${functionName} appelée avant l'initialisation de wizardManager`);
        alert('La page n\'est pas encore complètement chargée. Veuillez patienter.');
        return false;
    }
    return true;
}

// Fonctions globales pour les handlers avec gestion d'erreur
function executePrimaryAction() {
    if (!checkWizardManager('executePrimaryAction')) return;
    try {
        wizardManager.executePrimaryAction();
    } catch (error) {
        console.error('Erreur executePrimaryAction:', error);
        alert('Erreur lors de l\'exécution de l\'action principale.');
    }
}

function previewPDF() {
    if (!checkWizardManager('previewPDF')) return;
    try {
        wizardManager.previewPDF();
    } catch (error) {
        console.error('Erreur previewPDF:', error);
        alert('Erreur lors de l\'aperçu PDF.');
    }
}

function saveDraft() {
    if (!checkWizardManager('saveDraft')) return;
    try {
        wizardManager.saveDraft();
    } catch (error) {
        console.error('Erreur saveDraft:', error);
        alert('Erreur lors de la sauvegarde du brouillon.');
    }
}

function goToStep(stepNumber) {
    if (!checkWizardManager('goToStep')) return;
    try {
        wizardManager.goToStep(stepNumber);
    } catch (error) {
        console.error('Erreur goToStep:', error);
        alert('Erreur lors de la navigation.');
    }
}

function toggleSummary() {
    if (!checkWizardManager('toggleSummary')) return;
    try {
        wizardManager.toggleSummary();
    } catch (error) {
        console.error('Erreur toggleSummary:', error);
    }
}

function zoomIn() {
    if (!checkWizardManager('zoomIn')) return;
    try {
        wizardManager.zoomIn();
    } catch (error) {
        console.error('Erreur zoomIn:', error);
        alert('Erreur lors du zoom.');
    }
}

function zoomOut() {
    if (!checkWizardManager('zoomOut')) return;
    try {
        wizardManager.zoomOut();
    } catch (error) {
        console.error('Erreur zoomOut:', error);
        alert('Erreur lors du zoom.');
    }
}

function closeValidationModal() {
    if (!checkWizardManager('closeValidationModal')) return;
    try {
        wizardManager.closeValidationModal();
    } catch (error) {
        console.error('Erreur closeValidationModal:', error);
    }
}

function submitForValidation() {
    if (!checkWizardManager('submitForValidation')) return;
    try {
        wizardManager.submitForValidation();
    } catch (error) {
        console.error('Erreur submitForValidation:', error);
        alert('Erreur lors de la soumission pour validation.');
    }
}

function shareQuotation() {
    if (!checkWizardManager('shareQuotation')) return;
    try {
        wizardManager.shareQuotation();
    } catch (error) {
        console.error('Erreur shareQuotation:', error);
        alert('Erreur lors du partage du devis.');
    }
}

function goToQuotationsList() {
    if (!checkWizardManager('goToQuotationsList')) return;
    try {
        wizardManager.goToQuotationsList();
    } catch (error) {
        console.error('Erreur goToQuotationsList:', error);
        alert('Erreur lors de la navigation vers la liste des devis.');
    }
}

function goBack() {
    if (!checkWizardManager('goBack')) return;
    try {
        wizardManager.goBack();
    } catch (error) {
        console.error('Erreur goBack:', error);
        alert('Erreur lors du retour à l\'étape précédente.');
    }
}

function showHelp() {
    if (!checkWizardManager('showHelp')) return;
    try {
        wizardManager.showHelp();
    } catch (error) {
        console.error('Erreur showHelp:', error);
    }
}

// Fonction de test globale pour déboguer
function testStep5() {
    if (!checkWizardManager('testStep5')) return;
    try {
        wizardManager.testStep5Functionality();
    } catch (error) {
        console.error('Erreur testStep5:', error);
    }
}

// Fonction de debug globale pour analyser les données
function debugStep5() {
    if (!checkWizardManager('debugStep5')) return;
    try {
        wizardManager.debugQuotationData();
    } catch (error) {
        console.error('Erreur debugStep5:', error);
    }
}