// ===============================================
// WIZARD STEP 2: Construction des Prestations
// ===============================================

class WizardStep2Manager {
    constructor() {
        this.currentQuotation = null;
        this.quoteTemplate = null;
        this.currentEditingTask = null;
        this.calculator = new DevisCalculator();
        
        this.init();
    }

    /**
     * Récupère le prix Patron d'un produit (prix plafond)
     */
    getPatronPrice(productCode) {
        const product = this.getProductVariant(productCode);
        
        if (product && product.priceList) {
            const patronPrice = product.priceList.find(p => p.name === "Patron");
            if (patronPrice) {
                return patronPrice.fixPrice;
            }
        }
        
        // Fallback: Prix par défaut plus élevé que technicien (marge ~15%)
        const technicianPrice = this.getDefaultProductPrice(productCode);
        return Math.round(technicianPrice * 1.15);
    }

    /**
     * Récupère le prix Technicien d'un produit (prix plancher) 
     */
    getTechnicianPrice(productCode) {
        // Réutilise la fonction existante qui récupère déjà le prix technicien
        return this.getDefaultProductPrice(productCode);
    }

    /**
     * Valide que l'intégration des produits fonctionne correctement
     */
    validateProductsIntegration() {
        console.log('=== VALIDATION INTÉGRATION PRODUITS ===');
        
        if (!window.MockData || !window.MockData.PRODUCTS_DATA) {
            console.error('❌ PRODUCTS_DATA non disponible !');
            return false;
        }
        
        console.log(`✅ PRODUCTS_DATA chargé avec ${window.MockData.PRODUCTS_DATA.length} produits`);
        
        // Tester quelques produits clés
        const testProducts = [
            'MI-300-30',
            'PROC-EGRENAGE', 
            'EM-1500-25',
            'PROC-HUMID-DECAPER',
            'PROC-REV-FINITION-MINCE'
        ];
        
        let success = true;
        testProducts.forEach(productCode => {
            const product = this.getProductVariant(productCode);
            const price = this.getDefaultProductPrice(productCode);
            const rendement = this.getDefaultRendement(productCode);
            const security = this.getDefaultSecurityQuantity(productCode);
            
            if (product) {
                console.log(`✅ ${productCode}: ${product.designation} - Prix: ${price} - Rendement: ${rendement} - Sécurité: ${security}%`);
            } else {
                console.warn(`⚠️ ${productCode}: Non trouvé dans PRODUCTS_DATA - Prix fallback: ${price} - Rendement: ${rendement}`);
            }
        });
        
        console.log('=== FIN VALIDATION ===');
        return success;
    }

    init() {
        this.validateProductsIntegration();
        this.loadQuotationData();
        this.setupEventListeners();
        this.displayTechnicalCriteria();
        this.renderInterface();
    }

    loadQuotationData() {
        // Charger les données depuis localStorage ou sessionStorage
        const savedData = localStorage.getItem('currentQuotation');
        if (savedData) {
            this.currentQuotation = JSON.parse(savedData);
            console.log('Données chargées:', this.currentQuotation);
        } else {
            console.error('Aucune donnée de devis trouvée');
            alert('Erreur: Aucune donnée de devis. Retour à l\'étape 1.');
            window.location.href = 'create-step1.html';
            return;
        }

        // Charger le template de devis sélectionné
        this.loadQuoteTemplate();
    }

    loadQuoteTemplate() {
        const quoteTemplateId = this.currentQuotation.selectedTemplate?.id;
        if (quoteTemplateId) {
            // Chercher le template dans les données mockées
            this.quoteTemplate = MockData.QUOTE_TEMPLATES.find(qt => qt.id === quoteTemplateId);
            if (this.quoteTemplate) {
                console.log('Template trouvé:', this.quoteTemplate['template-name']);
                console.log('Nombre d\'opérations dans le template:', this.quoteTemplate['quote-operations']?.length || 0);
                this.quoteTemplate['quote-operations']?.forEach((op, i) => {
                    console.log(`  Opération ${i+1}: ${op.name} (${op['operation-id']}) - Obligatoire: ${op['is-mandatory']}`);
                    if (op['quote-operation'] && op['quote-operation'].length > 0) {
                        op['quote-operation'].forEach((subOp, j) => {
                            console.log(`    Sous-tâche ${j+1}: ${subOp.name} (${subOp['operation-id']})`);
                            if (subOp.tasks) {
                                console.log(`      Produits: ${subOp.tasks['linked-products']?.join(', ') || 'Aucun'}`);
                            }
                        });
                    }
                });
                this.initializeQuotationItems();
            } else {
                console.warn('Template non trouvé avec ID:', quoteTemplateId);
                this.initializeEmptyQuotation();
            }
        } else {
            console.warn('Aucun template sélectionné');
            this.initializeEmptyQuotation();
        }
    }

    initializeEmptyQuotation() {
        // Initialiser un devis vide si aucun template trouvé
        this.currentQuotation.items = [];
        console.log('Devis initialisé sans template');
    }

    initializeQuotationItems() {
        // Initialiser les items de devis basés sur le template SANS aplatir la hiérarchie
        if (!this.currentQuotation.items || this.currentQuotation.items.length === 0) {
            const operations = this.quoteTemplate['quote-operations'] || [];
            this.currentQuotation.items = operations.map(op => {
                return new DevisModels.QuotationItem({
                    "quote-operation-id": op['operation-id'],
                    "name": op.name,
                    "is-active": op["is-mandatory"] !== false,
                    "is-mandatory": op["is-mandatory"] !== false,
                    "hierarchy": this.preserveHierarchy(op['quote-operation'] || []) // Préserver la hiérarchie
                });
            });
            console.log('Items initialisés avec hiérarchie:', this.currentQuotation.items.length);
            
            // Log détaillé de la structure créée
            this.currentQuotation.items.forEach((item, i) => {
                console.log(`Opération ${i+1}: ${item.name} - ${this.countTasksInHierarchy(item.hierarchy)} tâches`);
            });
        }
    }

    /**
     * Préserve la hiérarchie complète des quote-operations sans l'aplatir
     */
    preserveHierarchy(quoteOperations) {
        return quoteOperations.map(operation => {
            const hierarchyNode = {
                "operation-id": operation["operation-id"],
                "name": operation.name,
                "is-mandatory": operation["is-mandatory"] !== false,
                "is-active": operation["is-mandatory"] !== false, // Par défaut actif si obligatoire
                "is-expanded": false, // Pour l'affichage dépliable
                "children": [],
                "task": null, // Sera défini si c'est une tâche feuille
                "level": 1 // Niveau dans la hiérarchie
            };

            // Si cette opération a des 'tasks', c'est une tâche feuille
            if (operation.tasks && operation.tasks['product-task']) {
                hierarchyNode.task = this.createQuotationTask(operation);
                hierarchyNode.isLeaf = true;
            }
            // Sinon, continuer à descendre dans la hiérarchie
            else if (operation['quote-operation'] && operation['quote-operation'].length > 0) {
                hierarchyNode.children = this.preserveHierarchy(operation['quote-operation']);
                hierarchyNode.isLeaf = false;
                // Mettre à jour les niveaux des enfants
                hierarchyNode.children.forEach(child => {
                    child.level = hierarchyNode.level + 1;
                });
            }

            return hierarchyNode;
        });
    }

    /**
     * Compte récursivement le nombre de tâches dans une hiérarchie
     */
    countTasksInHierarchy(hierarchy) {
        let count = 0;
        hierarchy.forEach(node => {
            if (node.isLeaf) {
                count++;
            } else if (node.children) {
                count += this.countTasksInHierarchy(node.children);
            }
        });
        return count;
    }

    createQuotationTask(templateTask) {
        // templateTask est une QuoteOperation avec une propriété tasks
        const taskInfo = templateTask.tasks || {};
        const productTask = taskInfo["product-task"] || templateTask["operation-id"];
        const linkedProducts = taskInfo["linked-products"] || [];
        const isMandatory = templateTask["is-mandatory"] !== false;
        
        console.log('Création tâche:', templateTask.name, 'avec produits:', linkedProducts, 'obligatoire:', isMandatory);
        
        // Récupérer les informations du produit principal (procédé)
        const mainProduct = this.getProductVariant(productTask);
        let defaultSuperficie = 50; // Surface par défaut
        let defaultUom = "m2"; // UOM par défaut
        
        // Si le produit principal existe, utiliser ses spécifications
        if (mainProduct) {
            if (mainProduct.uom && mainProduct.uom.code) {
                defaultUom = mainProduct.uom.code.toLowerCase();
            }
            console.log(`Produit principal trouvé: ${mainProduct.designation} (${mainProduct.code})`);
        }
        
        const task = new DevisModels.QuotationTask({
            "product-task": productTask,
            "name": templateTask.name,
            "operation-id": templateTask["operation-id"], // Ajout pour traçabilité
            "is-mandatory": isMandatory,
            "is-active": isMandatory, // Les tâches obligatoires sont actives par défaut, les optionnelles sont inactives
            "superficie": defaultSuperficie,
            "uom": defaultUom,
            "technician-price": this.getDefaultTechnicianPrice(productTask),
            "laborer-price": this.getDefaultLaborerPrice(productTask),
            "base-price": this.getDefaultTechnicianPrice(productTask),
            "effective-price": this.getDefaultTechnicianPrice(productTask),
            "linked-products": linkedProducts.map(productId => {
                // Récupérer les informations réelles du produit
                const product = this.getProductVariant(productId);
                const rendement = this.getDefaultRendement(productId);
                const nombreCouches = this.getDefaultLayersCount(productId);
                const securityPercent = this.getDefaultSecurityQuantity(productId);
                
                // Calculs basés sur les vraies spécifications
                const estimatedQuantity = Math.ceil((defaultSuperficie * nombreCouches) / rendement);
                const safetyQuantity = Math.ceil(estimatedQuantity * securityPercent / 100);
                const orderedQuantity = estimatedQuantity + safetyQuantity;
                
                console.log(`Produit ${productId}: ${estimatedQuantity} + ${safetyQuantity} = ${orderedQuantity} unités (rendement: ${rendement}, couches: ${nombreCouches}, sécurité: ${securityPercent}%)`);
                
                // Créer l'objet avec toutes les informations du produit
                const linkedProductData = {
                    product: productId,
                    "estimated-quantity": estimatedQuantity,
                    "safety-quantity": safetyQuantity,
                    "ordered-quantity": orderedQuantity,
                    "technician-price": this.getDefaultProductPrice(productId),
                    "base-price": this.getDefaultProductPrice(productId),
                    "effective-price": this.getDefaultProductPrice(productId),
                    rendement: rendement,
                    "nombre-couches": nombreCouches,
                    "default-security-quantity": securityPercent
                };
                
                // Si le produit existe, ajouter ses informations complètes
                if (product) {
                    linkedProductData.productInfo = {
                        designation: product.designation,
                        conditioning: product.conditioning,
                        uom: product.uom ? product.uom.code : 'PCS',
                        status: product.status
                    };
                    console.log(`  -> ${product.designation} (${product.conditioning})`);
                } else {
                    console.warn(`  -> Produit ${productId} non trouvé dans PRODUCTS_DATA`);
                }
                
                return linkedProductData;
            }),
            "nombre-tacherons": 1
        });
        return task;
    }

    /**
     * Récupère un ProductVariant depuis PRODUCTS_DATA par son code
     */
    getProductVariant(productCode) {
        if (!window.MockData || !window.MockData.PRODUCTS_DATA) {
            console.warn('PRODUCTS_DATA non disponible, utilisation des valeurs par défaut');
            return null;
        }
        
        const product = window.MockData.PRODUCTS_DATA.find(p => p.code === productCode);
        if (!product) {
            console.warn(`Produit non trouvé: ${productCode}`);
            return null;
        }
        
        return product;
    }

    /**
     * Récupère le prix technicien d'un produit (procédé ou produit physique)
     */
    getDefaultTechnicianPrice(productCode) {
        const product = this.getProductVariant(productCode);
        
        if (product && product.priceList) {
            const technicianPrice = product.priceList.find(p => p.name === "Technicien");
            if (technicianPrice) {
                return technicianPrice.fixPrice;
            }
        }
        
        // Fallback: prix par défaut selon le type de procédé
        const fallbackPriceMap = {
            "PROC-EGRENAGE": 800,
            "PROC-ENDUIT-COLORE": 1200,
            "PROC-ENDUIT-EPAIS": 1400,
            "PROC-PRIMAIRE": 1000,
            "PROC-PEINTURE-FINITION": 1500,
            "PROC-NETTOYAGE": 600,
            "PROC-PREPARATION-B": 900,
            "PROC-FINITION-MI300": 1700,
            // Nouveaux procédés ajoutés
            "PROC-PROTECTION": 50,
            "PROC-REBOUCHAGE": 200,
            "PROC-PONCAGE": 120,
            "PROC-IMPRESSION": 250,
            "PROC-COUCHE-INTERMEDIAIRE": 300,
            "PROC-FINITION-MATE": 650,
            "PROC-FINITION-VELOURS": 850,
            "PROC-FINITION-SATINEE": 950,
            "PROC-HUMID-DECAPER": 2000,
            "PROC-HUMID-ASSAINIR": 500,
            "PROC-FISSURE-AGRANDIR-PM": 500,
            "PROC-FISSURE-REBOUCHER-8000": 500,
            "PROC-FISSURE-AGRANDIR-GF": 1000,
            "PROC-FISSURE-ARMATURE": 1000,
            "PROC-FISSURE-CIMENT-GRILLAGE": 1500,
            "PROC-JOINTS-DEGARNIS": 1000,
            "PROC-JOINTS-REGARNIS": 500
        };
        
        return fallbackPriceMap[productCode] || 1000;
    }

    /**
     * Récupère le prix tâcheron d'un produit (procédé)
     */
    getDefaultLaborerPrice(productCode) {
        const product = this.getProductVariant(productCode);
        
        if (product && product.priceList) {
            const laborerPrice = product.priceList.find(p => p.name === "Tâcheron");
            if (laborerPrice) {
                return laborerPrice.fixPrice;
            }
        }
        
        // Fallback: prix par défaut (généralement 80-90% du prix technicien)
        const technicianPrice = this.getDefaultTechnicianPrice(productCode);
        return Math.round(technicianPrice * 0.85);
    }

    /**
     * Récupère le prix d'un produit physique
     */
    getDefaultProductPrice(productCode) {
        const product = this.getProductVariant(productCode);
        
        if (product && product.priceList) {
            const technicianPrice = product.priceList.find(p => p.name === "Technicien");
            if (technicianPrice) {
                return technicianPrice.fixPrice;
            }
        }
        
        // Fallback: prix par défaut pour les produits manquants
        const fallbackPriceMap = {
            // PEINTURES
            "MI-100-30": 150,
            "MI-100-5": 40,
            "MI-300-30": 266,
            "MI-300-5": 60,
            "ME-100-30": 321,
            "ME-100-5": 69,
            "ME-500-30": 307,
            "ME-500-5": 75,
            "ME-1900-25": 620,
            "ME-1900-5": 135,
            "ME-6000-25": 621,
            "ME-6000-5": 155,
            
            // IMPRESSIONS
            "IM-2000-25": 541,
            "IM-2000-5": 101,
            
            // ENDUITS
            "EM-1500-25": 257,
            "EM-1500-5": 78,
            "EM-1500-MULTICOAT-30": 386,
            
            // CIMENTS COLLES
            "CC-GRIS-20": 23,
            "CC-BLANC-20": 50,
            
            // OUTILLAGE
            "ROULEAU-180-1": 25,
            "ROULEAU-250-1": 40,
            "PINCEAU-PLAT-50": 18,
            "PAPIER-ABRASIF-120": 4,
            
            // ÉQUIPEMENT
            "ECHAFAUD-1": 100,
            "ECHELLE-TRANSFORMABLE": 35,
            
            // PRODUITS COMPLÉMENTAIRES
            "DETERGENT-MULTI": 22,
            "PRIMAIRE-MULTIFIX": 541,
            "PEINTURE-MATE-MULTI": 266
        };
        
        return fallbackPriceMap[productCode] || 1000;
    }

    /**
     * Récupère le rendement d'un produit depuis ses spécifications
     */
    getDefaultRendement(productCode) {
        const product = this.getProductVariant(productCode);
        
        if (product && product.productSpecs && product.productSpecs["yield-surface"]) {
            return product.productSpecs["yield-surface"];
        }
        
        // Fallback: rendement par défaut pour les produits manquants
        const fallbackRendementMap = {
            // PEINTURES
            "MI-100-30": 195,
            "MI-100-5": 32,
            "MI-300-30": 195,
            "MI-300-5": 32,
            "ME-100-30": 180,
            "ME-100-5": 30,
            "ME-500-30": 210,
            "ME-500-5": 35,
            "ME-1900-25": 225,
            "ME-1900-5": 45,
            "ME-6000-25": 250,
            "ME-6000-5": 50,
            
            // IMPRESSIONS
            "IM-2000-25": 250,
            "IM-2000-5": 50,
            
            // ENDUITS
            "EM-1500-25": 40,
            "EM-1500-5": 8,
            "EM-1500-MULTICOAT-30": 48,
            
            // CIMENTS COLLES
            "CC-GRIS-20": 5,
            "CC-BLANC-20": 5,
            
            // OUTILLAGE
            "ROULEAU-180-1": 50,
            "ROULEAU-250-1": 80,
            "PINCEAU-PLAT-50": 20,
            "PAPIER-ABRASIF-120": 2,
            
            // PRODUITS COMPLÉMENTAIRES
            "DETERGENT-MULTI": 100,
            "PRIMAIRE-MULTIFIX": 250,
            "PEINTURE-MATE-MULTI": 195
        };
        
        return fallbackRendementMap[productCode] || 10;
    }

    /**
     * Récupère la quantité de sécurité par défaut d'un produit
     */
    getDefaultSecurityQuantity(productCode) {
        const product = this.getProductVariant(productCode);
        
        if (product && product.productSpecs && product.productSpecs["default-security-quantity"]) {
            return product.productSpecs["default-security-quantity"];
        }
        
        // Fallback par type de produit
        if (productCode.startsWith("PROC-")) {
            return 5; // 5% pour les procédés
        } else if (productCode.includes("ENDUIT") || productCode.includes("CC-")) {
            return 10; // 10% pour enduits et ciments colles
        } else {
            return 5; // 5% par défaut
        }
    }

    /**
     * Récupère le nombre de couches par défaut d'un produit
     */
    getDefaultLayersCount(productCode) {
        const product = this.getProductVariant(productCode);
        
        if (product && product.productSpecs && product.productSpecs["layers-count"]) {
            return product.productSpecs["layers-count"];
        }
        
        // Fallback par type de produit
        if (productCode.includes("PEINTURE") || productCode.includes("MI-") || productCode.includes("ME-")) {
            return 2; // 2 couches pour les peintures
        } else if (productCode.includes("ENDUIT")) {
            return 2; // 2 couches pour les enduits
        } else {
            return 1; // 1 couche par défaut
        }
    }

    recalculateProductQuantities(task) {
        // Recalculer les quantités de produits basées sur la nouvelle superficie
        if (!task["linked-products"] || !Array.isArray(task["linked-products"])) {
            console.warn('Aucun produit lié trouvé pour recalcul des quantités:', task.name);
            return;
        }

        if (!task.superficie || task.superficie <= 0) {
            console.warn('Superficie invalide pour recalcul des quantités:', task.superficie);
            return;
        }

        task["linked-products"].forEach(lp => {
            try {
                // Récupérer les vraies spécifications du produit
                const productCode = lp.product;
                const rendement = lp.rendement || this.getDefaultRendement(productCode);
                const nombreCouches = lp["nombre-couches"] || this.getDefaultLayersCount(productCode);
                const securityPercent = lp["default-security-quantity"] || this.getDefaultSecurityQuantity(productCode);
                
                // Calculs avec gestion d'erreur
                if (rendement <= 0) {
                    console.error(`Rendement invalide pour ${productCode}: ${rendement}`);
                    return;
                }
                
                const estimatedQuantity = Math.ceil((task.superficie * nombreCouches) / rendement);
                const safetyQuantity = Math.ceil(estimatedQuantity * securityPercent / 100);
                
                // Mettre à jour les quantités
                lp["estimated-quantity"] = estimatedQuantity;
                lp["safety-quantity"] = safetyQuantity;
                lp["ordered-quantity"] = estimatedQuantity + safetyQuantity;
                lp.rendement = rendement; // Mettre à jour au cas où c'était undefined
                lp["nombre-couches"] = nombreCouches;
                lp["default-security-quantity"] = securityPercent;
                
                console.log(`Recalcul ${productCode}: ${estimatedQuantity} + ${safetyQuantity} = ${lp["ordered-quantity"]} (${task.superficie}m² × ${nombreCouches} couches ÷ ${rendement} + ${securityPercent}%)`);
                
            } catch (error) {
                console.error(`Erreur lors du recalcul pour ${lp.product}:`, error);
            }
        });
        
        console.log('Quantités recalculées pour tâche:', task.name, task["linked-products"]);
    }

    setupEventListeners() {
        // Toggle du récapitulatif
        document.getElementById('toggleSummary').addEventListener('click', () => {
            const content = document.getElementById('summaryContent');
            const icon = document.querySelector('#toggleSummary i');
            
            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.className = 'fas fa-chevron-up';
            } else {
                content.style.display = 'none';
                icon.className = 'fas fa-chevron-down';
            }
        });

        // Sauvegarde automatique périodique
        setInterval(() => {
            this.saveProgress();
        }, 30000); // Toutes les 30 secondes
    }

    renderInterface() {
        this.updateSummary();
        this.renderOperationsList();
        this.updateTotals();
    }

    updateSummary() {
        const chantier = this.currentQuotation.chantier;
        const criteria = this.currentQuotation.technicalCriteria;
        
        // Informations de base
        document.getElementById('summaryChantier').textContent = chantier ? chantier.name : '-';
        
        // Utiliser technicalCriteria si disponible, sinon les propriétés directes
        const typeDevis = criteria ? criteria.typeDevis : this.currentQuotation.typeDevis;
        const niveauFinition = criteria ? criteria.niveauFinition : this.currentQuotation.finishingLevel;
        const typeRevetement = criteria ? criteria.typeRevetement : this.currentQuotation.coveringType;
        const aspects = criteria ? criteria.aspectFinition : this.currentQuotation.finishingAspects;
        
        // Mapping des valeurs pour l'affichage
        const typeNames = {
            'Paint': 'Peinture',
            'Wallpaper': 'Papier Peint',
            'Tiling': 'Carrelage'
        };

        const levelNames = {
            'A': 'Finition A (Parfaite)',
            'B': 'Finition B (Soignée)',
            'C': 'Finition C (Courante)'
        };

        const coveringNames = {
            'MINCE': 'Revêtement Mince',
            'EPAIS': 'Revêtement Épais'
        };

        const aspectNames = {
            'MATE': 'Mate',
            'VELOURS': 'Velours',
            'SATINEE_BRILLANTE': 'Satinée Brillante'
        };
        
        // Remplir les nouveaux éléments
        document.getElementById('summaryType').textContent = typeNames[typeDevis] || typeDevis || '-';
        document.getElementById('summaryLevel').textContent = levelNames[niveauFinition] || niveauFinition || '-';
        document.getElementById('summaryCovering').textContent = coveringNames[typeRevetement] || typeRevetement || '-';
        
        // Afficher les aspects
        const aspectsContainer = document.getElementById('summaryAspects');
        if (aspects && aspects.length > 0) {
            aspectsContainer.innerHTML = '';
            const aspectsList = Array.isArray(aspects) ? aspects : [aspects];
            aspectsList.forEach(aspect => {
                const chip = document.createElement('span');
                chip.className = 'bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full';
                chip.textContent = aspectNames[aspect] || aspect;
                aspectsContainer.appendChild(chip);
            });
        } else {
            aspectsContainer.textContent = 'Aucun';
        }
        
        // Afficher le statut du modèle
        const templateStatusEl = document.getElementById('templateStatus');
        const templateNameEl = document.getElementById('templateName');
        
        if (this.currentQuotation.selectedTemplate) {
            templateStatusEl.textContent = '✅ Trouvé';
            templateStatusEl.className = 'font-semibold text-green-600';
            templateNameEl.textContent = this.currentQuotation.selectedTemplate['template-name'];
            templateNameEl.className = 'text-sm text-green-600 mt-1';
        } else {
            templateStatusEl.textContent = '❌ Non trouvé';
            templateStatusEl.className = 'font-semibold text-red-600';
            templateNameEl.textContent = 'Aucun modèle ne correspond aux critères sélectionnés';
            templateNameEl.className = 'text-sm text-red-600 mt-1';
        }
    }

    renderOperationsList() {
        const container = document.getElementById('operationsList');
        container.innerHTML = '';

        // Vérification défensive
        if (!this.currentQuotation.items || !Array.isArray(this.currentQuotation.items)) {
            console.warn('Aucune opération à afficher');
            container.innerHTML = '<div class="text-center text-gray-500 py-8">Aucune opération définie pour ce devis</div>';
            return;
        }

        this.currentQuotation.items.forEach((item, index) => {
            const operationCard = this.createOperationCard(item, index);
            container.appendChild(operationCard);
        });
    }

    createOperationCard(item, index) {
        // Vérifications défensives
        if (!item) {
            console.warn('Item undefined pour index:', index);
            return document.createElement('div');
        }
        
        // Initialiser l'état d'expansion si pas défini
        if (item.isExpanded === undefined) {
            item.isExpanded = false; // Par défaut fermé
        }
        
        const isOptional = !item["is-active"];
        const totalHT = this.calculateOperationTotalHierarchical(item);
        const taskCount = this.countTasksInHierarchy(item.hierarchy);
        
        const card = document.createElement('div');
        card.className = `bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${!item["is-active"] ? 'opacity-60' : ''}`;
        
        card.innerHTML = `
            <div class="p-4">
                <!-- Header de l'accordéon -->
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-3 flex-1">
                        ${this.isOperationOptional(item) ? `
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" ${item["is-active"] ? 'checked' : ''} 
                                       onchange="wizardManager.toggleOperation(${index})" 
                                       class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        ` : '<i class="fas fa-lock text-gray-400 w-11 text-center"></i>'}
                        
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-900">${item.name}</h3>
                            <p class="text-sm text-gray-500">${taskCount} tâche(s)</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-3">
                        <div class="text-right">
                            <div class="font-bold text-primary">${this.formatPrice(totalHT)}</div>
                            <div class="text-sm text-gray-500">HT</div>
                        </div>
                        
                        <button id="toggleOperation_${index}" onclick="wizardManager.toggleOperationAccordion(${index})" class="text-primary">
                            <i class="fas fa-chevron-${item.isExpanded ? 'up' : 'down'}"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Contenu de l'accordéon -->
                <div id="operationContent_${index}" class="hierarchy-container" style="display: ${item.isExpanded ? 'block' : 'none'}">
                    ${this.renderHierarchy(item.hierarchy, index, item["is-active"])}
                </div>
            </div>
        `;
        
        return card;
    }

    /**
     * Rend récursivement la hiérarchie des opérations avec indentation
     */
    renderHierarchy(hierarchy, operationIndex, parentActive = true) {
        return hierarchy.map((node, nodeIndex) => {
            const isActive = parentActive && (node["is-active"] !== false);
            const hasChildren = !node.isLeaf && node.children && node.children.length > 0;
            const indent = (node.level - 1) * 20; // Indentation progressive
            
            return `
                <div class="hierarchy-item mb-2" style="margin-left: ${indent}px;">
                    <div class="flex items-center justify-between p-3 rounded ${node.level === 1 ? 'bg-blue-50' : node.level === 2 ? 'bg-green-50' : 'bg-gray-50'} ${!isActive ? 'opacity-50' : ''}">
                        <div class="flex items-center space-x-3 flex-1">
                            <!-- Bouton expand/collapse pour les noeuds avec enfants -->
                            ${hasChildren ? `
                                <button onclick="wizardManager.toggleHierarchyNode(${operationIndex}, '${node["operation-id"]}')" 
                                        class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700">
                                    <i class="fas fa-chevron-${node["is-expanded"] ? 'down' : 'right'} text-xs"></i>
                                </button>
                            ` : '<div class="w-6"></div>'}
                            
                            <!-- Switch pour les noeuds optionnels -->
                            ${!node["is-mandatory"] ? `
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" ${node["is-active"] ? 'checked' : ''} 
                                           onchange="wizardManager.toggleHierarchyNode(${operationIndex}, '${node["operation-id"]}', 'toggle')" 
                                           class="sr-only peer" ${!parentActive ? 'disabled' : ''}>
                                    <div class="w-8 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary ${!parentActive ? 'opacity-50' : ''}"></div>
                                </label>
                            ` : '<i class="fas fa-lock text-gray-400 w-8 text-center text-xs"></i>'}
                            
                            <div class="flex-1">
                                <div class="font-medium text-gray-900 ${!isActive ? 'line-through' : ''}">${node.name}</div>
                                ${node.isLeaf && node.task ? `
                                    <div class="text-sm text-gray-500">
                                        ${node.task.superficie} ${node.task.uom} • ${node.task["nombre-tacherons"]} tâcheron(s)
                                        ${!node["is-mandatory"] ? ' • <span class="text-blue-600">Optionnel</span>' : ''}
                                    </div>
                                ` : `
                                    <div class="text-sm text-gray-500">
                                        ${!node["is-mandatory"] ? '<span class="text-blue-600">Optionnel</span>' : 'Obligatoire'}
                                    </div>
                                `}
                            </div>
                        </div>
                        
                        <div class="text-right">
                            ${node.isLeaf && node.task ? `
                                <div class="font-medium ${!isActive ? 'line-through text-gray-400' : ''}">${this.formatPrice(this.calculateTaskTotal(node.task))}</div>
                                ${parentActive && isActive ? `
                                    <button onclick="wizardManager.editTaskInHierarchy(${operationIndex}, '${node["operation-id"]}')" 
                                            class="text-primary text-sm hover:underline">
                                        Éditer
                                    </button>
                                ` : ''}
                            ` : `
                                <div class="font-medium ${!isActive ? 'line-through text-gray-400' : ''}">${this.formatPrice(this.calculateHierarchyNodeTotal(node))}</div>
                            `}
                        </div>
                    </div>
                    
                    <!-- Enfants dépliables -->
                    ${hasChildren && node["is-expanded"] ? `
                        <div class="hierarchy-children mt-2">
                            ${this.renderHierarchy(node.children, operationIndex, isActive)}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    /**
     * Calcule le total d'un noeud de hiérarchie (récursif)
     */
    calculateHierarchyNodeTotal(node) {
        if (!node["is-active"]) return 0;
        
        if (node.isLeaf && node.task) {
            return this.calculateTaskTotal(node.task);
        } else if (node.children) {
            return node.children.reduce((total, child) => {
                return total + this.calculateHierarchyNodeTotal(child);
            }, 0);
        }
        return 0;
    }

    /**
     * Calcule le total d'une opération basé sur sa hiérarchie
     */
    calculateOperationTotalHierarchical(item) {
        if (!item || !item["is-active"]) return 0;
        
        return item.hierarchy.reduce((total, node) => {
            return total + this.calculateHierarchyNodeTotal(node);
        }, 0);
    }

    createTaskSummary(task, operationIndex, taskIndex) {
        const isOperationActive = this.currentQuotation.items[operationIndex]["is-active"];
        const isTaskOptional = task["is-mandatory"] === false;
        const isTaskActive = task["is-active"] !== false; // Par défaut true si pas défini
        
        return `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded ${!isOperationActive || !isTaskActive ? 'opacity-50' : ''}">
                <div class="flex items-center space-x-3 flex-1">
                    ${isTaskOptional ? `
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${isTaskActive ? 'checked' : ''} 
                                   onchange="wizardManager.toggleTask(${operationIndex}, ${taskIndex})" 
                                   class="sr-only peer" ${!isOperationActive ? 'disabled' : ''}>
                            <div class="w-8 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary ${!isOperationActive ? 'opacity-50' : ''}"></div>
                        </label>
                    ` : '<i class="fas fa-lock text-gray-400 w-8 text-center text-xs"></i>'}
                    
                    <div class="flex-1">
                        <div class="font-medium text-gray-900 ${!isTaskActive ? 'line-through' : ''}">${task.name}</div>
                        <div class="text-sm text-gray-500">
                            ${task.superficie} ${task.uom} • ${task["nombre-tacherons"]} tâcheron(s)
                            ${isTaskOptional ? ' • <span class="text-blue-600">Optionnel</span>' : ''}
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-medium ${!isTaskActive ? 'line-through text-gray-400' : ''}">${this.formatPrice(this.calculateTaskTotal(task))}</div>
                    ${isOperationActive && isTaskActive ? `
                        <button onclick="wizardManager.editTask(${operationIndex}, ${taskIndex})" 
                                class="text-primary text-sm hover:underline">
                            Éditer
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Bascule l'état actif/inactif d'une tâche individuelle
     */
    toggleTask(operationIndex, taskIndex) {
        const operation = this.currentQuotation.items[operationIndex];
        const task = operation.tasks[taskIndex];
        
        // Basculer l'état de la tâche
        task["is-active"] = !task["is-active"];
        
        console.log(`Tâche ${task.name} ${task["is-active"] ? 'activée' : 'désactivée'}`);
        
        // Recalculer les totaux et rerender
        this.renderInterface();
        this.saveProgress();
    }

    /**
     * Vérifie si une tâche doit être incluse dans les calculs
     */
    isTaskActive(task, operationActive = true) {
        return operationActive && (task["is-active"] !== false);
    }

    isOperationOptional(item) {
        if (!this.quoteTemplate || !this.quoteTemplate['quote-operations']) {
            return false;
        }
        const template = this.quoteTemplate['quote-operations'].find(op => op['operation-id'] === item["quote-operation-id"]);
        return template && template["is-mandatory"] === false;
    }

    toggleOperation(operationIndex) {
        const item = this.currentQuotation.items[operationIndex];
        item["is-active"] = !item["is-active"];
        
        this.renderInterface();
        this.saveProgress();
    }

    /**
     * Gère l'ouverture/fermeture de l'accordéon d'une opération
     */
    toggleOperationAccordion(operationIndex) {
        const item = this.currentQuotation.items[operationIndex];
        item.isExpanded = !item.isExpanded;
        
        const content = document.getElementById(`operationContent_${operationIndex}`);
        const toggleButton = document.getElementById(`toggleOperation_${operationIndex}`);
        const icon = toggleButton.querySelector('i');
        
        if (item.isExpanded) {
            content.style.display = 'block';
            icon.className = 'fas fa-chevron-up';
        } else {
            content.style.display = 'none';
            icon.className = 'fas fa-chevron-down';
        }
        
        // Sauvegarder l'état
        this.saveProgress();
    }

    expandOperation(operationIndex) {
        // Pour l'instant, on affiche la première tâche de l'opération
        this.editTask(operationIndex, 0);
    }

    editTask(operationIndex, taskIndex) {
        this.currentEditingTask = { operationIndex, taskIndex };
        const task = this.currentQuotation.items[operationIndex].tasks[taskIndex];
        
        this.showTaskModal(task);
    }

    showTaskModal(task) {
        console.log('showTaskModal', task);
        const modal = document.getElementById('taskModal');
        const title = document.getElementById('taskModalTitle');
        const content = document.getElementById('taskModalContent');
        
        // Rendre le contenu de la modale scrollable
        content.classList.add('overflow-y-auto', 'max-h-[70vh]', 'p-6'); // Ajout de padding ici aussi
        
        title.textContent = `Éditer: ${task.name}`;
        
        content.innerHTML = `
            <div class="space-y-6">
                <!-- Informations de base -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Superficie (${task.uom})
                    </label>
                    <input type="number" id="taskSuperficie" value="${task.superficie}" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                           min="0" step="0.01" onchange="wizardManager.updateTaskQuantities()">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de tâcherons
                    </label>
                    <input type="number" id="taskTacherons" value="${task["nombre-tacherons"]}" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                           min="1" max="10">
                </div>
                
                <!-- Prix main d'œuvre -->
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-medium text-gray-900 mb-3">Main d'Œuvre</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs text-gray-600">Prix plancher</label>
                            <div class="text-sm text-gray-500">${this.formatPrice(task["laborer-price"])}</div>
                        </div>
                        <div>
                            <label class="block text-xs text-gray-600">Prix plafond</label>
                            <div class="text-sm text-gray-500">${this.formatPrice(task["base-price"])}</div>
                        </div>
                    </div>
                    <div class="mt-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Prix appliqué</label>
                        <div class="relative">
                            <input type="number" id="taskLaborPrice" value="${task["effective-price"]}" 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                   min="${task["laborer-price"]}" max="${task["base-price"]}" step="10"
                                   onchange="wizardManager.updateLaborPrice(this.value)"
                                   oninput="wizardManager.handleLaborPriceInputValidation(this)"
                                   placeholder="Entre ${this.formatPrice(task["laborer-price"])} et ${this.formatPrice(task["base-price"])}">
                            <div class="absolute right-2 top-2 text-gray-400">
                                <i class="fas fa-hammer text-sm"></i>
                            </div>
                        </div>
                        <div id="laborPriceMessage" class="text-xs mt-1 min-h-[16px]"></div>
                        <div class="flex justify-between text-xs text-gray-400 mt-1">
                            <span>Min: ${this.formatPrice(task["laborer-price"])}</span>
                            <span>Max: ${this.formatPrice(task["base-price"])}</span>
                        </div>
                    </div>
                    <div class="mt-2 text-sm">
                        <span class="text-gray-600">Total MO: </span>
                        <span id="laborTotal" class="font-medium text-primary">${this.formatPrice(task["effective-price"] * task.superficie)}</span>
                    </div>
                </div>
                
                <!-- Produits liés -->
                ${task["linked-products"].length > 0 ? `
                    <div class="bg-green-50 p-4 rounded-lg">
                        <h4 class="font-medium text-gray-900 mb-3">Produits Liés</h4>
                        <div id="linkedProducts" class="space-y-4">
                            ${task["linked-products"].map((lp, lpIndex) => this.createLinkedProductEditor(lp, lpIndex)).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Récapitulatif -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-medium text-gray-900 mb-2">Récapitulatif</h4>
                    <div class="space-y-1 text-sm">
                        <div class="flex justify-between">
                            <span>Total Main d'Œuvre:</span>
                            <span id="modalLaborTotal" class="font-medium">${this.formatPrice(task["effective-price"] * task.superficie)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Total Produits:</span>
                            <span id="modalProductsTotal" class="font-medium">${this.formatPrice(this.calculateLinkedProductsTotal(task))}</span>
                        </div>
                        <div class="flex justify-between font-bold border-t pt-1">
                            <span>Total Tâche:</span>
                            <span id="modalTaskTotal" class="text-primary">${this.formatPrice(this.calculateTaskTotal(task))}</span>
                        </div>
                    </div>
                    <div class="mt-3 flex justify-center">
                        <button onclick="wizardManager.manualPriceValidation()" 
                                class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
                            <i class="fas fa-check-double mr-2"></i>
                            Vérifier tous les prix
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        // Initialiser les validations de prix après affichage de la modal
        setTimeout(() => {
            this.initializePriceValidations();
        }, 100);
    }

    createLinkedProductEditor(linkedProduct, index) {
        const productName = linkedProduct.productInfo ? linkedProduct.productInfo.designation : linkedProduct.product;
        const productConditioning = linkedProduct.productInfo ? `(${linkedProduct.productInfo.conditioning})` : '';
        
        // Récupérer les vrais prix depuis PRODUCTS_DATA
        const productCode = linkedProduct.product;
        const technicianPrice = this.getTechnicianPrice(productCode);
        const patronPrice = this.getPatronPrice(productCode);

        return `
            <div class="border border-gray-200 rounded-lg p-3">
                <div class="font-medium text-gray-900 mb-1">${productName}</div>
                <div class="text-sm text-gray-500 mb-2">${productConditioning}</div>
                
                <div class="grid grid-cols-3 gap-2 mb-3 text-xs">
                    <div>
                        <span class="text-gray-600">Estimée:</span>
                        <div id="estimatedQty_${index}" class="font-medium">${linkedProduct["estimated-quantity"]}</div>
                    </div>
                    <div>
                        <span class="text-gray-600">Sécurité:</span>
                        <div id="safetyQty_${index}" class="font-medium">${linkedProduct["safety-quantity"]}</div>
                    </div>
                    <div>
                        <span class="text-gray-600">Total:</span>
                        <div id="totalQty_${index}" class="font-medium text-primary">${linkedProduct["ordered-quantity"]}</div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Ajustement sécurité (%)
                    </label>
                    <input type="range" id="securitySlider_${index}" 
                           value="${linkedProduct["default-security-quantity"] || 10}"
                           min="10" max="50" step="5"
                           class="w-full" 
                           onchange="wizardManager.updateProductSecurity(${index}, this.value)">
                    <div class="flex justify-between text-xs text-gray-500">
                        <span>10%</span>
                        <span id="securityValue_${index}">${linkedProduct["default-security-quantity"] || 10}%</span>
                        <span>50%</span>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs text-gray-600">Prix Technicien</label>
                        <div class="text-sm text-gray-500">${this.formatPrice(technicianPrice)}</div>
                    </div>
                    <div>
                        <label class="block text-xs text-gray-600">Prix Patron</label>
                        <div class="text-sm text-gray-500">${this.formatPrice(patronPrice)}</div>
                    </div>
                </div>
                
                <div class="mt-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Prix appliqué</label>
                    <div class="relative">
                        <input type="number" id="productPrice_${index}" value="${linkedProduct["effective-price"]}" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                               min="${technicianPrice}" max="${patronPrice}" step="10"
                               onchange="wizardManager.updateProductPrice(${index}, this.value)"
                               oninput="wizardManager.handlePriceInputValidation(${index}, this)"
                               placeholder="Entre ${this.formatPrice(technicianPrice)} et ${this.formatPrice(patronPrice)}">
                        <div class="absolute right-2 top-2 text-gray-400">
                            <i class="fas fa-coins text-sm"></i>
                        </div>
                    </div>
                    <div id="priceMessage_${index}" class="text-xs mt-1 min-h-[16px]"></div>
                    <div class="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Min: ${this.formatPrice(technicianPrice)}</span>
                        <span>Max: ${this.formatPrice(patronPrice)}</span>
                    </div>
                </div>
                
                <div class="mt-2 text-sm">
                    <span class="text-gray-600">Total: </span>
                    <span id="productTotal_${index}" class="font-medium text-primary">
                        ${this.formatPrice(linkedProduct["effective-price"] * linkedProduct["ordered-quantity"])}
                    </span>
                </div>
            </div>
        `;
    }

    updateTaskQuantities() {
        if (!this.currentEditingTask) {
            console.error('Aucune tâche en cours d\'édition');
            return;
        }

        const superficie = parseFloat(document.getElementById('taskSuperficie').value) || 0;
        const { operationIndex, taskIndex } = this.currentEditingTask;
        
        if (!this.currentQuotation || !this.currentQuotation.items || !this.currentQuotation.items[operationIndex]) {
            console.error('Opération non trouvée:', operationIndex);
            return;
        }

        const operation = this.currentQuotation.items[operationIndex];
        let task;

        // Gérer les deux structures possibles (avec hierarchy ou tasks)
        if (operation.tasks && operation.tasks[taskIndex]) {
            task = operation.tasks[taskIndex];
        } else if (operation.hierarchy && this.currentEditingTask.node && this.currentEditingTask.node.task) {
            task = this.currentEditingTask.node.task;
        } else {
            console.error('Tâche non trouvée:', taskIndex);
            return;
        }

        if (!task["linked-products"] || !Array.isArray(task["linked-products"])) {
            console.error('Produits liés non trouvés dans la tâche');
            return;
        }

        task.superficie = superficie;
        
        // Recalculer les quantités de produits liés
        task["linked-products"].forEach((lp, index) => {
            const estimatedQty = Math.ceil((superficie * (lp["nombre-couches"] || 1)) / (lp.rendement || 10));
            const securityPercent = parseFloat(document.getElementById(`securitySlider_${index}`)?.value || lp["default-security-quantity"] || 10);
            const safetyQty = Math.ceil(estimatedQty * securityPercent / 100);
            
            lp["estimated-quantity"] = estimatedQty;
            lp["safety-quantity"] = safetyQty;
            lp["ordered-quantity"] = estimatedQty + safetyQty;
            
            // Mettre à jour l'affichage
            this.updateProductQuantityDisplay(index, lp);
        });
        
        this.updateModalTotals();
    }

    updateProductQuantityDisplay(index, linkedProduct) {
        const estimatedEl = document.getElementById(`estimatedQty_${index}`);
        const safetyEl = document.getElementById(`safetyQty_${index}`);
        const totalEl = document.getElementById(`totalQty_${index}`);
        
        if (estimatedEl) estimatedEl.textContent = linkedProduct["estimated-quantity"];
        if (safetyEl) safetyEl.textContent = linkedProduct["safety-quantity"];
        if (totalEl) totalEl.textContent = linkedProduct["ordered-quantity"];
        
        const totalPriceEl = document.getElementById(`productTotal_${index}`);
        if (totalPriceEl) {
            totalPriceEl.textContent = this.formatPrice(linkedProduct["effective-price"] * linkedProduct["ordered-quantity"]);
        }
    }

    updateProductSecurity(productIndex, securityPercent) {
        if (!this.currentEditingTask) {
            console.error('Aucune tâche en cours d\'édition');
            return;
        }

        const { operationIndex, taskIndex } = this.currentEditingTask;
        
        if (!this.currentQuotation || !this.currentQuotation.items || !this.currentQuotation.items[operationIndex]) {
            console.error('Opération non trouvée:', operationIndex);
            return;
        }

        const operation = this.currentQuotation.items[operationIndex];
        let task;

        // Gérer les deux structures possibles (avec hierarchy ou tasks)
        if (operation.tasks && operation.tasks[taskIndex]) {
            task = operation.tasks[taskIndex];
        } else if (operation.hierarchy && this.currentEditingTask.node && this.currentEditingTask.node.task) {
            task = this.currentEditingTask.node.task;
        } else {
            console.error('Tâche non trouvée:', taskIndex);
            return;
        }

        if (!task["linked-products"] || !Array.isArray(task["linked-products"])) {
            console.error('Produits liés non trouvés dans la tâche');
            return;
        }

        if (!task["linked-products"][productIndex]) {
            console.error('Produit lié non trouvé à l\'index:', productIndex);
            return;
        }

        const linkedProduct = task["linked-products"][productIndex];
        linkedProduct["default-security-quantity"] = parseFloat(securityPercent);
        
        const estimatedQty = linkedProduct["estimated-quantity"];
        const safetyQty = Math.ceil(estimatedQty * securityPercent / 100);
        
        linkedProduct["safety-quantity"] = safetyQty;
        linkedProduct["ordered-quantity"] = estimatedQty + safetyQty;
        
        document.getElementById(`securityValue_${productIndex}`).textContent = `${securityPercent}%`;
        this.updateProductQuantityDisplay(productIndex, linkedProduct);
        this.updateModalTotals();
    }

    /**
     * Valide que le prix appliqué est dans l'intervalle autorisé [Prix Technicien, Prix Patron]
     * @param {string} productCode - Code du produit
     * @param {number} appliedPrice - Prix appliqué saisi par l'utilisateur
     * @returns {Object} Résultat de validation {isValid: boolean, correctedPrice: number, message: string}
     */
    validateAppliedPrice(productCode, appliedPrice) {
        const technicianPrice = this.getTechnicianPrice(productCode);
        const patronPrice = this.getPatronPrice(productCode);
        
        // Convertir en nombre et arrondir à 2 décimales
        const price = Math.round(parseFloat(appliedPrice) * 100) / 100;
        
        if (isNaN(price) || price <= 0) {
            return {
                isValid: false,
                correctedPrice: technicianPrice,
                message: "Prix invalide. Veuillez saisir un prix valide.",
                type: "error"
            };
        }
        
        if (price < technicianPrice) {
            return {
                isValid: false,
                correctedPrice: technicianPrice,
                message: `Prix trop bas. Minimum autorisé: ${this.formatPrice(technicianPrice)}`,
                type: "warning-low"
            };
        }
        
        if (price > patronPrice) {
            return {
                isValid: false,
                correctedPrice: patronPrice,
                message: `Prix trop élevé. Maximum autorisé: ${this.formatPrice(patronPrice)}`,
                type: "warning-high"
            };
        }
        
        // Prix dans la fourchette autorisée
        return {
            isValid: true,
            correctedPrice: price,
            message: "Prix valide",
            type: "success"
        };
    }

    /**
     * Affiche les messages de validation des prix avec des styles visuels
     * @param {number} productIndex - Index du produit
     * @param {Object} validation - Résultat de la validation
     */
    displayPriceValidation(productIndex, validation) {
        const inputElement = document.getElementById(`productPrice_${productIndex}`);
        const messageContainer = document.getElementById(`priceMessage_${productIndex}`);
        
        if (!inputElement || !messageContainer) {
            console.warn('Éléments de validation introuvables pour le produit:', productIndex);
            return;
        }
        
        // Supprimer les classes de validation précédentes
        inputElement.classList.remove('border-green-500', 'border-red-500', 'border-yellow-500', 'bg-red-50', 'bg-yellow-50', 'bg-green-50');
        
        // Appliquer les styles selon le type de validation
        switch (validation.type) {
            case 'success':
                inputElement.classList.add('border-green-500', 'bg-green-50');
                messageContainer.innerHTML = `<span class="text-green-600 text-xs flex items-center">
                    <i class="fas fa-check-circle mr-1"></i>${validation.message}
                </span>`;
                break;
                
            case 'warning-low':
                inputElement.classList.add('border-yellow-500', 'bg-yellow-50');
                messageContainer.innerHTML = `<span class="text-yellow-600 text-xs flex items-center">
                    <i class="fas fa-exclamation-triangle mr-1"></i>${validation.message}
                </span>`;
                break;
                
            case 'warning-high':
                inputElement.classList.add('border-yellow-500', 'bg-yellow-50');
                messageContainer.innerHTML = `<span class="text-yellow-600 text-xs flex items-center">
                    <i class="fas fa-exclamation-triangle mr-1"></i>${validation.message}
                </span>`;
                break;
                
            case 'error':
            default:
                inputElement.classList.add('border-red-500', 'bg-red-50');
                messageContainer.innerHTML = `<span class="text-red-600 text-xs flex items-center">
                    <i class="fas fa-times-circle mr-1"></i>${validation.message}
                </span>`;
                break;
        }
        
        // Auto-masquer le message de succès après 3 secondes
        if (validation.type === 'success') {
            setTimeout(() => {
                messageContainer.innerHTML = '';
                inputElement.classList.remove('border-green-500', 'bg-green-50');
            }, 3000);
        }
    }

    /**
     * Gère la validation en temps réel des prix pendant la saisie
     * @param {number} productIndex - Index du produit
     * @param {HTMLInputElement} inputElement - Élément input
     */
    handlePriceInputValidation(productIndex, inputElement) {
        const productCode = this.getProductCodeFromIndex(productIndex);
        if (!productCode) return;
        
        const validation = this.validateAppliedPrice(productCode, inputElement.value);
        this.displayPriceValidation(productIndex, validation);
        
        // Correction automatique si le prix est hors limites
        if (!validation.isValid && (validation.type === 'warning-low' || validation.type === 'warning-high')) {
            // Attendre un peu avant de corriger pour laisser l'utilisateur voir le message
            setTimeout(() => {
                inputElement.value = validation.correctedPrice;
                const successValidation = this.validateAppliedPrice(productCode, validation.correctedPrice);
                this.displayPriceValidation(productIndex, successValidation);
            }, 2000);
        }
    }

    /**
     * Récupère le code produit à partir de l'index dans la tâche courante
     * @param {number} productIndex - Index du produit
     * @returns {string|null} Code du produit ou null si non trouvé
     */
    getProductCodeFromIndex(productIndex) {
        if (!this.currentEditingTask) return null;
        
        const { operationIndex, taskIndex } = this.currentEditingTask;
        const operation = this.currentQuotation.items[operationIndex];
        let task;

        if (operation.tasks && operation.tasks[taskIndex]) {
            task = operation.tasks[taskIndex];
        } else if (operation.hierarchy && this.currentEditingTask.node && this.currentEditingTask.node.task) {
            task = this.currentEditingTask.node.task;
        }
        
        if (task && task["linked-products"] && task["linked-products"][productIndex]) {
            return task["linked-products"][productIndex].product;
        }
        
        return null;
    }

    updateProductPrice(productIndex, newPrice) {
        if (!this.currentEditingTask) {
            console.error('Aucune tâche en cours d\'édition');
            return;
        }

        const { operationIndex, taskIndex } = this.currentEditingTask;
        
        if (!this.currentQuotation || !this.currentQuotation.items || !this.currentQuotation.items[operationIndex]) {
            console.error('Opération non trouvée:', operationIndex);
            return;
        }

        const operation = this.currentQuotation.items[operationIndex];
        let task;

        // Gérer les deux structures possibles (avec hierarchy ou tasks)
        if (operation.tasks && operation.tasks[taskIndex]) {
            task = operation.tasks[taskIndex];
        } else if (operation.hierarchy && this.currentEditingTask.node && this.currentEditingTask.node.task) {
            task = this.currentEditingTask.node.task;
        } else {
            console.error('Tâche non trouvée:', taskIndex);
            return;
        }

        if (!task["linked-products"] || !Array.isArray(task["linked-products"])) {
            console.error('Produits liés non trouvés dans la tâche');
            return;
        }

        if (!task["linked-products"][productIndex]) {
            console.error('Produit lié non trouvé à l\'index:', productIndex);
            return;
        }

        const linkedProduct = task["linked-products"][productIndex];
        const productCode = linkedProduct.product;
        
        // Valider le prix avant de l'appliquer
        const validation = this.validateAppliedPrice(productCode, newPrice);
        
        // Appliquer le prix corrigé (soit le prix saisi s'il est valide, soit le prix corrigé)
        linkedProduct["effective-price"] = validation.correctedPrice;
        
        // Afficher la validation à l'utilisateur
        this.displayPriceValidation(productIndex, validation);
        
        // Mettre à jour l'affichage si le prix a été corrigé
        if (!validation.isValid) {
            const inputElement = document.getElementById(`productPrice_${productIndex}`);
            if (inputElement && inputElement.value != validation.correctedPrice) {
                setTimeout(() => {
                    inputElement.value = validation.correctedPrice;
                }, 2000);
            }
        }
        
        this.updateProductQuantityDisplay(productIndex, linkedProduct);
        this.updateModalTotals();
    }

    updateModalTotals() {
        if (!this.currentEditingTask) {
            console.warn('Aucune tâche en cours d\'édition pour updateModalTotals');
            return;
        }
        
        const { operationIndex, taskIndex } = this.currentEditingTask;
        
        if (!this.currentQuotation || !this.currentQuotation.items || !this.currentQuotation.items[operationIndex]) {
            console.error('Opération non trouvée pour updateModalTotals:', operationIndex);
            return;
        }

        const operation = this.currentQuotation.items[operationIndex];
        let task;

        // Gérer les deux structures possibles (avec hierarchy ou tasks)
        if (operation.tasks && operation.tasks[taskIndex]) {
            task = operation.tasks[taskIndex];
        } else if (operation.hierarchy && this.currentEditingTask.node && this.currentEditingTask.node.task) {
            task = this.currentEditingTask.node.task;
        } else {
            console.error('Tâche non trouvée pour updateModalTotals:', taskIndex);
            return;
        }
        
        const laborPrice = parseFloat(document.getElementById('taskLaborPrice')?.value || task["effective-price"]);
        const superficie = parseFloat(document.getElementById('taskSuperficie')?.value || task.superficie);
        
        const laborTotal = laborPrice * superficie;
        const productsTotal = this.calculateLinkedProductsTotal(task);
        const taskTotal = laborTotal + productsTotal;
        
        const laborTotalEl = document.getElementById('laborTotal');
        const modalLaborTotalEl = document.getElementById('modalLaborTotal');
        const modalProductsTotalEl = document.getElementById('modalProductsTotal');
        const modalTaskTotalEl = document.getElementById('modalTaskTotal');
        
        if (laborTotalEl) laborTotalEl.textContent = this.formatPrice(laborTotal);
        if (modalLaborTotalEl) modalLaborTotalEl.textContent = this.formatPrice(laborTotal);
        if (modalProductsTotalEl) modalProductsTotalEl.textContent = this.formatPrice(productsTotal);
        if (modalTaskTotalEl) modalTaskTotalEl.textContent = this.formatPrice(taskTotal);
    }

    calculateLinkedProductsTotal(task) {
        // Si la tâche est inactive, ne pas compter les produits
        if (task["is-active"] === false) {
            return 0;
        }
        
        if (!task["linked-products"] || !Array.isArray(task["linked-products"])) {
            return 0;
        }
        return task["linked-products"].reduce((total, lp) => {
            const productTotal = (lp["effective-price"] || 0) * (lp["ordered-quantity"] || 0);
            return total + productTotal;
        }, 0);
    }

    calculateTaskTotal(task) {
        // Si la tâche est inactive, retourner 0
        if (task["is-active"] === false) {
            return 0;
        }
        
        const laborTotal = task["effective-price"] * task.superficie;
        const productsTotal = this.calculateLinkedProductsTotal(task);
        return laborTotal + productsTotal;
    }

    calculateOperationTotal(item) {
        if (!item || !item["is-active"]) return 0;
        
        if (!item.tasks || !Array.isArray(item.tasks)) {
            console.warn('Tasks non définies pour item:', item);
            return 0;
        }
        
        return item.tasks.reduce((total, task) => {
            // Ne compter que les tâches actives
            if (task["is-active"] !== false) {
                return total + this.calculateTaskTotal(task);
            }
            return total;
        }, 0);
    }

    saveTaskChanges() {
        if (!this.currentEditingTask) return;
        
        const { operationIndex, nodeId, node } = this.currentEditingTask;
        
        if (!node || !node.task) {
            console.warn('Tâche non trouvée pour sauvegarder les changements');
            return;
        }
        
        const task = node.task;
        
        // Sauvegarder les modifications
        const oldSuperficie = task.superficie;
        task.superficie = parseFloat(document.getElementById('taskSuperficie').value) || 0;
        task["nombre-tacherons"] = parseInt(document.getElementById('taskTacherons').value) || 1;
        task["effective-price"] = parseFloat(document.getElementById('taskLaborPrice').value) || task["effective-price"];
        
        // Recalculer les quantités de produits si la superficie a changé
        if (oldSuperficie !== task.superficie) {
            this.recalculateProductQuantities(task);
        }
        
        this.closeTaskModal();
        this.renderInterface();
        this.saveProgress();
    }

    closeTaskModal() {
        // Effectuer une validation finale des prix avant fermeture
        const validation = this.validateAllPricesInModal();
        this.displayPriceValidationSummary(validation);
        
        // Si des erreurs critiques, afficher un avertissement
        if (!validation.isValid) {
            console.warn('Modal fermée avec des erreurs de prix:', validation.errors);
            
            // Optionnel: Afficher une notification toast
            if (window.showToast) {
                window.showToast(`⚠️ Attention: ${validation.errors.length} erreur(s) de prix détectée(s)`, 'warning');
            }
        }
        
        document.getElementById('taskModal').classList.add('hidden');
        this.currentEditingTask = null;
    }

    activateAllOptional() {
        this.currentQuotation.items.forEach(item => {
            if (this.isOperationOptional(item)) {
                item["is-active"] = true;
                // Activer aussi toutes les tâches optionnelles dans la hiérarchie
                this.activateOptionalInHierarchy(item.hierarchy);
            }
        });
        this.renderInterface();
        this.saveProgress();
    }

    /**
     * Active récursivement toutes les tâches optionnelles dans une hiérarchie
     */
    activateOptionalInHierarchy(hierarchy) {
        hierarchy.forEach(node => {
            if (!node["is-mandatory"]) {
                node["is-active"] = true;
            }
            if (node.children) {
                this.activateOptionalInHierarchy(node.children);
            }
        });
    }

    deactivateAllOptional() {
        this.currentQuotation.items.forEach(item => {
            if (this.isOperationOptional(item)) {
                item["is-active"] = false;
            }
        });
        this.renderInterface();
        this.saveProgress();
    }

    updateTotals() {
        const totalHT = this.currentQuotation.items.reduce((total, item) => {
            return total + this.calculateOperationTotalHierarchical(item);
        }, 0);
        
        const estimatedDays = this.calculateEstimatedDuration();
        
        document.getElementById('summaryTotal').textContent = this.formatPrice(totalHT);
        document.getElementById('summaryDuration').textContent = `${estimatedDays} jours`;
        
        // Mettre à jour les données du devis
        if (!this.currentQuotation.financialDetails) {
            this.currentQuotation.financialDetails = new FinancialDetails();
        }
        this.currentQuotation.financialDetails["total-price-ht"] = totalHT;
        this.currentQuotation.financialDetails["final-price"] = totalHT;
        
        if (!this.currentQuotation.planning) {
            this.currentQuotation.planning = new Planning();
        }
        this.currentQuotation.planning["estimated-executions"] = estimatedDays;
    }

    calculateEstimatedDuration() {
        // Calcul simplifié de la durée basée sur la superficie totale et le nombre de tâcherons
        let totalDays = 0;
        
        this.currentQuotation.items.forEach(item => {
            if (item["is-active"]) {
                totalDays += this.calculateDurationForHierarchy(item.hierarchy);
            }
        });
        
        return Math.max(1, totalDays); // Au minimum 1 jour
    }

    /**
     * Calcule la durée récursivement pour une hiérarchie
     */
    calculateDurationForHierarchy(hierarchy) {
        let totalDays = 0;
        
        hierarchy.forEach(node => {
            if (node["is-active"]) {
                if (node.isLeaf && node.task) {
                    // Formule simplifiée: 1 jour pour 20m² par tâcheron
                    const daysForTask = Math.ceil(node.task.superficie / (20 * node.task["nombre-tacherons"]));
                    totalDays += daysForTask;
                } else if (node.children) {
                    totalDays += this.calculateDurationForHierarchy(node.children);
                }
            }
        });
        
        return totalDays;
    }

    formatPrice(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount).replace('XAF', 'FCFA');
    }

    saveProgress() {
        this.updateTotals();
        localStorage.setItem('currentQuotation', JSON.stringify(this.currentQuotation));
        console.log('Progression sauvegardée automatiquement');
    }

    goToStep3() {
        // Valider que toutes les tâches actives ont une superficie > 0
        const activeItems = this.currentQuotation.items.filter(item => item["is-active"]);
        let hasErrors = false;
        let errorMessage = '';
        
        for (const item of activeItems) {
            const validation = this.validateHierarchyTasks(item.hierarchy, item.name);
            if (validation.hasError) {
                errorMessage = validation.message;
                hasErrors = true;
                break;
            }
        }
        
        if (hasErrors) {
            alert(errorMessage);
            return;
        }
        
        this.saveProgress();
        window.location.href = 'create-step3.html';
    }

    /**
     * Valide récursivement les tâches dans une hiérarchie
     */
    validateHierarchyTasks(hierarchy, operationName) {
        for (const node of hierarchy) {
            if (node["is-active"]) {
                if (node.isLeaf && node.task) {
                    if (!node.task.superficie || node.task.superficie <= 0) {
                        return {
                            hasError: true,
                            message: `Erreur: La superficie de "${node.task.name}" dans "${operationName}" doit être supérieure à 0.`
                        };
                    }
                } else if (node.children) {
                    const childValidation = this.validateHierarchyTasks(node.children, operationName);
                    if (childValidation.hasError) {
                        return childValidation;
                    }
                }
            }
        }
        return { hasError: false };
    }

    goBack() {
        if (confirm('Êtes-vous sûr de vouloir revenir à l\'étape précédente ? Vos modifications seront sauvegardées.')) {
            this.saveProgress();
            window.location.href = 'create-step1.html';
        }
    }

    showHelp() {
        alert('Aide:\n\n' +
              '1. Activez/désactivez les opérations optionnelles avec les interrupteurs\n' +
              '2. Cliquez sur "Éditer" pour modifier les détails d\'une tâche\n' +
              '3. Ajustez les superficies, prix et quantités selon vos besoins\n' +
              '4. Les totaux sont calculés automatiquement\n' +
              '5. Utilisez "Actions Rapides" pour des modifications en lot');
    }

    displayTechnicalCriteria() {
        // Cette fonction est maintenant intégrée dans updateSummary()
        // On garde juste le log pour debug
        console.log('=== CRITÈRES AFFICHÉS DANS L\'INTERFACE ===');
        console.log('Type:', this.currentQuotation.typeDevis);
        console.log('Niveau:', this.currentQuotation.finishingLevel);
        console.log('Revêtement:', this.currentQuotation.coveringType);
        console.log('Aspects:', this.currentQuotation.finishingAspects);
        console.log('Modèle sélectionné:', this.currentQuotation.selectedTemplate?.['template-name'] || 'Aucun');
    }

    /**
     * Gère l'expansion/réduction et l'activation/désactivation des nœuds de hiérarchie
     */
    toggleHierarchyNode(operationIndex, nodeId, action = 'expand') {
        const operation = this.currentQuotation.items[operationIndex];
        const node = this.findNodeInHierarchy(operation.hierarchy, nodeId);
        
        if (!node) {
            console.warn('Nœud non trouvé:', nodeId);
            return;
        }
        
        if (action === 'expand') {
            // Basculer l'état d'expansion
            node["is-expanded"] = !node["is-expanded"];
        } else if (action === 'toggle') {
            // Basculer l'état actif/inactif
            node["is-active"] = !node["is-active"];
            
            // Si on désactive un parent, désactiver tous ses enfants
            if (!node["is-active"] && node.children) {
                this.deactivateNodeChildren(node);
            }
            
            console.log(`Nœud ${node.name} ${node["is-active"] ? 'activé' : 'désactivé'}`);
        }
        
        this.renderInterface();
        this.saveProgress();
    }

    /**
     * Trouve un nœud dans la hiérarchie par son ID
     */
    findNodeInHierarchy(hierarchy, nodeId) {
        for (const node of hierarchy) {
            if (node["operation-id"] === nodeId) {
                return node;
            }
            if (node.children) {
                const found = this.findNodeInHierarchy(node.children, nodeId);
                if (found) return found;
            }
        }
        return null;
    }

    /**
     * Désactive récursivement tous les enfants d'un nœud
     */
    deactivateNodeChildren(node) {
        if (node.children) {
            node.children.forEach(child => {
                child["is-active"] = false;
                this.deactivateNodeChildren(child);
            });
        }
    }

    /**
     * Édite une tâche dans la hiérarchie
     */
    editTaskInHierarchy(operationIndex, nodeId) {
        const operation = this.currentQuotation.items[operationIndex];
        const node = this.findNodeInHierarchy(operation.hierarchy, nodeId);
        
        if (!node || !node.isLeaf || !node.task) {
            console.warn('Tâche non trouvée ou non éditable:', nodeId);
            return;
        }
        
        this.currentEditingTask = { 
            operationIndex, 
            nodeId,
            node: node 
        };
        
        this.showTaskModal(node.task);
    }

    /**
     * Valide que le prix de main d'œuvre appliqué est dans l'intervalle autorisé [Prix Tâcheron, Prix Base]
     * @param {number} appliedPrice - Prix appliqué saisi par l'utilisateur
     * @param {number} laborerPrice - Prix plancher (tâcheron)
     * @param {number} basePrice - Prix plafond (base)
     * @returns {Object} Résultat de validation {isValid: boolean, correctedPrice: number, message: string}
     */
    validateLaborPrice(appliedPrice, laborerPrice, basePrice) {
        // Convertir en nombre et arrondir à 2 décimales
        const price = Math.round(parseFloat(appliedPrice) * 100) / 100;
        
        if (isNaN(price) || price <= 0) {
            return {
                isValid: false,
                correctedPrice: laborerPrice,
                message: "Prix invalide. Veuillez saisir un prix valide.",
                type: "error"
            };
        }
        
        if (price < laborerPrice) {
            return {
                isValid: false,
                correctedPrice: laborerPrice,
                message: `Prix trop bas. Minimum autorisé: ${this.formatPrice(laborerPrice)}`,
                type: "warning-low"
            };
        }
        
        if (price > basePrice) {
            return {
                isValid: false,
                correctedPrice: basePrice,
                message: `Prix trop élevé. Maximum autorisé: ${this.formatPrice(basePrice)}`,
                type: "warning-high"
            };
        }
        
        // Prix dans la fourchette autorisée
        return {
            isValid: true,
            correctedPrice: price,
            message: "Prix valide",
            type: "success"
        };
    }

    /**
     * Affiche les messages de validation des prix de main d'œuvre avec des styles visuels
     * @param {Object} validation - Résultat de la validation
     */
    displayLaborPriceValidation(validation) {
        const inputElement = document.getElementById('taskLaborPrice');
        const messageContainer = document.getElementById('laborPriceMessage');
        
        if (!inputElement || !messageContainer) {
            console.warn('Éléments de validation de prix MO introuvables');
            return;
        }
        
        // Supprimer les classes de validation précédentes
        inputElement.classList.remove('border-green-500', 'border-red-500', 'border-yellow-500', 'bg-red-50', 'bg-yellow-50', 'bg-green-50');
        
        // Appliquer les styles selon le type de validation
        switch (validation.type) {
            case 'success':
                inputElement.classList.add('border-green-500', 'bg-green-50');
                messageContainer.innerHTML = `<span class="text-green-600 text-xs flex items-center">
                    <i class="fas fa-check-circle mr-1"></i>${validation.message}
                </span>`;
                break;
                
            case 'warning-low':
                inputElement.classList.add('border-yellow-500', 'bg-yellow-50');
                messageContainer.innerHTML = `<span class="text-yellow-600 text-xs flex items-center">
                    <i class="fas fa-exclamation-triangle mr-1"></i>${validation.message}
                </span>`;
                break;
                
            case 'warning-high':
                inputElement.classList.add('border-yellow-500', 'bg-yellow-50');
                messageContainer.innerHTML = `<span class="text-yellow-600 text-xs flex items-center">
                    <i class="fas fa-exclamation-triangle mr-1"></i>${validation.message}
                </span>`;
                break;
                
            case 'error':
            default:
                inputElement.classList.add('border-red-500', 'bg-red-50');
                messageContainer.innerHTML = `<span class="text-red-600 text-xs flex items-center">
                    <i class="fas fa-times-circle mr-1"></i>${validation.message}
                </span>`;
                break;
        }
        
        // Auto-masquer le message de succès après 3 secondes
        if (validation.type === 'success') {
            setTimeout(() => {
                messageContainer.innerHTML = '';
                inputElement.classList.remove('border-green-500', 'bg-green-50');
            }, 3000);
        }
    }

    /**
     * Gère la validation en temps réel des prix de main d'œuvre pendant la saisie
     * @param {HTMLInputElement} inputElement - Élément input
     */
    handleLaborPriceInputValidation(inputElement) {
        if (!this.currentEditingTask) return;
        
        const { operationIndex, taskIndex } = this.currentEditingTask;
        const operation = this.currentQuotation.items[operationIndex];
        let task;

        if (operation.tasks && operation.tasks[taskIndex]) {
            task = operation.tasks[taskIndex];
        } else if (operation.hierarchy && this.currentEditingTask.node && this.currentEditingTask.node.task) {
            task = this.currentEditingTask.node.task;
        }
        
        if (!task) return;
        
        const validation = this.validateLaborPrice(inputElement.value, task["laborer-price"], task["base-price"]);
        this.displayLaborPriceValidation(validation);
        
        // Correction automatique si le prix est hors limites
        if (!validation.isValid && (validation.type === 'warning-low' || validation.type === 'warning-high')) {
            setTimeout(() => {
                inputElement.value = validation.correctedPrice;
                const successValidation = this.validateLaborPrice(validation.correctedPrice, task["laborer-price"], task["base-price"]);
                this.displayLaborPriceValidation(successValidation);
            }, 2000);
        }
    }

    /**
     * Met à jour le prix de main d'œuvre avec validation
     * @param {number} newPrice - Nouveau prix saisi
     */
    updateLaborPrice(newPrice) {
        if (!this.currentEditingTask) {
            console.error('Aucune tâche en cours d\'édition');
            return;
        }

        const { operationIndex, taskIndex } = this.currentEditingTask;
        const operation = this.currentQuotation.items[operationIndex];
        let task;

        if (operation.tasks && operation.tasks[taskIndex]) {
            task = operation.tasks[taskIndex];
        } else if (operation.hierarchy && this.currentEditingTask.node && this.currentEditingTask.node.task) {
            task = this.currentEditingTask.node.task;
        } else {
            console.error('Tâche non trouvée pour updateLaborPrice');
            return;
        }
        
        // Valider le prix avant de l'appliquer
        const validation = this.validateLaborPrice(newPrice, task["laborer-price"], task["base-price"]);
        
        // Appliquer le prix corrigé
        task["effective-price"] = validation.correctedPrice;
        
        // Afficher la validation à l'utilisateur
        this.displayLaborPriceValidation(validation);
        
        // Mettre à jour l'affichage si le prix a été corrigé
        if (!validation.isValid) {
            const inputElement = document.getElementById('taskLaborPrice');
            if (inputElement && inputElement.value != validation.correctedPrice) {
                setTimeout(() => {
                    inputElement.value = validation.correctedPrice;
                }, 2000);
            }
        }
        
        // Mettre à jour le total MO affiché
        const laborTotalElement = document.getElementById('laborTotal');
        if (laborTotalElement) {
            laborTotalElement.textContent = this.formatPrice(task["effective-price"] * task.superficie);
        }
        
        this.updateModalTotals();
    }

    /**
     * Initialise les validations de prix pour la modal ouverte
     * Valide les prix actuels et affiche les statuts initiaux
     */
    initializePriceValidations() {
        if (!this.currentEditingTask) return;
        
        const { operationIndex, taskIndex } = this.currentEditingTask;
        const operation = this.currentQuotation.items[operationIndex];
        let task;

        if (operation.tasks && operation.tasks[taskIndex]) {
            task = operation.tasks[taskIndex];
        } else if (operation.hierarchy && this.currentEditingTask.node && this.currentEditingTask.node.task) {
            task = this.currentEditingTask.node.task;
        }
        
        if (!task) return;
        
        // Valider le prix de main d'œuvre
        const laborValidation = this.validateLaborPrice(task["effective-price"], task["laborer-price"], task["base-price"]);
        this.displayLaborPriceValidation(laborValidation);
        
        // Valider les prix des produits liés
        if (task["linked-products"] && Array.isArray(task["linked-products"])) {
            task["linked-products"].forEach((linkedProduct, index) => {
                const productCode = linkedProduct.product;
                const productValidation = this.validateAppliedPrice(productCode, linkedProduct["effective-price"]);
                this.displayPriceValidation(index, productValidation);
            });
        }
    }

    /**
     * Fonction utilitaire pour formater et afficher un indicateur de fourchette de prix
     * @param {number} minPrice - Prix minimum
     * @param {number} maxPrice - Prix maximum  
     * @param {number} currentPrice - Prix actuel
     * @returns {string} Indicateur visuel de position dans la fourchette
     */
    getPriceRangeIndicator(minPrice, maxPrice, currentPrice) {
        if (currentPrice < minPrice || currentPrice > maxPrice) {
            return `<span class="text-red-500">⚠️ Hors fourchette</span>`;
        }
        
        const range = maxPrice - minPrice;
        const position = ((currentPrice - minPrice) / range) * 100;
        
        let indicator = '';
        let color = '';
        
        if (position <= 25) {
            indicator = '📉 Bas';
            color = 'text-yellow-600';
        } else if (position <= 75) {
            indicator = '📊 Moyen';
            color = 'text-green-600';
        } else {
            indicator = '📈 Haut';
            color = 'text-blue-600';
        }
        
        return `<span class="${color}">${indicator} (${Math.round(position)}%)</span>`;
    }

    /**
     * Valide tous les prix de la modal avant fermeture
     * @returns {Object} Résultat de validation globale {isValid: boolean, warnings: Array, errors: Array}
     */
    validateAllPricesInModal() {
        if (!this.currentEditingTask) {
            return { isValid: false, warnings: [], errors: ['Aucune tâche en cours d\'édition'] };
        }
        
        const { operationIndex, taskIndex } = this.currentEditingTask;
        const operation = this.currentQuotation.items[operationIndex];
        let task;

        if (operation.tasks && operation.tasks[taskIndex]) {
            task = operation.tasks[taskIndex];
        } else if (operation.hierarchy && this.currentEditingTask.node && this.currentEditingTask.node.task) {
            task = this.currentEditingTask.node.task;
        }
        
        if (!task) {
            return { isValid: false, warnings: [], errors: ['Tâche non trouvée'] };
        }
        
        let warnings = [];
        let errors = [];
        let isValid = true;
        
        // Valider le prix de main d'œuvre
        const laborValidation = this.validateLaborPrice(task["effective-price"], task["laborer-price"], task["base-price"]);
        if (!laborValidation.isValid) {
            errors.push(`Main d'œuvre: ${laborValidation.message}`);
            isValid = false;
        } else {
            // Avertissement si prix proche des limites
            const range = task["base-price"] - task["laborer-price"];
            const position = ((task["effective-price"] - task["laborer-price"]) / range) * 100;
            
            if (position <= 10) {
                warnings.push(`Main d'œuvre: Prix très proche du minimum (${Math.round(position)}%)`);
            } else if (position >= 90) {
                warnings.push(`Main d'œuvre: Prix très proche du maximum (${Math.round(position)}%)`);
            }
        }
        
        // Valider les prix des produits liés
        if (task["linked-products"] && Array.isArray(task["linked-products"])) {
            task["linked-products"].forEach((linkedProduct, index) => {
                const productCode = linkedProduct.product;
                const productValidation = this.validateAppliedPrice(productCode, linkedProduct["effective-price"]);
                
                if (!productValidation.isValid) {
                    const productName = linkedProduct.productInfo ? linkedProduct.productInfo.designation : productCode;
                    errors.push(`${productName}: ${productValidation.message}`);
                    isValid = false;
                } else {
                    // Avertissement si prix proche des limites
                    const technicianPrice = this.getTechnicianPrice(productCode);
                    const patronPrice = this.getPatronPrice(productCode);
                    const range = patronPrice - technicianPrice;
                    const position = ((linkedProduct["effective-price"] - technicianPrice) / range) * 100;
                    
                    if (position <= 10) {
                        const productName = linkedProduct.productInfo ? linkedProduct.productInfo.designation : productCode;
                        warnings.push(`${productName}: Prix très proche du minimum (${Math.round(position)}%)`);
                    } else if (position >= 90) {
                        const productName = linkedProduct.productInfo ? linkedProduct.productInfo.designation : productCode;
                        warnings.push(`${productName}: Prix très proche du maximum (${Math.round(position)}%)`);
                    }
                }
            });
        }
        
        return { isValid, warnings, errors };
    }

    /**
     * Affiche un récapitulatif des validations de prix sous forme de notification
     * @param {Object} validation - Résultat de la validation globale
     */
    displayPriceValidationSummary(validation) {
        const summaryContainer = document.getElementById('priceValidationSummary');
        if (!summaryContainer) {
            // Créer le conteneur s'il n'existe pas
            const container = document.createElement('div');
            container.id = 'priceValidationSummary';
            container.className = 'mt-4 p-3 rounded-lg border';
            
            const modalContent = document.getElementById('taskModalContent');
            if (modalContent) {
                modalContent.appendChild(container);
            }
        }
        
        const summaryElement = document.getElementById('priceValidationSummary');
        
        if (validation.errors.length === 0 && validation.warnings.length === 0) {
            summaryElement.innerHTML = `
                <div class="flex items-center text-green-600">
                    <i class="fas fa-check-circle mr-2"></i>
                    <span class="font-medium">Tous les prix sont valides</span>
                </div>
            `;
            summaryElement.className = 'mt-4 p-3 rounded-lg border border-green-200 bg-green-50';
        } else {
            let content = '';
            
            if (validation.errors.length > 0) {
                content += `
                    <div class="text-red-600 mb-2">
                        <div class="flex items-center font-medium mb-1">
                            <i class="fas fa-times-circle mr-2"></i>
                            Erreurs de prix (${validation.errors.length})
                        </div>
                        <ul class="text-sm list-disc list-inside ml-4">
                            ${validation.errors.map(error => `<li>${error}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
            
            if (validation.warnings.length > 0) {
                content += `
                    <div class="text-yellow-600">
                        <div class="flex items-center font-medium mb-1">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            Avertissements (${validation.warnings.length})
                        </div>
                        <ul class="text-sm list-disc list-inside ml-4">
                            ${validation.warnings.map(warning => `<li>${warning}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
            
            summaryElement.innerHTML = content;
            
            if (validation.errors.length > 0) {
                summaryElement.className = 'mt-4 p-3 rounded-lg border border-red-200 bg-red-50';
            } else {
                summaryElement.className = 'mt-4 p-3 rounded-lg border border-yellow-200 bg-yellow-50';
            }
        }
    }

    /**
     * Génère des recommandations de prix basées sur la position dans la fourchette
     * @param {number} minPrice - Prix minimum
     * @param {number} maxPrice - Prix maximum
     * @param {number} currentPrice - Prix actuel
     * @returns {string} Recommandation textuelle
     */
    getPriceRecommendation(minPrice, maxPrice, currentPrice) {
        const range = maxPrice - minPrice;
        const position = ((currentPrice - minPrice) / range) * 100;
        const optimalMin = minPrice + (range * 0.3); // 30% de la fourchette
        const optimalMax = minPrice + (range * 0.7); // 70% de la fourchette
        
        if (position < 30) {
            return `💡 Suggestion: Vous pourriez augmenter le prix jusqu'à ${this.formatPrice(optimalMax)} pour une meilleure marge.`;
        } else if (position > 70) {
            return `⚠️ Attention: Prix élevé. Considérez ${this.formatPrice(optimalMin)} pour être plus compétitif.`;
        } else {
            return `✅ Prix dans la fourchette optimale.`;
        }
    }

    /**
     * Effectue une validation manuelle des prix déclenchée par l'utilisateur
     * Affiche un résumé détaillé avec recommandations
     */
    manualPriceValidation() {
        const validation = this.validateAllPricesInModal();
        this.displayPriceValidationSummary(validation);
        
        // Scroll vers le résumé de validation pour s'assurer qu'il est visible
        setTimeout(() => {
            const summaryElement = document.getElementById('priceValidationSummary');
            if (summaryElement) {
                summaryElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);
        
        // Afficher une notification toast selon le résultat
        if (validation.isValid) {
            if (validation.warnings.length === 0) {
                if (window.showToast) {
                    window.showToast('✅ Tous les prix sont parfaitement configurés!', 'success');
                }
            } else {
                if (window.showToast) {
                    window.showToast(`⚠️ Prix valides avec ${validation.warnings.length} avertissement(s)`, 'warning');
                }
            }
        } else {
            if (window.showToast) {
                window.showToast(`❌ ${validation.errors.length} erreur(s) de prix à corriger`, 'error');
            }
        }
        
        console.log('Validation manuelle des prix:', validation);
    }
}

// Variables globales
let wizardManager;

// Initialisation quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    wizardManager = new WizardStep2Manager();
});

// Fonctions globales pour les handlers onclick
function goBack() {
    wizardManager.goBack();
}

function goToStep3() {
    wizardManager.goToStep3();
}

function showHelp() {
    wizardManager.showHelp();
}

function activateAllOptional() {
    wizardManager.activateAllOptional();
}

function deactivateAllOptional() {
    wizardManager.deactivateAllOptional();
}

function closeTaskModal() {
    wizardManager.closeTaskModal();
}

function saveTaskChanges() {
    wizardManager.saveTaskChanges();
}

function toggleOperationAccordion(operationIndex) {
    wizardManager.toggleOperationAccordion(operationIndex);
}