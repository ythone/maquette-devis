/**
 * Modèles de données pour la gestion des devis
 * Basés sur le modèle MDC défini dans devis-mdc.md
 */

// === Classes de base ===

class AbstractProduct {
    constructor(data = {}) {
        this["@class"] = "AbstractProduct";
        this.code = data.code || "";
        this.designation = data.designation || "";
        this.description = data.description || "";
        this.superCategory = data.superCategory || "";
        this.category = data.category || null;
        this.productType = data.productType || "";
        this.status = data.status || "Active";
    }
}

class ProductCategory {
    constructor(data = {}) {
        this["@class"] = "ProductCategory";
        this.id = data.id || "";
        this.name = data.name || "";
        this.description = data.description || "";
        this.subCategory = data.subCategory || null;
        this["parent-id"] = data["parent-id"] || null;
        this["category-tags"] = data["category-tags"] || [];
        this["is-leaf"] = data["is-leaf"] || false;
    }
}

class UOM {
    constructor(data = {}) {
        this.name = data.name || "";
        this.code = data.code || "";
        this.description = data.description || "";
    }
}

class ProductProcessSpecification {
    constructor(data = {}) {
        this["@type"] = "ProductProcessSpecification";
        this["yield-surface"] = data["yield-surface"] || 0;
        this["yield-surface-uom"] = data["yield-surface-uom"] || "m2";
        this.duration = data.duration || 0;
        this["duration-after"] = data["duration-after"] || 0;
        this["layers-count"] = data["layers-count"] || 1;
        this["default-security-quantity"] = data["default-security-quantity"] || 0;
        this["product-advice"] = data["product-advice"] || "";
    }
}

class ProductVariant {
    constructor(data = {}) {
        this["@class"] = "ProductVariant";
        this.code = data.code || "";
        this.designation = data.designation || "";
        this.uom = data.uom || new UOM();
        this.productId = data.productId || "";
        this.productSpecs = data.productSpecs || new ProductProcessSpecification();
        this.conditioning = data.conditioning || "";
        this.priceList = data.priceList || [];
        this.status = data.status || "Active";
        this["detailed-description"] = data["detailed-description"] || "";
        this["gallery-images"] = data["gallery-images"] || [];
    }
}

class ProductMargin {
    constructor(data = {}) {
        this["@type"] = "ProductMargin";
        this["max-margin"] = data["max-margin"] || 0;
        this["min-margin"] = data["min-margin"] || 0;
    }
}

class PriceListAttribute {
    constructor(data = {}) {
        this["@type"] = "QuotePriceListAttributes";
        this.name = data.name || "";
        this.priceListAttributeTarget = data.priceListAttributeTarget || "";
        this.description = data.description || "";
        this.fixPrice = data.fixPrice || 0;
        this.productMargin = data.productMargin || null;
    }
}

class PriceList {
    constructor(data = {}) {
        this.companyId = data.companyId || "";
        this["product-Id"] = data["product-Id"] || "";
        this.priceListId = data.priceListId || "";
        this.priceListName = data.priceListName || "";
        this.priceListAttributes = data.priceListAttributes || [];
        this.currency = data.currency || "FCFA";
        this.priceListType = data.priceListType || "";
    }
}

// === Classes spécifiques aux devis ===

class FinishingTypeDefinition {
    constructor(data = {}) {
        this["@class"] = "FinishingTypeDefinition";
        this["finishing-level"] = data["finishing-level"] || "";
        this["covering-type"] = data["covering-type"] || "";
        this["finishing-aspect"] = data["finishing-aspect"] || [];
        this["template-category"] = data["template-category"] || null;
    }
}

class QuoteOperation {
    constructor(data = {}) {
        this["@class"] = "QuoteOperation";
        this["operation-id"] = data["operation-id"] || "";
        this.name = data.name || "";
        this.tasks = data.tasks || null;
        this["quote-operation"] = data["quote-operation"] || [];
        this["is-mandatory"] = data["is-mandatory"] !== undefined ? data["is-mandatory"] : true;
        this["is-process"] = data["is-process"] !== undefined ? data["is-process"] : false;
    }
}

class QuoteModel {
    constructor(data = {}) {
        this["@class"] = "QuoteModel";
        this["@version"] = data["@version"] || "1.0";
        this.id = data.id || "";
        this["template-name"] = data["template-name"] || "";
        this["template-description"] = data["template-description"] || "";
        this["template-type"] = data["template-type"] || "";
        this.status = data.status || "Active";
        this["finishing-type-definitions"] = data["finishing-type-definitions"] || new FinishingTypeDefinition();
        this["quote-operations"] = data["quote-operations"] || [];
    }
}

// === Classes pour les instances de devis ===

class LinkedProduct {
    constructor(data = {}) {
        this.product = data.product || new ProductVariant();
        this["base-price"] = data["base-price"] || 0;
        this["effective-price"] = data["effective-price"] || 0;
        this["technician-price"] = data["technician-price"] || 0;
        this["ordered-quantity"] = data["ordered-quantity"] || 0;
    }
}

class QuotationTask {
    constructor(data = {}) {
        this["product-task"] = data["product-task"] || new ProductVariant();
        this.name = data.name || "";
        this["operation-id"] = data["operation-id"] || "";
        this["is-mandatory"] = data["is-mandatory"] !== undefined ? data["is-mandatory"] : true;
        this["is-active"] = data["is-active"] !== undefined ? data["is-active"] : true;
        this.superficie = data.superficie || 0;
        this.uom = data.uom || "m2";
        this["base-price"] = data["base-price"] || 0;
        this["effective-price"] = data["effective-price"] || 0;
        this["technician-price"] = data["technician-price"] || 0;
        this["laborer-price"] = data["laborer-price"] || 0;
        this["linked-products"] = data["linked-products"] || [];
        this["nombre-tacherons"] = data["nombre-tacherons"] || 1;
    }
}

class QuotationItem {
    constructor(data = {}) {
        this["quote-operation-id"] = data["quote-operation-id"] || "";
        this.name = data.name || "";
        this["is-mandatory"] = data["is-mandatory"] !== undefined ? data["is-mandatory"] : true;
        this["is-active"] = data["is-active"] !== undefined ? data["is-active"] : true;
        
        // Support pour les deux structures (ancienne et nouvelle)
        this.tasks = data.tasks || []; // Ancienne structure (à supprimer à terme)
        this.hierarchy = data.hierarchy || []; // Nouvelle structure hiérarchique
    }
}

class Tax {
    constructor(data = {}) {
        this.name = data.name || "";
        this.rate = data.rate || 0;
        this.amount = data.amount || 0;
    }
}

class FinancialDetails {
    constructor(data = {}) {
        this.notes = data.notes || "";
        this.taxes = data.taxes || [];
        this["total-price-ht"] = data["total-price-ht"] || 0;
        this.deposit = data.deposit || 0;
        this["total-price-tax"] = data["total-price-tax"] || 0;
        this["global-discount"] = data["global-discount"] || 0;
        this["global-discount-percentage"] = data["global-discount-percentage"] || "";
        this["final-price"] = data["final-price"] || 0;
    }
}

class Planning {
    constructor(data = {}) {
        this["estimated-executions"] = data["estimated-executions"] || 0;
        this.unit = data.unit || "day";
        this["projected-start-date"] = data["projected-start-date"] || null;
        this["estimated-lead-time-days"] = data["estimated-lead-time-days"] || 0;
        this["planned-start-date"] = data["planned-start-date"] || null;
        this["estimated-end-date"] = data["estimated-end-date"] || null;
    }
}

class QuoteStatus {
    constructor(data = {}) {
        this["emission-date"] = data["emission-date"] || new Date().toISOString().split('T')[0];
        this.status = data.status || "DRAFT";
        this["expiration-date"] = data["expiration-date"] || null;
        this["validation-date"] = data["validation-date"] || null;
        this["sent-date"] = data["sent-date"] || null;
        this["accepted-date"] = data["accepted-date"] || null;
    }
}

// === Entités liées (Chantier, Partner) ===

class Partner {
    constructor(data = {}) {
        this.id = data.id || "";
        this.name = data.name || "";
        this.firstName = data.firstName || "";
        this.lastName = data.lastName || "";
        this.email = data.email || "";
        this.phone = data.phone || "";
        this.address = data.address || "";
        this.isCompany = data.isCompany || false;
    }
}

class Chantier {
    constructor(data = {}) {
        this.id = data.id || "";
        this.name = data.name || "";
        this.description = data.description || "";
        this.address = data.address || "";
        this.proprietaire = data.proprietaire || new Partner();
        this.status = data.status || "ACTIVE";
        this["owner-identification-status"] = data["owner-identification-status"] || "FULLY_IDENTIFIED";
    }
}

// === Classe principale Quotation ===

class Quotation {
    constructor(data = {}) {
        this["@class"] = "Quotation";
        this["@version"] = data["@version"] || "1.0";
        this.id = data.id || this.generateId();
        this.name = data.name || "";
        this["quote-template-id"] = data["quote-template-id"] || "";
        this["finishing-type-definition"] = data["finishing-type-definition"] || new FinishingTypeDefinition();
        this.chantier = data.chantier || new Chantier();
        this["quotation-items"] = data["quotation-items"] || [];
        this.planning = data.planning || new Planning();
        this["financial-details"] = data["financial-details"] || new FinancialDetails();
        this.status = data.status || new QuoteStatus();
        this["objet-devis"] = data["objet-devis"] || "";
        this.notes = data.notes || "";
        this.garantie = data.garantie || "";
        this.certifications = data.certifications || [];
        this.medias = data.medias || [];
        this.createdBy = data.createdBy || "";
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    generateId() {
        return 'DEV-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Méthodes utilitaires pour les calculs
    calculateTotalHT() {
        let total = 0;
        this["quotation-items"].forEach(item => {
            if (item["is-active"]) {
                item.tasks.forEach(task => {
                    // Calcul main d'œuvre
                    total += (task["effective-price"] || task["base-price"]) * task.superficie;
                    
                    // Calcul produits liés
                    task["linked-products"].forEach(linkedProduct => {
                        total += (linkedProduct["effective-price"] || linkedProduct["base-price"]) * linkedProduct["ordered-quantity"];
                    });
                });
            }
        });
        this["financial-details"]["total-price-ht"] = total;
        return total;
    }

    calculateFinalPrice() {
        const totalHT = this.calculateTotalHT();
        const discount = this["financial-details"]["global-discount"] || 0;
        const finalPrice = totalHT - discount;
        this["financial-details"]["final-price"] = finalPrice;
        return finalPrice;
    }

    calculateTechnicianMargin() {
        let marginProduits = 0;
        let marginMO = 0;

        this["quotation-items"].forEach(item => {
            if (item["is-active"]) {
                item.tasks.forEach(task => {
                    // Marge sur main d'œuvre
                    const effectiveLaborPrice = task["effective-price"] || task["base-price"];
                    const laborerPrice = task["laborer-price"] || 0;
                    marginMO += (effectiveLaborPrice - laborerPrice) * task.superficie;
                    
                    // Marge sur produits
                    task["linked-products"].forEach(linkedProduct => {
                        const effectivePrice = linkedProduct["effective-price"] || linkedProduct["base-price"];
                        const technicianPrice = linkedProduct["technician-price"] || 0;
                        marginProduits += (effectivePrice - technicianPrice) * linkedProduct["ordered-quantity"];
                    });
                });
            }
        });

        const margeBrute = marginProduits + marginMO;
        const discount = this["financial-details"]["global-discount"] || 0;
        const gainNet = margeBrute - discount;

        return {
            marginProduits,
            marginMO,
            margeBrute,
            gainNet
        };
    }

    getStatusBadgeClass() {
        const statusMap = {
            'DRAFT': 'badge-draft',
            'PENDING_VALIDATION': 'badge-pending',
            'SENT': 'badge-sent',
            'ACCEPTED': 'badge-accepted',
            'REFUSED': 'badge-refused',
            'CANCELLED': 'badge-cancelled'
        };
        return statusMap[this.status.status] || 'badge-draft';
    }

    getStatusLabel() {
        const statusMap = {
            'DRAFT': 'Brouillon',
            'PENDING_VALIDATION': 'En attente',
            'SENT': 'Envoyé',
            'ACCEPTED': 'Accepté',
            'REFUSED': 'Refusé',
            'CANCELLED': 'Annulé'
        };
        return statusMap[this.status.status] || 'Inconnu';
    }

    canEdit() {
        return this.status.status === 'DRAFT';
    }

    canSend() {
        return ['DRAFT', 'PENDING_VALIDATION'].includes(this.status.status);
    }
}

// === Utilitaires ===

class DevisCalculator {
    static calculateProductQuantity(superficie, product, nombreCouches = 1, securityPercentage = 0) {
        const rendement = product.productSpecs?.["yield-surface"] || 1;
        const estimatedQuantity = (superficie * nombreCouches) / rendement;
        const roundedQuantity = Math.ceil(estimatedQuantity);
        const securityQuantity = Math.ceil(roundedQuantity * securityPercentage / 100);
        return {
            estimatedQuantity,
            roundedQuantity,
            securityQuantity,
            totalQuantity: roundedQuantity + securityQuantity
        };
    }

    static calculateTaskDuration(superficie, process, nombreTacherons = 1) {
        const durationPerUnit = process.productSpecs?.duration || 0;
        const totalHours = (superficie * durationPerUnit) / nombreTacherons;
        const waitHours = process.productSpecs?.["duration-after"] || 0;
        return {
            workHours: totalHours,
            waitHours: waitHours,
            totalHours: totalHours + waitHours
        };
    }

    static formatPrice(price) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price).replace('XOF', 'FCFA');
    }

    static formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

// Export pour utilisation
window.DevisModels = {
    AbstractProduct,
    ProductCategory,
    UOM,
    ProductProcessSpecification,
    ProductVariant,
    ProductMargin,
    PriceListAttribute,
    PriceList,
    FinishingTypeDefinition,
    QuoteOperation,
    QuoteModel,
    LinkedProduct,
    QuotationTask,
    QuotationItem,
    Tax,
    FinancialDetails,
    Planning,
    QuoteStatus,
    Partner,
    Chantier,
    Quotation,
    DevisCalculator
}; 