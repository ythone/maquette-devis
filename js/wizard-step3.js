// ===============================================
// WIZARD STEP 3: Finalisation Financière
// ===============================================

class WizardStep3Manager {
    constructor() {
        this.currentQuotation = null;
        this.calculator = new DevisCalculator();
        this.marginAnalysis = {
            marginProducts: 0,
            marginLabor: 0,
            marginTotal: 0,
            discountImpact: 0,
            netGain: 0
        };
        
        this.init();
    }

    init() {
        this.loadQuotationData();
        this.setupEventListeners();
        this.calculateAll();
        this.renderInterface();
    }

    loadQuotationData() {
        const savedData = localStorage.getItem('currentQuotation');
        if (!savedData) {
            console.error('Aucune donnée de devis trouvée');
            alert('Erreur: Aucune donnée de devis. Retour à l\'étape précédente.');
            window.location.href = 'create-step2.html';
            return;
        }

        try {
            this.currentQuotation = JSON.parse(savedData);
            console.log('Données chargées pour étape 3:', this.currentQuotation);
            
            // Valider la structure des données
            if (!this.validateQuotationData()) {
                console.error('Structure de données invalide');
                alert('Erreur: Données de devis corrompues. Retour à l\'étape précédente.');
                window.location.href = 'create-step2.html';
                return;
            }
            
        } catch (error) {
            console.error('Erreur lors du parsing des données:', error);
            alert('Erreur: Données de devis corrompues. Retour à l\'étape précédente.');
            window.location.href = 'create-step2.html';
            return;
        }

        // Initialiser les données financières si nécessaire
        if (!this.currentQuotation.financialDetails) {
            this.currentQuotation.financialDetails = new FinancialDetails();
        }
        if (!this.currentQuotation.planning) {
            this.currentQuotation.planning = new Planning();
        }
        
        // Diagnostiquer la structure des données
        this.diagnosticData();
    }

    /**
     * Valide la structure des données du devis
     */
    validateQuotationData() {
        if (!this.currentQuotation) {
            console.error('Devis null ou undefined');
            return false;
        }

        if (!this.currentQuotation.items || !Array.isArray(this.currentQuotation.items)) {
            console.error('Aucun item trouvé dans le devis ou items n\'est pas un array');
            return false;
        }

        if (this.currentQuotation.items.length === 0) {
            console.error('Aucun item dans le devis');
            return false;
        }

        // Vérifier qu'au moins un item a une structure valide
        let hasValidStructure = false;
        this.currentQuotation.items.forEach((item, index) => {
            if (item.hierarchy && Array.isArray(item.hierarchy)) {
                hasValidStructure = true;
                console.log(`Item ${index}: Structure hiérarchique détectée`);
            } else if (item.tasks && Array.isArray(item.tasks)) {
                hasValidStructure = true;
                console.log(`Item ${index}: Structure plate de tâches détectée`);
            } else {
                console.warn(`Item ${index}: Structure non reconnue`, item);
            }
        });

        return hasValidStructure;
    }

    /**
     * Diagnostic détaillé de la structure des données
     */
    diagnosticData() {
        console.group('🔍 Diagnostic des données du devis');
        
        console.log('Structure générale:', {
            totalItems: this.currentQuotation.items?.length || 0,
            hasFinancialDetails: !!this.currentQuotation.financialDetails,
            hasPlanning: !!this.currentQuotation.planning,
            hasClient: !!this.currentQuotation.client
        });

        if (this.currentQuotation.items) {
            this.currentQuotation.items.forEach((item, index) => {
                console.log(`Item ${index} (${item.name}):`, {
                    isActive: item["is-active"],
                    hasHierarchy: !!item.hierarchy,
                    hasTasks: !!item.tasks,
                    hierarchyLength: item.hierarchy?.length || 0,
                    tasksLength: item.tasks?.length || 0
                });

                if (item.hierarchy) {
                    this.diagnosticHierarchy(item.hierarchy, `Item ${index}`);
                }
            });
        }
        
        console.groupEnd();
    }

    /**
     * Diagnostic récursif d'une hiérarchie
     */
    diagnosticHierarchy(hierarchy, parentName = '') {
        if (!Array.isArray(hierarchy)) return;
        
        hierarchy.forEach((node, index) => {
            const nodeName = `${parentName}.${index}`;
            console.log(`${nodeName} (${node.name}):`, {
                isActive: node["is-active"],
                isLeaf: node.isLeaf,
                hasTask: !!node.task,
                hasChildren: !!node.children,
                childrenLength: node.children?.length || 0
            });

            if (node.isLeaf && node.task) {
                console.log(`  └─ Tâche:`, {
                    superficie: node.task.superficie,
                    effectivePrice: node.task["effective-price"],
                    laborerPrice: node.task["laborer-price"],
                    linkedProductsCount: node.task["linked-products"]?.length || 0
                });
            }

            if (node.children) {
                this.diagnosticHierarchy(node.children, nodeName);
            }
        });
    }

    setupEventListeners() {
        // Sauvegarde automatique
        setInterval(() => {
            this.saveProgress();
        }, 30000);
    }

    calculateAll() {
        this.calculateSubtotal();
        this.calculateMargins();
        this.updateDiscount();
        this.updateDeposit();
        this.updateDuration();
    }

    /**
     * Met à jour la durée d'exécution du devis
     */
    updateDuration() {
        if (!this.currentQuotation.planning) {
            this.currentQuotation.planning = new Planning();
        }
        
        // Calculer la durée estimée basée sur les tâches actives
        let totalDuration = this.calculateEstimatedDuration();
        
        // Mettre à jour la durée dans les données du devis
        this.currentQuotation.planning["estimated-executions"] = totalDuration;
        
        // Mettre à jour l'affichage si les éléments existent
        const estimatedDurationElement = document.getElementById('estimatedDuration');
        if (estimatedDurationElement) {
            estimatedDurationElement.textContent = `${totalDuration} jours`;
        }
        
        const clientDurationInput = document.getElementById('clientDuration');
        if (clientDurationInput && !clientDurationInput.value) {
            clientDurationInput.value = totalDuration;
        }
    }

    /**
     * Calcule la durée estimée d'exécution basée sur les tâches
     */
    calculateEstimatedDuration() {
        let totalDays = 0;
        
        if (!this.currentQuotation || !this.currentQuotation.items) {
            return 1; // Durée minimale par défaut
        }
        
        this.currentQuotation.items.forEach(item => {
            if (item["is-active"]) {
                if (item.hierarchy) {
                    // Structure hiérarchique de l'étape 2
                    totalDays += this.calculateDurationForHierarchy(item.hierarchy);
                } else if (item.tasks) {
                    // Structure plate de tâches
                    item.tasks.forEach(task => {
                        if (task["is-active"] !== false) {
                            const daysForTask = Math.ceil(task.superficie / (20 * task["nombre-tacherons"]));
                            totalDays += daysForTask;
                        }
                    });
                }
            }
        });
        
        return Math.max(1, totalDays); // Au minimum 1 jour
    }

    /**
     * Calcule la durée récursivement pour une hiérarchie
     */
    calculateDurationForHierarchy(hierarchy) {
        let totalDays = 0;
        
        if (!Array.isArray(hierarchy)) {
            return 0;
        }
        
        hierarchy.forEach(node => {
            if (node["is-active"]) {
                if (node.isLeaf && node.task) {
                    // Formule: 1 jour pour 20m² par tâcheron
                    const superficie = node.task.superficie || 0;
                    const tacherons = node.task["nombre-tacherons"] || 1;
                    const daysForTask = Math.ceil(superficie / (20 * tacherons));
                    totalDays += daysForTask;
                } else if (node.children) {
                    totalDays += this.calculateDurationForHierarchy(node.children);
                }
            }
        });
        
        return totalDays;
    }

    calculateSubtotal() {
        let subtotal = 0;
        
        if (!this.currentQuotation || !this.currentQuotation.items) {
            console.warn('Aucune donnée de devis trouvée pour le calcul du sous-total');
            return 0;
        }
        
        this.currentQuotation.items.forEach(item => {
            if (item["is-active"]) {
                if (item.hierarchy) {
                    // Structure hiérarchique de l'étape 2
                    subtotal += this.calculateSubtotalForHierarchy(item.hierarchy);
                } else if (item.tasks) {
                    // Structure plate de tâches
                    item.tasks.forEach(task => {
                        if (task["is-active"] !== false) {
                            subtotal += this.calculateTaskSubtotal(task);
                        }
                    });
                }
            }
        });
        
        this.currentQuotation.financialDetails["total-price-ht"] = subtotal;
        console.log('Sous-total calculé:', subtotal);
        return subtotal;
    }

    /**
     * Calcule le sous-total récursivement pour une hiérarchie
     */
    calculateSubtotalForHierarchy(hierarchy) {
        let subtotal = 0;
        
        if (!Array.isArray(hierarchy)) {
            return 0;
        }
        
        hierarchy.forEach(node => {
            if (node["is-active"]) {
                if (node.isLeaf && node.task) {
                    subtotal += this.calculateTaskSubtotal(node.task);
                } else if (node.children) {
                    subtotal += this.calculateSubtotalForHierarchy(node.children);
                }
            }
        });
        
        return subtotal;
    }

    /**
     * Calcule le sous-total pour une tâche donnée
     */
    calculateTaskSubtotal(task) {
        let taskSubtotal = 0;
        
        // Main d'œuvre
        const laborCost = (task["effective-price"] || 0) * (task.superficie || 0);
        taskSubtotal += laborCost;
        
        // Produits liés
        if (task["linked-products"] && Array.isArray(task["linked-products"])) {
            task["linked-products"].forEach(lp => {
                const productCost = (lp["effective-price"] || 0) * (lp["ordered-quantity"] || 0);
                taskSubtotal += productCost;
            });
        }
        
        return taskSubtotal;
    }

    calculateMargins() {
        let marginProducts = 0;
        let marginLabor = 0;
        
        if (!this.currentQuotation || !this.currentQuotation.items) {
            console.warn('Aucune donnée de devis trouvée pour le calcul des marges');
            this.marginAnalysis.marginProducts = 0;
            this.marginAnalysis.marginLabor = 0;
            this.marginAnalysis.marginTotal = 0;
            return;
        }
        
        this.currentQuotation.items.forEach(item => {
            if (item["is-active"]) {
                if (item.hierarchy) {
                    // Structure hiérarchique de l'étape 2
                    const hierarchyMargins = this.calculateMarginsForHierarchy(item.hierarchy);
                    marginProducts += hierarchyMargins.products;
                    marginLabor += hierarchyMargins.labor;
                } else if (item.tasks) {
                    // Structure plate de tâches
                    item.tasks.forEach(task => {
                        if (task["is-active"] !== false) {
                            const taskMargins = this.calculateTaskMargins(task);
                            marginProducts += taskMargins.products;
                            marginLabor += taskMargins.labor;
                        }
                    });
                }
            }
        });
        
        this.marginAnalysis.marginProducts = Math.max(0, marginProducts);
        this.marginAnalysis.marginLabor = Math.max(0, marginLabor);
        this.marginAnalysis.marginTotal = this.marginAnalysis.marginProducts + this.marginAnalysis.marginLabor;
        
        console.log('Marges calculées:', this.marginAnalysis);
        this.updateNetGain();
    }

    /**
     * Calcule les marges récursivement pour une hiérarchie
     */
    calculateMarginsForHierarchy(hierarchy) {
        let marginProducts = 0;
        let marginLabor = 0;
        
        if (!Array.isArray(hierarchy)) {
            return { products: 0, labor: 0 };
        }
        
        hierarchy.forEach(node => {
            if (node["is-active"]) {
                if (node.isLeaf && node.task) {
                    const taskMargins = this.calculateTaskMargins(node.task);
                    marginProducts += taskMargins.products;
                    marginLabor += taskMargins.labor;
                } else if (node.children) {
                    const childMargins = this.calculateMarginsForHierarchy(node.children);
                    marginProducts += childMargins.products;
                    marginLabor += childMargins.labor;
                }
            }
        });
        
        return { products: marginProducts, labor: marginLabor };
    }

    /**
     * Calcule les marges pour une tâche donnée
     */
    calculateTaskMargins(task) {
        let marginProducts = 0;
        let marginLabor = 0;
        
        // Marge sur Main d'Œuvre: (prix effectif MO - prix tâcheron) × superficie
        const effectivePrice = task["effective-price"] || 0;
        const laborerPrice = task["laborer-price"] || 0;
        const superficie = task.superficie || 0;
        marginLabor += (effectivePrice - laborerPrice) * superficie;
        
        // Marge sur Produits: (prix effectif - prix technicien) × quantité
        if (task["linked-products"] && Array.isArray(task["linked-products"])) {
            task["linked-products"].forEach(lp => {
                const productEffectivePrice = lp["effective-price"] || 0;
                const technicianPrice = lp["technician-price"] || 0;
                const orderedQuantity = lp["ordered-quantity"] || 0;
                marginProducts += (productEffectivePrice - technicianPrice) * orderedQuantity;
            });
        }
        
        return { products: marginProducts, labor: marginLabor };
    }

    updateNetGain() {
        const discountAmount = this.currentQuotation.financialDetails["global-discount"] || 0;
        this.marginAnalysis.discountImpact = discountAmount;
        this.marginAnalysis.netGain = this.marginAnalysis.marginTotal - discountAmount;
        
        this.updateMarginAlert();
    }

    updateMarginAlert() {
        const alertDiv = document.getElementById('marginAlert');
        const alertText = document.getElementById('marginAlertText');
        const netGainElement = document.getElementById('netGain');
        
        if (this.marginAnalysis.netGain < 0) {
            alertDiv.classList.remove('hidden');
            alertText.textContent = 'Attention: Marge négative! Révisez votre remise.';
            netGainElement.className = 'font-bold text-2xl text-red-300';
        } else if (this.marginAnalysis.netGain < this.marginAnalysis.marginTotal * 0.1) {
            alertDiv.classList.remove('hidden');
            alertText.textContent = 'Marge très faible. Vérifiez vos prix.';
            netGainElement.className = 'font-bold text-2xl text-yellow-300';
        } else {
            alertDiv.classList.add('hidden');
            netGainElement.className = 'font-bold text-2xl text-white';
        }
    }

    renderInterface() {
        this.updateFinancialSummary();
        this.updateMarginDisplay();
        this.updatePlanningDisplay();
        this.renderOperationDetails();
    }

    updateFinancialSummary() {
        const subtotal = this.currentQuotation.financialDetails["total-price-ht"];
        const discount = this.currentQuotation.financialDetails["global-discount"] || 0;
        const finalTotal = subtotal - discount;
        
        document.getElementById('subtotalHT').textContent = this.formatPrice(subtotal);
        document.getElementById('discountAmount').textContent = discount > 0 ? `- ${this.formatPrice(discount)}` : '0 FCFA';
        document.getElementById('finalTotal').textContent = this.formatPrice(finalTotal);
        
        this.currentQuotation.financialDetails["final-price"] = finalTotal;
    }

    updateMarginDisplay() {
        document.getElementById('marginProducts').textContent = this.formatPrice(this.marginAnalysis.marginProducts);
        document.getElementById('marginLabor').textContent = this.formatPrice(this.marginAnalysis.marginLabor);
        document.getElementById('marginTotal').textContent = this.formatPrice(this.marginAnalysis.marginTotal);
        document.getElementById('discountImpactMargin').textContent = this.formatPrice(this.marginAnalysis.discountImpact);
        document.getElementById('netGain').textContent = this.formatPrice(this.marginAnalysis.netGain);
    }

    updatePlanningDisplay() {
        const systemDuration = this.currentQuotation.planning["estimated-executions"] || 0;
        const clientDuration = this.currentQuotation.planning["estimated-lead-time-days"] || systemDuration;
        
        document.getElementById('systemDuration').textContent = `${systemDuration} jours`;
        document.getElementById('clientDuration').value = clientDuration;
    }

    renderOperationDetails() {
        const container = document.getElementById('operationDetails');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!this.currentQuotation || !this.currentQuotation.items) {
            container.innerHTML = '<div class="text-gray-500 italic">Aucune opération trouvée</div>';
            return;
        }
        
        this.currentQuotation.items.forEach(item => {
            if (item["is-active"]) {
                const operationDiv = document.createElement('div');
                operationDiv.className = 'bg-gray-50 p-3 rounded border-l-4 border-primary';
                
                // Calculer la marge pour cette opération selon sa structure
                let operationMargin = 0;
                if (item.hierarchy) {
                    const margins = this.calculateMarginsForHierarchy(item.hierarchy);
                    operationMargin = margins.products + margins.labor;
                } else if (item.tasks) {
                    item.tasks.forEach(task => {
                        if (task["is-active"] !== false) {
                            const taskMargins = this.calculateTaskMargins(task);
                            operationMargin += taskMargins.products + taskMargins.labor;
                        }
                    });
                }
                
                operationDiv.innerHTML = `
                    <div class="flex justify-between items-center">
                        <span class="font-medium text-gray-700">${item.name}</span>
                        <span class="font-bold ${operationMargin >= 0 ? 'text-green-600' : 'text-red-600'}">
                            ${this.formatPrice(operationMargin)}
                        </span>
                    </div>
                `;
                
                container.appendChild(operationDiv);
            }
        });
    }

    changeDiscountType() {
        const discountType = document.querySelector('input[name="discountType"]:checked').value;
        const amountSection = document.getElementById('discountAmountSection');
        const percentageSection = document.getElementById('discountPercentageSection');
        
        if (discountType === 'amount') {
            amountSection.classList.remove('hidden');
            percentageSection.classList.add('hidden');
        } else {
            amountSection.classList.add('hidden');
            percentageSection.classList.remove('hidden');
        }
        
        this.updateDiscount();
    }

    updateDiscount() {
        const discountType = document.querySelector('input[name="discountType"]:checked').value;
        const subtotal = this.currentQuotation.financialDetails["total-price-ht"];
        let discountAmount = 0;
        let discountPercentage = '';
        
        if (discountType === 'amount') {
            discountAmount = parseFloat(document.getElementById('discountAmountInput').value) || 0;
            discountPercentage = subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(1) + '%' : '0%';
        } else {
            const percentage = parseFloat(document.getElementById('discountPercentageInput').value) || 0;
            discountAmount = (subtotal * percentage) / 100;
            discountPercentage = percentage + '%';
            
            // Mettre à jour le champ montant pour cohérence
            document.getElementById('discountAmountInput').value = Math.round(discountAmount);
        }
        
        // Limiter la remise à un maximum raisonnable
        const maxDiscount = subtotal * 0.5; // 50% max
        if (discountAmount > maxDiscount) {
            discountAmount = maxDiscount;
            if (discountType === 'amount') {
                document.getElementById('discountAmountInput').value = Math.round(discountAmount);
            } else {
                document.getElementById('discountPercentageInput').value = 50;
            }
            discountPercentage = '50%';
        }
        
        this.currentQuotation.financialDetails["global-discount"] = discountAmount;
        this.currentQuotation.financialDetails["global-discount-percentage"] = discountPercentage;
        
        // Mettre à jour l'affichage
        const impactText = discountAmount > 0 ? 
            `Remise de ${this.formatPrice(discountAmount)} (${discountPercentage}) appliquée` : 
            'Aucune remise appliquée';
        document.getElementById('discountImpact').textContent = impactText;
        
        this.updateNetGain();
        this.updateFinancialSummary();
        this.updateMarginDisplay();
        this.updateDeposit(); // Recalculer l'acompte basé sur le nouveau total
    }

    changeDepositType() {
        const depositType = document.querySelector('input[name="depositType"]:checked').value;
        const percentageSection = document.getElementById('depositPercentageSection');
        const amountSection = document.getElementById('depositAmountSection');
        
        if (depositType === 'percentage') {
            percentageSection.classList.remove('hidden');
            amountSection.classList.add('hidden');
        } else {
            percentageSection.classList.add('hidden');
            amountSection.classList.remove('hidden');
        }
        
        this.updateDeposit();
    }

    updateDeposit() {
        const depositType = document.querySelector('input[name="depositType"]:checked').value;
        const finalTotal = this.currentQuotation.financialDetails["final-price"];
        let depositAmount = 0;
        
        if (depositType === 'percentage') {
            const percentage = parseFloat(document.getElementById('depositPercentage').value) || 0;
            depositAmount = (finalTotal * percentage) / 100;
            document.getElementById('depositAmount').value = Math.round(depositAmount);
        } else {
            depositAmount = parseFloat(document.getElementById('depositAmount').value) || 0;
        }
        
        const remainingAmount = finalTotal - depositAmount;
        
        this.currentQuotation.financialDetails.deposit = depositAmount;
        
        document.getElementById('depositCalculated').textContent = this.formatPrice(depositAmount);
        document.getElementById('remainingAmount').textContent = this.formatPrice(Math.max(0, remainingAmount));
    }

    updateClientDuration() {
        const clientDuration = parseInt(document.getElementById('clientDuration').value) || 0;
        this.currentQuotation.planning["estimated-lead-time-days"] = clientDuration;
    }

    toggleMarginAnalysis() {
        const content = document.getElementById('marginContent');
        const icon = document.querySelector('#toggleMargin i');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.className = 'fas fa-chevron-down';
        } else {
            content.style.display = 'none';
            icon.className = 'fas fa-chevron-right';
        }
    }

    toggleOperationDetails() {
        const details = document.getElementById('operationDetails');
        const icon = document.getElementById('detailsIcon');
        
        if (details.classList.contains('hidden')) {
            details.classList.remove('hidden');
            icon.className = 'fas fa-chevron-down mr-2';
        } else {
            details.classList.add('hidden');
            icon.className = 'fas fa-chevron-right mr-2';
        }
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
        localStorage.setItem('currentQuotation', JSON.stringify(this.currentQuotation));
        console.log('Étape 3 - Progression sauvegardée');
    }

    validateStep() {
        // Vérifications de cohérence
        const finalTotal = this.currentQuotation.financialDetails["final-price"];
        const deposit = this.currentQuotation.financialDetails.deposit || 0;
        
        if (finalTotal <= 0) {
            alert('Erreur: Le montant total du devis doit être supérieur à 0.');
            return false;
        }
        
        if (deposit > finalTotal) {
            alert('Erreur: L\'acompte ne peut pas être supérieur au montant total.');
            return false;
        }
        
        const clientDuration = parseInt(document.getElementById('clientDuration').value);
        if (!clientDuration || clientDuration <= 0) {
            alert('Erreur: Veuillez indiquer un délai d\'exécution valide.');
            return false;
        }
        
        // Avertissement si marge très négative
        if (this.marginAnalysis.netGain < -50000) {
            if (!confirm('Attention: Votre marge est très négative (-50 000 FCFA). Voulez-vous continuer ?')) {
                return false;
            }
        }
        
        return true;
    }

    goToStep4() {
        if (!this.validateStep()) {
            return;
        }
        
        this.saveProgress();
        window.location.href = 'create-step4.html';
    }

    goBack() {
        if (confirm('Êtes-vous sûr de vouloir revenir à l\'étape précédente ? Vos modifications seront sauvegardées.')) {
            this.saveProgress();
            window.location.href = 'create-step2.html';
        }
    }

    showHelp() {
        alert('Aide - Finalisation Financière:\n\n' +
              '1. Vérifiez le sous-total HT calculé automatiquement\n' +
              '2. Appliquez une remise commerciale si nécessaire\n' +
              '3. Analysez votre marge privée en temps réel\n' +
              '4. Ajustez le délai d\'exécution selon vos contraintes\n' +
              '5. Définissez l\'acompte et les modalités de paiement\n\n' +
              'Attention: La section "Analyse de Marge" est privée et ne sera pas visible par le client.');
    }

    /**
     * Teste toutes les fonctionnalités principales de l'étape 3
     * Utile pour déboguer et vérifier que tout fonctionne
     */
    testStep3Functionality() {
        console.group('🧪 Test des fonctionnalités Étape 3');
        
        try {
            // Test de calcul du sous-total
            const subtotal = this.calculateSubtotal();
            console.log('✅ Calcul sous-total:', subtotal);
            
            // Test de calcul des marges
            this.calculateMargins();
            console.log('✅ Calcul marges:', this.marginAnalysis);
            
            // Test de calcul de durée
            const duration = this.calculateEstimatedDuration();
            console.log('✅ Calcul durée:', duration);
            
            // Test de mise à jour de l'affichage
            this.renderInterface();
            console.log('✅ Rendu interface réussi');
            
            // Test des validations
            const isValid = this.validateStep();
            console.log('✅ Validation étape:', isValid);
            
            console.log('🎉 Tous les tests passés avec succès');
            
        } catch (error) {
            console.error('❌ Erreur pendant les tests:', error);
            console.log('Données actuelles du devis:', this.currentQuotation);
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
            console.warn('💡 Solution: Vérifiez que les données du devis sont bien chargées depuis l\'étape 2');
            
            if (!this.currentQuotation) {
                console.warn('   → currentQuotation est null/undefined');
            } else if (!this.currentQuotation.items) {
                console.warn('   → currentQuotation.items est null/undefined');
            }
        }
        
        if (error.message.includes('is not a function')) {
            console.warn('💡 Solution: Une méthode n\'est pas définie dans la classe WizardStep3Manager');
        }
        
        // Réinitialiser les données si nécessaire
        if (context === 'calcul' && !this.currentQuotation) {
            console.warn('🔄 Tentative de rechargement des données...');
            this.loadQuotationData();
        }
    }
}

// Variables globales
let wizardManager;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    wizardManager = new WizardStep3Manager();
});

// Fonctions globales pour les handlers
function changeDiscountType() {
    wizardManager.changeDiscountType();
}

function updateDiscount() {
    wizardManager.updateDiscount();
}

function changeDepositType() {
    wizardManager.changeDepositType();
}

function updateDeposit() {
    wizardManager.updateDeposit();
}

function updateClientDuration() {
    wizardManager.updateClientDuration();
}

function toggleMarginAnalysis() {
    wizardManager.toggleMarginAnalysis();
}

function toggleOperationDetails() {
    wizardManager.toggleOperationDetails();
}

function goBack() {
    wizardManager.goBack();
}

function goToStep4() {
    wizardManager.goToStep4();
}

function showHelp() {
    wizardManager.showHelp();
}

// Fonction de test globale pour déboguer
function testStep3() {
    if (wizardManager) {
        wizardManager.testStep3Functionality();
    } else {
        console.error('WizardManager non initialisé');
    }
}