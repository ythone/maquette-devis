/**
 * Données de test pour l'application de gestion des devis
 * Basées sur les exemples du fichier devis-data.js
 */

// === Technicien connecté (exemple) ===
const CURRENT_TECHNICIAN = new DevisModels.Partner({
    id: "TECH-001",
    name: "ETS BATI PRO SERVICES",
    firstName: "Paul",
    lastName: "MBARGA",
    email: "paul.mbarga@batipro.cm",
    phone: "+237690123456", 
    address: "Douala, Akwa",
    isCompany: true
});

// === UOMs ===
const UOM_DATA = [
    new DevisModels.UOM({ name: "Kilogramme", code: "KG", description: "Unité de masse" }),
    new DevisModels.UOM({ name: "Litre", code: "L", description: "Unité de volume" }),
    new DevisModels.UOM({ name: "Mètre carré", code: "M2", description: "Unité de surface" }),
    new DevisModels.UOM({ name: "Unité", code: "PCS", description: "Pièce unitaire" }),
    new DevisModels.UOM({ name: "Jour", code: "DAY", description: "Unité de temps pour location" }),
    new DevisModels.UOM({ name: "Mètre linéaire", code: "ML", description: "Unité de mesure linéaire" }),
    new DevisModels.UOM({ name: "Trou", code: "TROU", description: "Unité par trou" })
];

// === Catégories de produits ===
const PRODUCT_CATEGORIES = [
    // Super categories
    new DevisModels.ProductCategory({
        id: "cat-paint",
        name: "PEINTURE",
        description: "Peintures et revêtements",
        "parent-id": null,
        "category-tags": ["peinture", "revêtement"],
        "is-leaf": false
    }),
    new DevisModels.ProductCategory({
        id: "cat-peint-int-mate",
        name: "Peinture Intérieure Mate",
        description: "Peintures mates pour intérieur",
        "parent-id": "cat-paint",
        "category-tags": ["intérieur", "mat"],
        "is-leaf": true
    }),
    new DevisModels.ProductCategory({
        id: "cat-peint-ext-mate",
        name: "Peinture Extérieure Mate",
        description: "Peintures mates pour façades",
        "parent-id": "cat-paint",
        "category-tags": ["extérieur", "façade", "mat"],
        "is-leaf": true
    }),
    new DevisModels.ProductCategory({
        id: "cat-peint-velours",
        name: "Peinture Velours",
        description: "Peintures aspect velours",
        "parent-id": "cat-paint",
        "category-tags": ["velours", "haut-gamme"],
        "is-leaf": true
    }),
    new DevisModels.ProductCategory({
        id: "cat-peint-satine",
        name: "Peinture Satinée",
        description: "Peintures satinées",
        "parent-id": "cat-paint",
        "category-tags": ["satin", "brillant"],
        "is-leaf": true
    }),
    
    new DevisModels.ProductCategory({
        id: "cat-preparation",
        name: "PRÉPARATION",
        description: "Produits de préparation des surfaces",
        "parent-id": null,
        "category-tags": ["préparation", "sous-couche"],
        "is-leaf": false
    }),
    new DevisModels.ProductCategory({
        id: "cat-impression",
        name: "Impressions et Sous-couches",
        description: "Primaires et impressions universelles",
        "parent-id": "cat-preparation",
        "category-tags": ["primaire", "impression", "accrochage"],
        "is-leaf": true
    }),
    new DevisModels.ProductCategory({
        id: "cat-enduits",
        name: "Enduits de Préparation",
        description: "Enduits de lissage et rebouchage",
        "parent-id": "cat-preparation",
        "category-tags": ["enduit", "lissage", "rebouchage"],
        "is-leaf": true
    }),
    
    new DevisModels.ProductCategory({
        id: "cat-carrelage",
        name: "CARRELAGE",
        description: "Produits pour pose de carrelage",
        "parent-id": null,
        "category-tags": ["carrelage", "colle", "joint"],
        "is-leaf": false
    }),
    new DevisModels.ProductCategory({
        id: "cat-carrelage-colle",
        name: "Colles Carrelage",
        description: "Ciments colles pour carrelage",
        "parent-id": "cat-carrelage",
        "category-tags": ["colle", "ciment"],
        "is-leaf": true
    }),
    
    new DevisModels.ProductCategory({
        id: "cat-outillage",
        name: "OUTILLAGE",
        description: "Outillage et accessoires",
        "parent-id": null,
        "category-tags": ["outillage", "accessoire"],
        "is-leaf": true
    }),
    new DevisModels.ProductCategory({
        id: "cat-equipement",
        name: "ÉQUIPEMENT",
        description: "Location d'équipement professionnel",
        "parent-id": null,
        "category-tags": ["location", "équipement"],
        "is-leaf": true
    }),
    
    new DevisModels.ProductCategory({
        id: "cat-procede",
        name: "PROCÉDÉ",
        description: "Procédés de mise en œuvre et préparation",
        "parent-id": null,
        "category-tags": ["procédé", "main-d-oeuvre"],
        "is-leaf": false
    }),
    new DevisModels.ProductCategory({
        id: "cat-pathologie",
        name: "Pathologie du Support",
        description: "Procédés de traitement des pathologies",
        "parent-id": "cat-procede",
        "category-tags": ["pathologie", "humidité", "fissures"],
        "is-leaf": true
    }),
    new DevisModels.ProductCategory({
        id: "cat-fissures",
        name: "Réparation des Fissures",
        description: "Procédés de réparation des fissures",
        "parent-id": "cat-procede",
        "category-tags": ["fissures", "réparation"],
        "is-leaf": true
    }),
    new DevisModels.ProductCategory({
        id: "cat-preparation-procede",
        name: "Préparation du Support",
        description: "Procédés de préparation des surfaces",
        "parent-id": "cat-procede",
        "category-tags": ["préparation", "ponçage", "enduit"],
        "is-leaf": true
    }),
    new DevisModels.ProductCategory({
        id: "cat-joints",
        name: "Regarnissage des Joints",
        description: "Procédés de regarnissage des joints",
        "parent-id": "cat-procede",
        "category-tags": ["joints", "regarnissage", "étanchéité"],
        "is-leaf": true
    }),
    new DevisModels.ProductCategory({
        id: "cat-revetement-procede",
        name: "Application Revêtement",
        description: "Procédés d'application des revêtements",
        "parent-id": "cat-procede",
        "category-tags": ["revêtement", "application", "finition"],
        "is-leaf": true
    })
];

// === Base de Produits Complète ===
const PRODUCTS_DATA = [
    // ================================
    // PEINTURES INTÉRIEURES MATES
    // ================================
    new DevisModels.ProductVariant({
        code: "MI-100-30",
        designation: "MI 100 30kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "MI-100",
        conditioning: "Pot de 30kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 195,
            "yield-surface-uom": "m2",
            duration: 2,
            "duration-after": 12,
            "layers-count": 2,
            "default-security-quantity": 5,
            "product-advice": "Peinture économique - Appliquer en 2 couches sur surface préparée"
        }),
        priceList: [
            { name: "Patron", fixPrice: 150 },
            { name: "Technicien", fixPrice: 150 },
            { name: "Tâcheron", fixPrice: 150 }
        ]
    }),
    
    new DevisModels.ProductVariant({
        code: "MI-100-5",
        designation: "MI 100 5kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "MI-100",
        conditioning: "Pot de 5kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 32,
            "yield-surface-uom": "m2",
            duration: 2,
            "duration-after": 12,
            "layers-count": 2,
            "default-security-quantity": 5,
            "product-advice": "Peinture économique - Appliquer en 2 couches sur surface préparée"
        }),
        priceList: [
            { name: "Patron", fixPrice: 40 },
            { name: "Technicien", fixPrice: 40 },
            { name: "Tâcheron", fixPrice: 40 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "MI-300-30",
        designation: "MI 300 30kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "MI-300",
        conditioning: "Pot de 30kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 195,
            "yield-surface-uom": "m2",
            duration: 2,
            "duration-after": 12,
            "layers-count": 2,
            "default-security-quantity": 5,
            "product-advice": "Peinture premium, excellent pouvoir couvrant"
        }),
        priceList: [
            { name: "Patron", fixPrice: 290 },
            { name: "Technicien", fixPrice: 266 },
            { name: "Tâcheron", fixPrice: 266 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "MI-300-5",
        designation: "MI 300 5kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "MI-300",
        conditioning: "Pot de 5kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 32,
            "yield-surface-uom": "m2",
            duration: 2,
            "duration-after": 12,
            "layers-count": 2,
            "default-security-quantity": 5,
            "product-advice": "Peinture premium, excellent pouvoir couvrant"
        }),
        priceList: [
            { name: "Patron", fixPrice: 65 },
            { name: "Technicien", fixPrice: 60 },
            { name: "Tâcheron", fixPrice: 60 }
        ]
    }),

    // ================================
    // PEINTURES EXTÉRIEURES MATES
    // ================================
    new DevisModels.ProductVariant({
        code: "ME-100-30",
        designation: "ME 100 30kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "ME-100",
        conditioning: "Pot de 30kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 180,
            "yield-surface-uom": "m2",
            duration: 3,
            "duration-after": 24,
            "layers-count": 2,
            "default-security-quantity": 10,
            "product-advice": "Peinture façade économique - Résistante aux UV"
        }),
        priceList: [
            { name: "Patron", fixPrice: 350 },
            { name: "Technicien", fixPrice: 321 },
            { name: "Tâcheron", fixPrice: 321 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "ME-100-5",
        designation: "ME 100 5kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "ME-100",
        conditioning: "Pot de 5kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 30,
            "yield-surface-uom": "m2",
            duration: 3,
            "duration-after": 24,
            "layers-count": 2,
            "default-security-quantity": 10,
            "product-advice": "Peinture façade économique - Résistante aux UV"
        }),
        priceList: [
            { name: "Patron", fixPrice: 75 },
            { name: "Technicien", fixPrice: 69 },
            { name: "Tâcheron", fixPrice: 69 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "ME-500-30",
        designation: "ME 500 30kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "ME-500",
        conditioning: "Pot de 30kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 210,
            "yield-surface-uom": "m2",
            duration: 3,
            "duration-after": 24,
            "layers-count": 2,
            "default-security-quantity": 10,
            "product-advice": "Peinture façade premium - Résistante aux UV et intempéries"
        }),
        priceList: [
            { name: "Patron", fixPrice: 390 },
            { name: "Technicien", fixPrice: 307 },
            { name: "Tâcheron", fixPrice: 307 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "ME-500-5",
        designation: "ME 500 5kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "ME-500",
        conditioning: "Pot de 5kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 35,
            "yield-surface-uom": "m2",
            duration: 3,
            "duration-after": 24,
            "layers-count": 2,
            "default-security-quantity": 10,
            "product-advice": "Peinture façade premium - Résistante aux UV et intempéries"
        }),
        priceList: [
            { name: "Patron", fixPrice: 85 },
            { name: "Technicien", fixPrice: 75 },
            { name: "Tâcheron", fixPrice: 75 }
        ]
    }),

    // ================================
    // PEINTURES VELOURS
    // ================================
    new DevisModels.ProductVariant({
        code: "ME-1900-25",
        designation: "ME 1900 VELOURS 25kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "ME-1900",
        conditioning: "Pot de 25kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 225,
            "yield-surface-uom": "m2",
            duration: 4,
            "duration-after": 24,
            "layers-count": 2,
            "default-security-quantity": 5,
            "product-advice": "Finition velours soyeuse, très lessivable"
        }),
        priceList: [
            { name: "Patron", fixPrice: 690 },
            { name: "Technicien", fixPrice: 620 },
            { name: "Tâcheron", fixPrice: 620 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "ME-1900-5",
        designation: "ME 1900 VELOURS 5kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "ME-1900",
        conditioning: "Pot de 5kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 45,
            "yield-surface-uom": "m2",
            duration: 4,
            "duration-after": 24,
            "layers-count": 2,
            "default-security-quantity": 5,
            "product-advice": "Finition velours soyeuse, très lessivable"
        }),
        priceList: [
            { name: "Patron", fixPrice: 150 },
            { name: "Technicien", fixPrice: 135 },
            { name: "Tâcheron", fixPrice: 135 }
        ]
    }),

    // ================================
    // PEINTURES SATINÉES
    // ================================
    new DevisModels.ProductVariant({
        code: "ME-6000-25",
        designation: "ME 6000 SATIN 25kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "ME-6000",
        conditioning: "Pot de 25kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 250,
            "yield-surface-uom": "m2",
            duration: 3,
            "duration-after": 24,
            "layers-count": 2,
            "default-security-quantity": 5,
            "product-advice": "Finition satinée lessivable, aspect brillant"
        }),
        priceList: [
            { name: "Patron", fixPrice: 790 },
            { name: "Technicien", fixPrice: 621 },
            { name: "Tâcheron", fixPrice: 621 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "ME-6000-5",
        designation: "ME 6000 SATIN 5kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "ME-6000",
        conditioning: "Pot de 5kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 50,
            "yield-surface-uom": "m2",
            duration: 3,
            "duration-after": 24,
            "layers-count": 2,
            "default-security-quantity": 5,
            "product-advice": "Finition satinée lessivable, aspect brillant"
        }),
        priceList: [
            { name: "Patron", fixPrice: 170 },
            { name: "Technicien", fixPrice: 155 },
            { name: "Tâcheron", fixPrice: 155 }
        ]
    }),

    // ================================
    // IMPRESSIONS ET PRIMAIRES
    // ================================
    new DevisModels.ProductVariant({
        code: "IM-2000-25",
        designation: "IM 2000 MULTIPRIM 25kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "IM-2000",
        conditioning: "Pot de 25kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 250,
            "yield-surface-uom": "m2",
            duration: 2,
            "duration-after": 24,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Primaire d'accrochage universel tous supports"
        }),
        priceList: [
            { name: "Patron", fixPrice: 590 },
            { name: "Technicien", fixPrice: 541 },
            { name: "Tâcheron", fixPrice: 541 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "IM-2000-5",
        designation: "IM 2000 MULTIPRIM 5kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "IM-2000",
        conditioning: "Bidon de 5kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 50,
            "yield-surface-uom": "m2",
            duration: 2,
            "duration-after": 24,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Primaire d'accrochage universel tous supports"
        }),
        priceList: [
            { name: "Patron", fixPrice: 110 },
            { name: "Technicien", fixPrice: 101 },
            { name: "Tâcheron", fixPrice: 101 }
        ]
    }),

    // ================================
    // ENDUITS DE LISSAGE
    // ================================
    new DevisModels.ProductVariant({
        code: "EM-1500-25",
        designation: "EM 1500 MULTICOAT 25kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "EM-1500",
        conditioning: "Pot de 25kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 40,
            "yield-surface-uom": "m2",
            duration: 4,
            "duration-after": 24,
            "layers-count": 2,
            "default-security-quantity": 10,
            "product-advice": "Enduit de lissage - Application à la spatule, 2 couches recommandées"
        }),
        priceList: [
            { name: "Patron", fixPrice: 350 },
            { name: "Technicien", fixPrice: 257 },
            { name: "Tâcheron", fixPrice: 257 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "EM-1500-5",
        designation: "EM 1500 MULTICOAT 5kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "EM-1500",
        conditioning: "Pot de 5kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 8,
            "yield-surface-uom": "m2",
            duration: 4,
            "duration-after": 24,
            "layers-count": 2,
            "default-security-quantity": 10,
            "product-advice": "Enduit de lissage - Application à la spatule, 2 couches recommandées"
        }),
        priceList: [
            { name: "Patron", fixPrice: 85 },
            { name: "Technicien", fixPrice: 78 },
            { name: "Tâcheron", fixPrice: 78 }
        ]
    }),

    // ================================
    // CIMENTS COLLES
    // ================================
    new DevisModels.ProductVariant({
        code: "CC-GRIS-20",
        designation: "CIMENT COLLE GRIS 20kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "CC-GRIS",
        conditioning: "Sac de 20kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 5,
            "yield-surface-uom": "m2",
            duration: 6,
            "duration-after": 24,
            "layers-count": 1,
            "default-security-quantity": 15,
            "product-advice": "Pour carreaux jusqu'à 30x30cm sur support normal"
        }),
        priceList: [
            { name: "Patron", fixPrice: 2500 },
            { name: "Technicien", fixPrice: 2300 }           
        ]
    }),

    new DevisModels.ProductVariant({
        code: "CC-BLANC-20",
        designation: "CIMENT COLLE BLANC 20kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "CC-BLANC",
        conditioning: "Sac de 20kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 5,
            "yield-surface-uom": "m2",
            duration: 6,
            "duration-after": 24,
            "layers-count": 1,
            "default-security-quantity": 15,
            "product-advice": "Pour carreaux clairs jusqu'à 40x40cm"
        }),
        priceList: [
            { name: "Patron", fixPrice: 55 },
            { name: "Technicien", fixPrice: 50 },
            { name: "Tâcheron", fixPrice: 50 }
        ]
    }),

    // ================================
    // OUTILLAGE ET ACCESSOIRES
    // ================================
    new DevisModels.ProductVariant({
        code: "ROULEAU-180-1",
        designation: "Rouleau laqueur 180mm",
        uom: UOM_DATA.find(u => u.code === "PCS"),
        productId: "ROULEAU-180",
        conditioning: "Unité",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 50,
            "yield-surface-uom": "m2",
            duration: 0,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 0,
            "product-advice": "Rouleau professionnel pour finition lisse"
        }),
        priceList: [
            { name: "Patron", fixPrice: 30 },
            { name: "Technicien", fixPrice: 25 },
            { name: "Tâcheron", fixPrice: 25 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "ROULEAU-250-1",
        designation: "Rouleau laqueur 250mm",
        uom: UOM_DATA.find(u => u.code === "PCS"),
        productId: "ROULEAU-250",
        conditioning: "Unité",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 80,
            "yield-surface-uom": "m2",
            duration: 0,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 0,
            "product-advice": "Rouleau professionnel large pour grandes surfaces"
        }),
        priceList: [
            { name: "Patron", fixPrice: 45 },
            { name: "Technicien", fixPrice: 40 },
            { name: "Tâcheron", fixPrice: 40 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PINCEAU-PLAT-50",
        designation: "Pinceau plat 50mm",
        uom: UOM_DATA.find(u => u.code === "PCS"),
        productId: "PINCEAU-PLAT",
        conditioning: "Unité",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 20,
            "yield-surface-uom": "m2",
            duration: 0,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 0,
            "product-advice": "Pour finitions et angles"
        }),
        priceList: [
            { name: "Patron", fixPrice: 20 },
            { name: "Technicien", fixPrice: 18 },
            { name: "Tâcheron", fixPrice: 18 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PAPIER-ABRASIF-120",
        designation: "Papier abrasif grain 120",
        uom: UOM_DATA.find(u => u.code === "PCS"),
        productId: "PAPIER-ABRASIF",
        conditioning: "Feuille",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 2,
            "yield-surface-uom": "m2",
            duration: 0,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 0,
            "product-advice": "Pour ponçage de préparation"
        }),
        priceList: [
            { name: "Patron", fixPrice: 5 },
            { name: "Technicien", fixPrice: 4 },
            { name: "Tâcheron", fixPrice: 4 }
        ]
    }),

    // ================================
    // ÉQUIPEMENT LOCATION
    // ================================
    new DevisModels.ProductVariant({
        code: "ECHAFAUD-1",
        designation: "Location Échafaudage Roulant",
        uom: UOM_DATA.find(u => u.code === "DAY"),
        productId: "ECHAFAUD",
        conditioning: "Jour",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "jour",
            duration: 0,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 0,
            "product-advice": "Livraison et reprise incluses - Hauteur max 8m"
        }),
        priceList: [
            { name: "Patron", fixPrice: 150 },
            { name: "Technicien", fixPrice: 100 },
            { name: "Tâcheron", fixPrice: 100 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "ECHELLE-TRANSFORMABLE",
        designation: "Location Échelle Transformable",
        uom: UOM_DATA.find(u => u.code === "DAY"),
        productId: "ECHELLE-TRANSF",
        conditioning: "Jour",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "jour",
            duration: 0,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 0,
            "product-advice": "Échelle 3 plans - Hauteur max 6m"
        }),
        priceList: [
            { name: "Patron", fixPrice: 50 },
            { name: "Technicien", fixPrice: 35 },
            { name: "Tâcheron", fixPrice: 35 }
        ]
    }),

    // ================================
    // PROCÉDÉS - PRÉPARATION DU SUPPORT
    // ================================
    new DevisModels.ProductVariant({
        code: "PROC-PROTECTION",
        designation: "Protection des Meubles et Appareillages",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-PREPARATION",
        conditioning: "Par m²",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "m2",
            duration: 0.02,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 0,
            "product-advice": "Protection avec films plastiques et adhésifs"
        }),
        priceList: [
            { name: "Patron", fixPrice: 50 },
            { name: "Technicien", fixPrice: 45 },
            { name: "Tâcheron", fixPrice: 40 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-EGRENAGE",
        designation: "Égrenage et Époussetage",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-PREPARATION",
        conditioning: "Par m²",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "m2",
            duration: 0.05,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 0,
            "product-advice": "Préparation indispensable pour l'accrochage - Ponçage léger et dépoussiérage"
        }),
        priceList: [
            { name: "Patron", fixPrice: 100 },
            { name: "Technicien", fixPrice: 90 },
            { name: "Tâcheron", fixPrice: 90 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-REBOUCHAGE",
        designation: "Rebouchage des Trous et Fissures",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-PREPARATION",
        conditioning: "Par m²",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "m2",
            duration: 0.15,
            "duration-after": 2,
            "layers-count": 1,
            "default-security-quantity": 0,
            "product-advice": "Rebouchage des défauts < 5mm avec enduit de rebouchage"
        }),
        priceList: [
            { name: "Patron", fixPrice: 200 },
            { name: "Technicien", fixPrice: 180 },
            { name: "Tâcheron", fixPrice: 160 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-ENDUIT-COLORE",
        designation: "Application Enduit Coloré",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-PREPARATION",
        conditioning: "Par m²",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "m2",
            duration: 0.25,
            "duration-after": 24,
            "layers-count": 1,
            "default-security-quantity": 0,
            "product-advice": "Enduit coloré pour finition A - Respecter le temps de séchage"
        }),
        priceList: [
            { name: "Patron", fixPrice: 850 },
            { name: "Technicien", fixPrice: 750 },
            { name: "Tâcheron", fixPrice: 600 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-PONCAGE",
        designation: "Ponçage après Enduit",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-PREPARATION",
        conditioning: "Par m²",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "m2",
            duration: 0.08,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 0,
            "product-advice": "Ponçage fin pour uniformiser la surface"
        }),
        priceList: [
            { name: "Patron", fixPrice: 120 },
            { name: "Technicien", fixPrice: 108 },
            { name: "Tâcheron", fixPrice: 96 }
        ]
    }),

    // ================================
    // PROCÉDÉS - APPLICATION REVÊTEMENT
    // ================================
    new DevisModels.ProductVariant({
        code: "PROC-IMPRESSION",
        designation: "Application Impression/Primaire",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-REVETEMENT",
        conditioning: "Par m²",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "m2",
            duration: 0.1,
            "duration-after": 4,
            "layers-count": 1,
            "default-security-quantity": 0,
            "product-advice": "Application au rouleau - Couche d'accrochage"
        }),
        priceList: [
            { name: "Patron", fixPrice: 250 },
            { name: "Technicien", fixPrice: 225 },
            { name: "Tâcheron", fixPrice: 200 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-COUCHE-INTERMEDIAIRE",
        designation: "Application Couche Intermédiaire",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-REVETEMENT",
        conditioning: "Par m²",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "m2",
            duration: 0.12,
            "duration-after": 4,
            "layers-count": 1,
            "default-security-quantity": 0,
            "product-advice": "Couche d'uniformisation - Finition A/B"
        }),
        priceList: [
            { name: "Patron", fixPrice: 300 },
            { name: "Technicien", fixPrice: 270 },
            { name: "Tâcheron", fixPrice: 240 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-FINITION-MATE",
        designation: "Couche de Finition Mate",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-REVETEMENT",
        conditioning: "Par m²",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "m2",
            duration: 0.15,
            "duration-after": 4,
            "layers-count": 2,
            "default-security-quantity": 0,
            "product-advice": "Application en 2 couches croisées au rouleau"
        }),
        priceList: [
            { name: "Patron", fixPrice: 650 },
            { name: "Technicien", fixPrice: 550 },
            { name: "Tâcheron", fixPrice: 450 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-FINITION-VELOURS",
        designation: "Couche de Finition Velours",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-REVETEMENT",
        conditioning: "Par m²",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "m2",
            duration: 0.18,
            "duration-after": 6,
            "layers-count": 2,
            "default-security-quantity": 0,
            "product-advice": "Application en 2 couches croisées - Finition premium"
        }),
        priceList: [
            { name: "Patron", fixPrice: 850 },
            { name: "Technicien", fixPrice: 750 },
            { name: "Tâcheron", fixPrice: 650 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-FINITION-SATINEE",
        designation: "Couche de Finition Satinée",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-REVETEMENT",
        conditioning: "Par m²",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "m2",
            duration: 0.2,
            "duration-after": 6,
            "layers-count": 2,
            "default-security-quantity": 0,
            "product-advice": "Application en 2 couches croisées - Finition lessivable"
        }),
        priceList: [
            { name: "Patron", fixPrice: 950 },
            { name: "Technicien", fixPrice: 850 },
            { name: "Tâcheron", fixPrice: 750 }
        ]
    }),

    // ================================
    // PROCÉDÉS - PATHOLOGIE DU SUPPORT
    // ================================
    new DevisModels.ProductVariant({
        code: "PROC-HUMID-DECAPER",
        designation: "Décaper le Support",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-HUMIDITE",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.3,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Décapage mécanique ou chimique selon l'état"
        }),
        priceList: [
            { name: "Patron", fixPrice: 2000 },
            { name: "Technicien", fixPrice: 1800 },
            { name: "Tâcheron", fixPrice: 1600 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-HUMID-ASSAINIR",
        designation: "Assainir les Murs",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-HUMIDITE",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.2,
            "duration-after": 12,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Traitement antifongique et désinfection"
        }),
        priceList: [
            { name: "Patron", fixPrice: 500 },
            { name: "Technicien", fixPrice: 450 },
            { name: "Tâcheron", fixPrice: 400 }
        ]
    }),

    // ================================
    // PROCÉDÉS - RÉPARATION FISSURES
    // ================================
    new DevisModels.ProductVariant({
        code: "PROC-FISSURE-AGRANDIR-PM",
        designation: "Agrandir la Fissure et la Dépoussiérer",
        uom: UOM_DATA.find(u => u.code === "ML"),
        productId: "PROC-FISSURES",
        conditioning: "Service par mètre linéaire",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "ML",
            duration: 0.3,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Fissures de 0.2 à 8mm - Préparation avant rebouchage"
        }),
        priceList: [
            { name: "Patron", fixPrice: 500 },
            { name: "Technicien", fixPrice: 450 },
            { name: "Tâcheron", fixPrice: 400 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-FISSURE-REBOUCHER-8000",
        designation: "Reboucher avec EN 8000 ACRYLASTIC",
        uom: UOM_DATA.find(u => u.code === "ML"),
        productId: "PROC-FISSURES",
        conditioning: "Service par mètre linéaire",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "ML",
            duration: 0.5,
            "duration-after": 24,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Mastic acrylique souple - Petites et moyennes fissures"
        }),
        priceList: [
            { name: "Patron", fixPrice: 500 },
            { name: "Technicien", fixPrice: 450 },
            { name: "Tâcheron", fixPrice: 400 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-FISSURE-AGRANDIR-GF",
        designation: "Agrandir et Réaliser des Saignées Transversales",
        uom: UOM_DATA.find(u => u.code === "ML"),
        productId: "PROC-FISSURES",
        conditioning: "Service par mètre linéaire",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "ML",
            duration: 1.0,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Grandes fissures - Préparation renforcée avec saignées"
        }),
        priceList: [
            { name: "Patron", fixPrice: 1000 },
            { name: "Technicien", fixPrice: 900 },
            { name: "Tâcheron", fixPrice: 800 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-FISSURE-ARMATURE",
        designation: "Fabriquer et Mettre une Armature",
        uom: UOM_DATA.find(u => u.code === "ML"),
        productId: "PROC-FISSURES",
        conditioning: "Service par mètre linéaire",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "ML",
            duration: 1.5,
            "duration-after": 2,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Armature métallique pour grandes fissures structurelles"
        }),
        priceList: [
            { name: "Patron", fixPrice: 1000 },
            { name: "Technicien", fixPrice: 900 },
            { name: "Tâcheron", fixPrice: 800 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-FISSURE-CIMENT-GRILLAGE",
        designation: "Reboucher avec Ciment Colle + Bande Grillagée",
        uom: UOM_DATA.find(u => u.code === "ML"),
        productId: "PROC-FISSURES",
        conditioning: "Service par mètre linéaire",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "ML",
            duration: 2.0,
            "duration-after": 24,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Renforcement avec grillage - Grandes fissures"
        }),
        priceList: [
            { name: "Patron", fixPrice: 1500 },
            { name: "Technicien", fixPrice: 1350 },
            { name: "Tâcheron", fixPrice: 1200 }
        ]
    }),

    // ================================
    // PROCÉDÉS - REGARNISSAGE JOINTS
    // ================================
    new DevisModels.ProductVariant({
        code: "PROC-JOINTS-DEGARNIS",
        designation: "Dégarnissage des Joints",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-JOINTS",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.8,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Retrait de l'ancien mortier de jointoiement"
        }),
        priceList: [
            { name: "Patron", fixPrice: 1000 },
            { name: "Technicien", fixPrice: 900 },
            { name: "Tâcheron", fixPrice: 800 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-JOINTS-REGARNIS",
        designation: "Regarnissage des Joints",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-JOINTS",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 1.0,
            "duration-after": 24,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Application nouveau mortier de jointoiement"
        }),
        priceList: [
            { name: "Patron", fixPrice: 500 },
            { name: "Technicien", fixPrice: 450 },
            { name: "Tâcheron", fixPrice: 400 }
        ]
    }),

    // ================================
    // PRODUITS COMPLÉMENTAIRES MANQUANTS DEPUIS TEMPLATE
    // ================================
    
    // DÉTERGENT MULTISURFACE
    new DevisModels.ProductVariant({
        code: "DETERGENT-MULTI",
        designation: "Détergent Multisurface 5L",
        uom: UOM_DATA.find(u => u.code === "L"),
        productId: "DETERGENT-MULTI",
        conditioning: "Bidon de 5L",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 100,
            "yield-surface-uom": "m2",
            duration: 1,
            "duration-after": 2,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Nettoyage et dégraissage des surfaces avant travaux"
        }),
        priceList: [
            { name: "Patron", fixPrice: 25.00 },
            { name: "Technicien", fixPrice: 22.00 },
            { name: "Tâcheron", fixPrice: 22.00 }
        ]
    }),
    
    // PRIMAIRE D'ACCROCHAGE UNIVERSEL
    new DevisModels.ProductVariant({
        code: "PRIMAIRE-MULTIFIX",
        designation: "Primaire d'accrochage universel 25kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "PRIMAIRE-MULTIFIX",
        conditioning: "Pot de 25kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 250,
            "yield-surface-uom": "m2",
            duration: 2,
            "duration-after": 24,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Primaire d'accrochage pour tous supports"
        }),
        priceList: [
            { name: "Patron", fixPrice: 590.00 },
            { name: "Technicien", fixPrice: 541.00 },
            { name: "Tâcheron", fixPrice: 541.00 }
        ]
    }),
    
    // PEINTURE MATE UNIVERSELLE
    new DevisModels.ProductVariant({
        code: "PEINTURE-MATE-MULTI",
        designation: "Peinture mate universelle 30kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "PEINTURE-MATE-MULTI",
        conditioning: "Pot de 30kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 195,
            "yield-surface-uom": "m2",
            duration: 3,
            "duration-after": 12,
            "layers-count": 2,
            "default-security-quantity": 5,
            "product-advice": "Peinture mate polyvalente pour finitions courantes"
        }),
        priceList: [
            { name: "Patron", fixPrice: 290.00 },
            { name: "Technicien", fixPrice: 266.00 },
            { name: "Tâcheron", fixPrice: 266.00 }
        ]
    }),
    
    // ENDUIT DE LISSAGE 30KG
    new DevisModels.ProductVariant({
        code: "EM-1500-MULTICOAT-30",
        designation: "EM 1500 MULTICOAT 30kg",
        uom: UOM_DATA.find(u => u.code === "KG"),
        productId: "EM-1500-MULTICOAT",
        conditioning: "Pot de 30kg",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 48,
            "yield-surface-uom": "m2",
            duration: 4,
            "duration-after": 24,
            "layers-count": 2,
            "default-security-quantity": 10,
            "product-advice": "Enduit de lissage prêt à l'emploi - Application à la spatule"
        }),
        priceList: [
            { name: "Patron", fixPrice: 420.00 },
            { name: "Technicien", fixPrice: 386.00 },
            { name: "Tâcheron", fixPrice: 386.00 }
        ]
    }),

    // ================================
    // PROCÉDÉS MANQUANTS DEPUIS TEMPLATE
    // ================================
    
    // =====================================
    // PROCÉDÉS SAIGNÉE
    // =====================================
    new DevisModels.ProductVariant({
        code: "PROC-SAIGNEE-COUPER",
        designation: "Couper les Murs",
        uom: UOM_DATA.find(u => u.code === "ML"),
        productId: "PROC-SAIGNEE-COUPER",
        conditioning: "Service par mètre linéaire",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "ML",
            duration: 0.8,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Découpe des murs pour méthode par saignée"
        }),
        priceList: [
            { name: "Patron", fixPrice: 1000 },
            { name: "Technicien", fixPrice: 900 },
            { name: "Tâcheron", fixPrice: 800 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-SAIGNEE-POLYANE",
        designation: "Pose Polyane + Mortier Étanche",
        uom: UOM_DATA.find(u => u.code === "ML"),
        productId: "PROC-SAIGNEE-POLYANE",
        conditioning: "Service par mètre linéaire",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "ML",
            duration: 1.0,
            "duration-after": 24,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Pose de polyane et application de mortier étanche"
        }),
        priceList: [
            { name: "Patron", fixPrice: 1000 },
            { name: "Technicien", fixPrice: 900 },
            { name: "Tâcheron", fixPrice: 800 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-SAIGNEE-MACONNER",
        designation: "Maçonner pour Refermer les Murs",
        uom: UOM_DATA.find(u => u.code === "ML"),
        productId: "PROC-SAIGNEE-MACONNER",
        conditioning: "Service par mètre linéaire",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "ML",
            duration: 1.2,
            "duration-after": 24,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Maçonnerie pour fermer les saignées réalisées"
        }),
        priceList: [
            { name: "Patron", fixPrice: 1000 },
            { name: "Technicien", fixPrice: 900 },
            { name: "Tâcheron", fixPrice: 800 }
        ]
    }),

    // =====================================
    // PROCÉDÉS HUMIDITÉ MANQUANTS
    // =====================================
    new DevisModels.ProductVariant({
        code: "PROC-HUMID-IMPRESSION",
        designation: "Impression Anti-Alcali",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-HUMID-IMPRESSION",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.1,
            "duration-after": 4,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Application d'impression anti-alcali sur support préparé"
        }),
        priceList: [
            { name: "Patron", fixPrice: 200 },
            { name: "Technicien", fixPrice: 180 },
            { name: "Tâcheron", fixPrice: 160 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-HUMID-PROTECTION",
        designation: "Protection Étanche en 2 Couches",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-HUMID-PROTECTION",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.4,
            "duration-after": 24,
            "layers-count": 2,
            "default-security-quantity": 5,
            "product-advice": "Application de protection étanche en 2 couches"
        }),
        priceList: [
            { name: "Patron", fixPrice: 1000 },
            { name: "Technicien", fixPrice: 900 },
            { name: "Tâcheron", fixPrice: 800 }
        ]
    }),

    // =====================================
    // PROCÉDÉS INJECTION
    // =====================================
    new DevisModels.ProductVariant({
        code: "PROC-INJECTION-PERCER",
        designation: "Percer les Trous",
        uom: UOM_DATA.find(u => u.code === "TROU"),
        productId: "PROC-INJECTION-PERCER",
        conditioning: "Service par trou",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "TROU",
            duration: 0.1,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Perçage des trous pour injection de résine étanche"
        }),
        priceList: [
            { name: "Patron", fixPrice: 100 },
            { name: "Technicien", fixPrice: 90 },
            { name: "Tâcheron", fixPrice: 80 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-INJECTION-RESINE",
        designation: "Injecter la Résine Étanche",
        uom: UOM_DATA.find(u => u.code === "TROU"),
        productId: "PROC-INJECTION-RESINE",
        conditioning: "Service par trou",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "TROU",
            duration: 0.15,
            "duration-after": 24,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Injection de résine étanche dans les trous percés"
        }),
        priceList: [
            { name: "Patron", fixPrice: 50 },
            { name: "Technicien", fixPrice: 45 },
            { name: "Tâcheron", fixPrice: 40 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-INJECTION-REFERMER",
        designation: "Refermer les Trous",
        uom: UOM_DATA.find(u => u.code === "TROU"),
        productId: "PROC-INJECTION-REFERMER",
        conditioning: "Service par trou",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "TROU",
            duration: 0.05,
            "duration-after": 2,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Rebouchage et finition des trous après injection"
        }),
        priceList: [
            { name: "Patron", fixPrice: 25 },
            { name: "Technicien", fixPrice: 25 },
            { name: "Tâcheron", fixPrice: 20 }
        ]
    }),

    // =====================================
    // PROCÉDÉS PRÉPARATION DÉTAILLÉE
    // =====================================
    new DevisModels.ProductVariant({
        code: "PROC-PREP-PROTECTION",
        designation: "Protéger les Meubles et les Appareillages",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-PREP-PROTECTION",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.2,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Protection des meubles et équipements avant travaux"
        }),
        priceList: [
            { name: "Patron", fixPrice: 500 },
            { name: "Technicien", fixPrice: 450 },
            { name: "Tâcheron", fixPrice: 400 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-PREP-DEFAUTS",
        designation: "Rattraper les Défauts avec le Ciment Colle Blanc",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-PREP-DEFAUTS",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.8,
            "duration-after": 24,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Dégrossissage des défauts supérieurs à 5mm"
        }),
        priceList: [
            { name: "Patron", fixPrice: 500 },
            { name: "Technicien", fixPrice: 450 },
            { name: "Tâcheron", fixPrice: 400 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-PREP-EGRENAGE",
        designation: "Égrenage",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-PREP-EGRENAGE",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.1,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Égrenage des surfaces pour préparation"
        }),
        priceList: [
            { name: "Patron", fixPrice: 100 },
            { name: "Technicien", fixPrice: 90 },
            { name: "Tâcheron", fixPrice: 80 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-PREP-EPOUSSETAGE-1",
        designation: "Époussetage",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-PREP-EPOUSSETAGE-1",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.05,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Époussetage des surfaces après égrenage"
        }),
        priceList: [
            { name: "Patron", fixPrice: 25 },
            { name: "Technicien", fixPrice: 25 },
            { name: "Tâcheron", fixPrice: 20 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-PREP-REBOUCHAGE",
        designation: "Rebouchage",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-PREP-REBOUCHAGE",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.2,
            "duration-after": 12,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Rebouchage des petites imperfections"
        }),
        priceList: [
            { name: "Patron", fixPrice: 100 },
            { name: "Technicien", fixPrice: 90 },
            { name: "Tâcheron", fixPrice: 80 }
        ]
    }),

    // =====================================
    // PROCÉDÉS ENDUIT REPASSÉ
    // =====================================
    new DevisModels.ProductVariant({
        code: "PROC-ENDUIT-PONCAGE-1",
        designation: "Ponçage (Enduit Repassé)",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-ENDUIT-PONCAGE-1",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.15,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Ponçage initial pour enduit repassé"
        }),
        priceList: [
            { name: "Patron", fixPrice: 100 },
            { name: "Technicien", fixPrice: 90 },
            { name: "Tâcheron", fixPrice: 80 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-ENDUIT-EPOUSSETAGE-1",
        designation: "Époussetage (après Ponçage Initial)",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-ENDUIT-EPOUSSETAGE-1",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.05,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Époussetage après ponçage initial d'enduit repassé"
        }),
        priceList: [
            { name: "Patron", fixPrice: 25 },
            { name: "Technicien", fixPrice: 25 },
            { name: "Tâcheron", fixPrice: 20 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-ENDUIT-PONCAGE-2",
        designation: "Ponçage (après Enduit Coloré)",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-ENDUIT-PONCAGE-2",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.3,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Ponçage après application d'enduit coloré"
        }),
        priceList: [
            { name: "Patron", fixPrice: 200 },
            { name: "Technicien", fixPrice: 180 },
            { name: "Tâcheron", fixPrice: 160 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-ENDUIT-EPOUSSETAGE-2",
        designation: "Époussetage Final (Enduit Repassé)",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-ENDUIT-EPOUSSETAGE-2",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.1,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Époussetage final après ponçage d'enduit coloré"
        }),
        priceList: [
            { name: "Patron", fixPrice: 200 },
            { name: "Technicien", fixPrice: 180 },
            { name: "Tâcheron", fixPrice: 160 }
        ]
    }),

    // =====================================
    // PROCÉDÉS REVÊTEMENT
    // =====================================
    new DevisModels.ProductVariant({
        code: "PROC-REV-IMPRESSION-MINCE",
        designation: "Impression (Revêtement Mince)",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-REV-IMPRESSION-MINCE",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.2,
            "duration-after": 4,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Application d'impression pour revêtement mince"
        }),
        priceList: [
            { name: "Patron", fixPrice: 500 },
            { name: "Technicien", fixPrice: 450 },
            { name: "Tâcheron", fixPrice: 400 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-REV-COUCHE-INTER",
        designation: "Couche Intermédiaire",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-REV-COUCHE-INTER",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.3,
            "duration-after": 24,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Application de couche intermédiaire"
        }),
        priceList: [
            { name: "Patron", fixPrice: 500 },
            { name: "Technicien", fixPrice: 450 },
            { name: "Tâcheron", fixPrice: 400 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-REV-REVISION",
        designation: "Révision",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-REV-REVISION",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.2,
            "duration-after": 0,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Révision des surfaces avant couche de finition"
        }),
        priceList: [
            { name: "Patron", fixPrice: 200 },
            { name: "Technicien", fixPrice: 180 },
            { name: "Tâcheron", fixPrice: 160 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-REV-FINITION-MINCE",
        designation: "Couche de Finition (Revêtement Mince)",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-REV-FINITION-MINCE",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.4,
            "duration-after": 24,
            "layers-count": 1,
            "default-security-quantity": 5,
            "product-advice": "Application de couche de finition revêtement mince"
        }),
        priceList: [
            { name: "Patron", fixPrice: 500 },
            { name: "Technicien", fixPrice: 450 },
            { name: "Tâcheron", fixPrice: 400 }
        ]
    }),

    new DevisModels.ProductVariant({
        code: "PROC-REV-VERNIS",
        designation: "Vernis de Protection, 2 Couches",
        uom: UOM_DATA.find(u => u.code === "M2"),
        productId: "PROC-REV-VERNIS",
        conditioning: "Service par mètre carré",
        status: "ACTIVE",
        productSpecs: new DevisModels.ProductProcessSpecification({
            "yield-surface": 1,
            "yield-surface-uom": "M2",
            duration: 0.6,
            "duration-after": 24,
            "layers-count": 2,
            "default-security-quantity": 5,
            "product-advice": "Application de vernis de protection en 2 couches"
        }),
        priceList: [
            { name: "Patron", fixPrice: 200 },
            { name: "Technicien", fixPrice: 180 },
            { name: "Tâcheron", fixPrice: 160 }
        ]
    })
];

// === Chantiers disponibles ===
const CHANTIERS_DATA = [
    new DevisModels.Chantier({
        id: "CHANT-001",
        name: "Chantier Rénovation Salon - Mme ADA",
        description: "Rénovation complète du salon avec peinture des murs et boiseries",
        address: "123 Rue de la Liberté, Douala, Cameroun",
        proprietaire: new DevisModels.Partner({
            id: "CLIENT-001",
            name: "Madame ADA NGUIFOU",
            firstName: "Ada",
            lastName: "NGUIFOU",
            email: "ada.nguifou@email.cm",
            phone: "+237677889900",
            address: "123 Rue de la Liberté, Douala",
            isCompany: false
        }),
        status: "ACTIVE",
        "owner-identification-status": "FULLY_IDENTIFIED"
    }),
    
    new DevisModels.Chantier({
        id: "CHANT-002", 
        name: "Villa Moderne Bonanjo",
        description: "Peinture extérieure et intérieure d'une villa 4 chambres",
        address: "Bonanjo, Douala, Cameroun",
        proprietaire: new DevisModels.Partner({
            id: "CLIENT-002",
            name: "Monsieur Jean KAMGA",
            firstName: "Jean",
            lastName: "KAMGA",
            email: "j.kamga@example.com",
            phone: "+237698765432",
            address: "Bonanjo, Douala",
            isCompany: false
        }),
        status: "ACTIVE",
        "owner-identification-status": "FULLY_IDENTIFIED"
    }),

    new DevisModels.Chantier({
        id: "CHANT-003",
        name: "Bureaux Société CAMTEL",
        description: "Rénovation peinture des bureaux administratifs",
        address: "Centre-ville, Douala, Cameroun",
        proprietaire: new DevisModels.Partner({
            id: "CLIENT-003",
            name: "CAMTEL SARL",
            firstName: "",
            lastName: "",
            email: "admin@camtel.cm",
            phone: "+237655443322",
            address: "Centre-ville, Douala",
            isCompany: true
        }),
        status: "ACTIVE",
        "owner-identification-status": "FULLY_IDENTIFIED"
    })
];

// === Modèles de devis (QuoteModel) ===
const QUOTE_TEMPLATES = [
    new DevisModels.QuoteModel({
        id: "quote-template-a-mince-complet",
        "template-name": "Finition A - Revêtement Mince - Mate/Velours/Satinée (Complet)",
        "template-description": "Modèle de devis complet pour finition parfaite avec revêtement mince, incluant tous les aspects mate, velours et satinée brillante avec tous les procédés détaillés",
        "template-type": "Paint",
        status: "ACTIVE",
        "finishing-type-definitions": new DevisModels.FinishingTypeDefinition({
            "finishing-level": "A",
            "covering-type": "MINCE", 
            "finishing-aspect": ["MATE", "VELOURS", "SATINEE_BRILLANTE"],
            "template-category": null // sera défini selon le contexte
        }),
        "quote-operations": [
            // =====================================
            // OPÉRATION 1: PATHOLOGIE DU SUPPORT
            // =====================================
            new DevisModels.QuoteOperation({
                "operation-id": "OP-PATHOLOGIE",
                name: "Pathologie du Support",
                "is-mandatory": false, // Optionnel pour finition A
                "quote-operation": [
                    // TÂCHE: TRAITEMENT D'HUMIDITÉ (par remontée capillaire)
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-HUMIDITE",
                        name: "Traitement d'Humidité (remontée capillaire)",
                        "is-mandatory": false,
                        "quote-operation": [
                            // TÂCHE: MÉTHODE PAR SAIGNÉE
                            new DevisModels.QuoteOperation({
                                "operation-id": "TASK-SAIGNEE",
                                name: "Méthode par Saignée",
                                "is-mandatory": false,
                                "quote-operation": [
                                    // PROCÉDÉ: Couper les murs
                                    new DevisModels.QuoteOperation({
                                        "operation-id": "PROC-SAIGNEE-COUPER",
                                        name: "Couper les Murs",
                                        "is-mandatory": true,
                                        tasks: {
                                            "product-task": "PROC-SAIGNEE-COUPER",
                                            "linked-products": []
                                        }
                                    }),
                                    // PROCÉDÉ: Pose polyane + mortier étanche
                                    new DevisModels.QuoteOperation({
                                        "operation-id": "PROC-SAIGNEE-POLYANE",
                                        name: "Pose Polyane + Mortier Étanche",
                                        "is-mandatory": true,
                                        tasks: {
                                            "product-task": "PROC-SAIGNEE-POLYANE",
                                            "linked-products": []
                                        }
                                    }),
                                    // PROCÉDÉ: Maçonner pour refermer
                                    new DevisModels.QuoteOperation({
                                        "operation-id": "PROC-SAIGNEE-MACONNER",
                                        name: "Maçonner pour Refermer les Murs",
                                        "is-mandatory": true,
                                        tasks: {
                                            "product-task": "PROC-SAIGNEE-MACONNER",
                                            "linked-products": ["CC-GRIS-20"]
                                        }
                                    }),
                                    // PROCÉDÉ: Décaper le support
                                    new DevisModels.QuoteOperation({
                                        "operation-id": "PROC-HUMID-DECAPER",
                                        name: "Décaper le Support",
                                        "is-mandatory": true,
                                        tasks: {
                                            "product-task": "PROC-HUMID-DECAPER",
                                            "linked-products": ["PROC-HUMID-DECAPER"]
                                        }
                                    }),
                                    // PROCÉDÉ: Assainir les murs
                                    new DevisModels.QuoteOperation({
                                        "operation-id": "PROC-HUMID-ASSAINIR", 
                                        name: "Assainir les Murs",
                                        "is-mandatory": true,
                                        tasks: {
                                            "product-task": "PROC-HUMID-ASSAINIR",
                                            "linked-products": ["PROC-HUMID-ASSAINIR"]
                                        }
                                    }),
                                    // PROCÉDÉ: Impression anti-alcali
                                    new DevisModels.QuoteOperation({
                                        "operation-id": "PROC-HUMID-IMPRESSION",
                                        name: "Impression Anti-Alcali",
                                        "is-mandatory": true,
                                        tasks: {
                                            "product-task": "PROC-HUMID-IMPRESSION",
                                            "linked-products": ["PROC-HUMID-IMPRESSION"]
                                        }
                                    }),
                                    // PROCÉDÉ: Protection étanche en 2 couches
                                    new DevisModels.QuoteOperation({
                                        "operation-id": "PROC-HUMID-PROTECTION",
                                        name: "Protection Étanche en 2 Couches",
                                        "is-mandatory": true,
                                        tasks: {
                                            "product-task": "PROC-HUMID-PROTECTION",
                                            "linked-products": ["PROC-HUMID-PROTECTION"]
                                        }
                                    })
                                ]
                            }),
                            // TÂCHE: MÉTHODE PAR INJECTION
                            new DevisModels.QuoteOperation({
                                "operation-id": "TASK-INJECTION",
                                name: "Méthode par Injection",
                                "is-mandatory": false,
                                "quote-operation": [
                                    // PROCÉDÉ: Percer les trous
                                    new DevisModels.QuoteOperation({
                                        "operation-id": "PROC-INJECTION-PERCER",
                                        name: "Percer les Trous",
                                        "is-mandatory": true,
                                        tasks: {
                                            "product-task": "PROC-INJECTION-PERCER",
                                            "linked-products": ["PROC-INJECTION-PERCER"]
                                        }
                                    }),
                                    // PROCÉDÉ: Injecter la résine étanche
                                    new DevisModels.QuoteOperation({
                                        "operation-id": "PROC-INJECTION-RESINE",
                                        name: "Injecter la Résine Étanche",
                                        "is-mandatory": true,
                                        tasks: {
                                            "product-task": "PROC-INJECTION-RESINE",
                                            "linked-products": ["PROC-INJECTION-RESINE"]
                                        }
                                    }),
                                    // PROCÉDÉ: Refermer les trous
                                    new DevisModels.QuoteOperation({
                                        "operation-id": "PROC-INJECTION-REFERMER",
                                        name: "Refermer les Trous",
                                        "is-mandatory": true,
                                        tasks: {
                                            "product-task": "PROC-INJECTION-REFERMER",
                                            "linked-products": ["PROC-INJECTION-REFERMER"]
                                        }
                                    }),
                                    // PROCÉDÉ: Décaper le support
                                    new DevisModels.QuoteOperation({
                                        "operation-id": "PROC-HUMID-DECAPER",
                                        name: "Décaper le Support",
                                        "is-mandatory": true,
                                        tasks: {
                                            "product-task": "PROC-HUMID-DECAPER",
                                            "linked-products": ["PROC-HUMID-DECAPER"]
                                        }
                                    }),
                                    // PROCÉDÉ: Assainir les murs
                                    new DevisModels.QuoteOperation({
                                        "operation-id": "PROC-HUMID-ASSAINIR", 
                                        name: "Assainir les Murs",
                                        "is-mandatory": true,
                                        tasks: {
                                            "product-task": "PROC-HUMID-ASSAINIR",
                                            "linked-products": ["PROC-HUMID-ASSAINIR"]
                                        }
                                    }),
                                    // PROCÉDÉ: Impression anti-alcali
                                    new DevisModels.QuoteOperation({
                                        "operation-id": "PROC-HUMID-IMPRESSION",
                                        name: "Impression Anti-Alcali",
                                        "is-mandatory": true,
                                        tasks: {
                                            "product-task": "PROC-HUMID-IMPRESSION",
                                            "linked-products": ["PROC-HUMID-IMPRESSION"]
                                        }
                                    }),
                                    // PROCÉDÉ: Protection étanche en 2 couches
                                    new DevisModels.QuoteOperation({
                                        "operation-id": "PROC-HUMID-PROTECTION",
                                        name: "Protection Étanche en 2 Couches",
                                        "is-mandatory": true,
                                        tasks: {
                                            "product-task": "PROC-HUMID-PROTECTION",
                                            "linked-products": ["PROC-HUMID-PROTECTION"]
                                        }
                                    })
                                ]
                            })    
                           
                        ]
                    })                   
                     
                ]
            }),
            
            // =====================================
            // OPÉRATION 2: RÉPARATION DES FISSURES
            // =====================================
            new DevisModels.QuoteOperation({
                "operation-id": "OP-FISSURES",
                name: "Réparation des Fissures",
                "is-mandatory": false,
                "quote-operation": [
                    // TÂCHE: PETITES ET MOYENNES FISSURES (0.2 à 8mm)
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-PETITES-FISSURES",
                        name: "Petites et Moyennes Fissures (0.2 à 8mm)",
                        "is-mandatory": false,
                        "quote-operation": [
                            // PROCÉDÉ: Agrandir la fissure et la dépoussiérer
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-FISSURE-AGRANDIR-PM",
                                name: "Agrandir la Fissure et la Dépoussiérer",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-FISSURE-AGRANDIR-PM",
                                    "linked-products": ["PROC-FISSURE-AGRANDIR-PM"]
                                }
                            }),
                            // PROCÉDÉ: Reboucher avec EN 8000 ACRYLASTIC
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-FISSURE-REBOUCHER-8000",
                                name: "Reboucher la Fissure avec le EN 8000 ACRYLASTIC",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-FISSURE-REBOUCHER-8000",
                                    "linked-products": ["PROC-FISSURE-REBOUCHER-8000"]
                                }
                            })
                        ]
                    }),
                    
                    // TÂCHE: GRANDES FISSURES
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-GRANDES-FISSURES",
                        name: "Grandes Fissures",
                        "is-mandatory": false,
                        "quote-operation": [
                            // PROCÉDÉ: Agrandir et réaliser des saignées transversales
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-FISSURE-AGRANDIR-GF",
                                name: "Agrandir la Fissure et Réaliser des Saignées Transversales",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-FISSURE-AGRANDIR-GF",
                                    "linked-products": ["PROC-FISSURE-AGRANDIR-GF"]
                                }
                            }),
                            // PROCÉDÉ: Fabriquer et mettre une armature
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-FISSURE-ARMATURE",
                                name: "Fabriquer et Mettre une Armature",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-FISSURE-ARMATURE",
                                    "linked-products": ["PROC-FISSURE-ARMATURE"]
                                }
                            }),
                            // PROCÉDÉ: Reboucher avec ciment colle blanc + bande grillagée
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-FISSURE-CIMENT-GRILLAGE",
                                name: "Reboucher avec Ciment Colle Blanc + Bande Grillagée",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-FISSURE-CIMENT-GRILLAGE",
                                    "linked-products": ["PROC-FISSURE-CIMENT-GRILLAGE"]
                                }
                            })
                        ]
                    })
                ]
            }),
            
         
            // =====================================
            // OPÉRATION 4: PRÉPARATION DU SUPPORT
            // =====================================
            new DevisModels.QuoteOperation({
                "operation-id": "OP-PREPARATION",
                name: "Préparation du Support",
                "is-mandatory": true,
                "quote-operation": [
                    // TÂCHE: PROTECTION
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-PROTECTION",
                        name: "Protection des Meubles et Appareillages",
                        "is-mandatory": true,
                        "quote-operation": [
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-PREP-PROTECTION",
                                name: "Protéger les Meubles et les Appareillages",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-PREP-PROTECTION",
                                    "linked-products": ["PROC-PREP-PROTECTION"]
                                }
                            })
                        ]
                    }),
                    
                    // TÂCHE: RATTRAPER LES DÉFAUTS (> 5mm avec ciment colle blanc)
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-DEFAUTS",
                        name: "Rattraper les Défauts (> 5mm)",
                        "is-mandatory": false,
                        "quote-operation": [
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-PREP-DEFAUTS",
                                name: "Rattraper les Défauts avec le Ciment Colle Blanc",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-PREP-DEFAUTS",
                                    "linked-products": ["PROC-PREP-DEFAUTS", "CC-BLANC-20"]
                                }
                            })
                        ]
                    }),
                    
                    // TÂCHE: ÉGRENAGE
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-EGRENAGE",
                        name: "Égrenage",
                        "is-mandatory": true,
                        "quote-operation": [
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-PREP-EGRENAGE",
                                name: "Égrenage",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-PREP-EGRENAGE",
                                    "linked-products": ["PROC-PREP-EGRENAGE"]
                                }
                            })
                        ]
                    }),
                    
                    // TÂCHE: ÉPOUSSETAGE (après égrenage)
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-EPOUSSETAGE-1",
                        name: "Époussetage (après égrenage)",
                        "is-mandatory": true,
                        "quote-operation": [
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-PREP-EPOUSSETAGE-1",
                                name: "Époussetage",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-PREP-EPOUSSETAGE-1",
                                    "linked-products": ["PROC-PREP-EPOUSSETAGE-1"]
                                }
                            })
                        ]
                    }),
                    
                    // TÂCHE: REBOUCHAGE
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-REBOUCHAGE",
                        name: "Rebouchage",
                        "is-mandatory": true,
                        "quote-operation": [
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-PREP-REBOUCHAGE",
                                name: "Rebouchage",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-PREP-REBOUCHAGE",
                                    "linked-products": ["PROC-PREP-REBOUCHAGE"]
                                }
                            })
                        ]
                    }),
                    
                    // TÂCHE: ENDUIT REPASSÉ (Finition A uniquement)
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-ENDUIT-REPASSE",
                        name: "Enduit Repassé (Finition A)",
                        "is-mandatory": true,
                        "quote-operation": [
                            // PROCÉDÉ: Ponçage initial
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-ENDUIT-PONCAGE-1",
                                name: "Ponçage (Enduit Repassé)",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-ENDUIT-PONCAGE-1",
                                    "linked-products": ["PROC-ENDUIT-PONCAGE-1"]
                                }
                            }),
                            // PROCÉDÉ: Époussetage après ponçage
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-ENDUIT-EPOUSSETAGE-1",
                                name: "Époussetage (après Ponçage Initial)",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-ENDUIT-EPOUSSETAGE-1",
                                    "linked-products": ["PROC-ENDUIT-EPOUSSETAGE-1"]
                                }
                            }),
                            // PROCÉDÉ: Enduit coloré (uniquement pour finition A)
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-ENDUIT-COLORE",
                                name: "Enduit Coloré (Finition A)",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-ENDUIT-COLORE",
                                    "linked-products": ["PROC-ENDUIT-COLORE", "EM-1500-25"]
                                }
                            }),
                            // PROCÉDÉ: Ponçage après enduit coloré
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-ENDUIT-PONCAGE-2",
                                name: "Ponçage (après Enduit Coloré)",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-ENDUIT-PONCAGE-2",
                                    "linked-products": ["PROC-ENDUIT-PONCAGE-2"]
                                }
                            }),
                            // PROCÉDÉ: Époussetage final
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-ENDUIT-EPOUSSETAGE-2",
                                name: "Époussetage Final (Enduit Repassé)",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-ENDUIT-EPOUSSETAGE-2",
                                    "linked-products": ["PROC-ENDUIT-EPOUSSETAGE-2"]
                                }
                            })
                        ]
                    })
                ]
            }),
            
            // =====================================
            // OPÉRATION 5: REVÊTEMENT
            // =====================================
            new DevisModels.QuoteOperation({
                "operation-id": "OP-REVETEMENT",
                name: "Revêtement",
                "is-mandatory": true,
                "quote-operation": [
                    // TÂCHE: IMPRESSION (pour revêtement mince)
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-IMPRESSION-MINCE",
                        name: "Impression (Revêtement Mince)",
                        "is-mandatory": true,
                        "quote-operation": [
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-REV-IMPRESSION-MINCE",
                                name: "Impression (Revêtement Mince)",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-REV-IMPRESSION-MINCE",
                                    "linked-products": ["PROC-REV-IMPRESSION-MINCE", "IM-2000-25", "ROULEAU-180-1"]
                                }
                            })
                        ]
                    }),
                    
                    // TÂCHE: COUCHE INTERMÉDIAIRE (Finition A/B)
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-COUCHE-INTERMEDIAIRE",
                        name: "Couche Intermédiaire (Finition A)",
                        "is-mandatory": true,
                        "quote-operation": [
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-REV-COUCHE-INTER",
                                name: "Couche Intermédiaire",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-REV-COUCHE-INTER",
                                    "linked-products": ["PROC-REV-COUCHE-INTER", "MI-300-30", "ROULEAU-180-1"]
                                }
                            })
                        ]
                    }),
                    
                    // TÂCHE: RÉVISION (Finition A/B)
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-REVISION",
                        name: "Révision (Finition A)",
                        "is-mandatory": true,
                        "quote-operation": [
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-REV-REVISION",
                                name: "Révision",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-REV-REVISION",
                                    "linked-products": ["PROC-REV-REVISION"]
                                }
                            })
                        ]
                    }),
                    
                    // TÂCHE: COUCHE DE FINITION (Mate) - Une des 3 options
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-COUCHE-FINITION-MATE",
                        name: "Couche de Finition (Mate)",
                        "is-mandatory": false, // Une seule des 3 finitions sera choisie
                        "quote-operation": [
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-REV-FINITION-MATE",
                                name: "Couche de Finition Mate",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-REV-FINITION-MINCE",
                                    "linked-products": ["PROC-REV-FINITION-MINCE", "MI-300-30", "ROULEAU-180-1"]
                                }
                            })
                        ]
                    }),
                    
                    // TÂCHE: COUCHE DE FINITION (Velours) - Une des 3 options
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-COUCHE-FINITION-VELOURS",
                        name: "Couche de Finition (Velours)",
                        "is-mandatory": false, // Une seule des 3 finitions sera choisie
                        "quote-operation": [
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-REV-FINITION-VELOURS",
                                name: "Couche de Finition Velours",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-REV-FINITION-MINCE",
                                    "linked-products": ["PROC-REV-FINITION-MINCE", "ME-1900-25", "ROULEAU-180-1"]
                                }
                            })
                        ]
                    }),
                    
                    // TÂCHE: COUCHE DE FINITION (Satinée) - Une des 3 options
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-COUCHE-FINITION-SATINEE",
                        name: "Couche de Finition (Satinée Brillante)",
                        "is-mandatory": false, // Une seule des 3 finitions sera choisie
                        "quote-operation": [
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-REV-FINITION-SATINEE",
                                name: "Couche de Finition Satinée",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-REV-FINITION-MINCE",
                                    "linked-products": ["PROC-REV-FINITION-MINCE", "ME-6000-25", "ROULEAU-180-1"]
                                }
                            })
                        ]
                    }),
                    
                    // TÂCHE: VERNIS DE PROTECTION (Finition A uniquement)
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-VERNIS-PROTECTION",
                        name: "Vernis de Protection - 2 Couches (Finition A)",
                        "is-mandatory": true, // Obligatoire pour finition A
                        "quote-operation": [
                            new DevisModels.QuoteOperation({
                                "operation-id": "PROC-REV-VERNIS",
                                name: "Vernis de Protection, 2 Couches",
                                "is-mandatory": true,
                                tasks: {
                                    "product-task": "PROC-REV-VERNIS",
                                    "linked-products": ["PROC-REV-VERNIS"]
                                }
                            })
                        ]
                    })
                ]
            })
        ]
    }),

    // Modèle pour finition B avec revêtement mince
    new DevisModels.QuoteModel({
        id: "quote-template-b-mince",
        "template-name": "Finition B - Revêtement Mince - Mate/Velours", 
        "template-description": "Modèle de devis pour finition soignée avec revêtement mince",
        "template-type": "Paint",
        status: "ACTIVE",
        "finishing-type-definitions": new DevisModels.FinishingTypeDefinition({
            "finishing-level": "B",
            "covering-type": "MINCE",
            "finishing-aspect": ["MATE", "VELOURS"],
            "template-category": PRODUCT_CATEGORIES.find(c => c.id === "cat-paint")
        }),
        "quote-operations": [
            new DevisModels.QuoteOperation({
                "operation-id": "OP-PREPARATION-B",
                name: "Préparation du Support (Finition B)",
                "is-mandatory": true,
                "is-process": true,
                "quote-operation": [
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-NETTOYAGE-B",
                        name: "Nettoyage et Dépoussiérage",
                        "is-mandatory": true,
                        "is-process": false,
                        tasks: {
                            "product-task": "PROC-NETTOYAGE",
                            "linked-products": ["DETERGENT-MULTI"]
                        }
                    }),
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-PREPARATION-B",
                        name: "Préparation Support (Finition B)",
                        "is-mandatory": true,
                        "is-process": false,
                        tasks: {
                            "product-task": "PROC-PREPARATION-B",
                            "linked-products": ["PAPIER-ABRASIF"]
                        }
                    })
                ]
            }),
            new DevisModels.QuoteOperation({
                "operation-id": "OP-PEINTURE-B",
                name: "Application Peinture (Finition B)",
                "is-mandatory": true,
                "is-process": true,
                "quote-operation": [
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-PRIMAIRE-B",
                        name: "Couche de Primaire",
                        "is-mandatory": true,
                        "is-process": false,
                        tasks: {
                            "product-task": "PROC-PRIMAIRE",
                            "linked-products": ["PRIMAIRE-MULTIFIX"]
                        }
                    }),
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-PEINTURE-B",
                        name: "Peinture Finition B",
                        "is-mandatory": true,
                        "is-process": false,
                        tasks: {
                            "product-task": "PROC-PEINTURE-FINITION",
                            "linked-products": ["PEINTURE-MATE-MULTI"]
                        }
                    })
                ]
            })
        ]
    }),

    // Modèle pour finition A avec revêtement épais
    new DevisModels.QuoteModel({
        id: "quote-template-a-epais",
        "template-name": "Finition A - Revêtement Épais - Tous Aspects",
        "template-description": "Modèle de devis pour finition parfaite avec revêtement épais",
        "template-type": "Paint", 
        status: "ACTIVE",
        "finishing-type-definitions": new DevisModels.FinishingTypeDefinition({
            "finishing-level": "A",
            "covering-type": "EPAIS",
            "finishing-aspect": ["MATE", "VELOURS", "SATINEE_BRILLANTE"],
            "template-category": PRODUCT_CATEGORIES.find(c => c.id === "cat-paint")
        }),
        "quote-operations": [
            new DevisModels.QuoteOperation({
                "operation-id": "OP-PREPARATION-EPAIS",
                name: "Préparation pour Revêtement Épais",
                "is-mandatory": true,
                "is-process": true,
                "quote-operation": [
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-EGRENAGE-EPAIS",
                        name: "Égrenage Renforcé",
                        "is-mandatory": true,
                        "is-process": false,
                        tasks: {
                            "product-task": "PROC-EGRENAGE",
                            "linked-products": ["PAPIER-ABRASIF"]
                        }
                    }),
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-ENDUIT-EPAIS",
                        name: "Enduit Épais de Lissage",
                        "is-mandatory": true,
                        "is-process": false,
                        tasks: {
                            "product-task": "PROC-ENDUIT-EPAIS",
                            "linked-products": ["EM-1500-MULTICOAT-30"]
                        }
                    })
                ]
            }),
            new DevisModels.QuoteOperation({
                "operation-id": "OP-REVETEMENT-EPAIS",
                name: "Revêtement Épais",
                "is-mandatory": true,
                "is-process": true,
                "quote-operation": [
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-PRIMAIRE-EPAIS",
                        name: "Primaire d'Accrochage",
                        "is-mandatory": true,
                        "is-process": false,
                        tasks: {
                            "product-task": "PROC-PRIMAIRE",
                            "linked-products": ["PRIMAIRE-MULTIFIX"]
                        }
                    }),
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-FINITION-EPAIS",
                        name: "Revêtement de Finition Épais",
                        "is-mandatory": true,
                        "is-process": false,
                        tasks: {
                            "product-task": "PROC-PEINTURE-FINITION",
                            "linked-products": ["PEINTURE-MATE-MULTI"]
                        }
                    })
                ]
            })
        ]
    }),

    // Modèle pour finition C 
    new DevisModels.QuoteModel({
        id: "quote-template-c-mince",
        "template-name": "Finition C - Revêtement Mince - Mate Uniquement",
        "template-description": "Modèle de devis pour finition courante avec revêtement mince",
        "template-type": "Paint",
        status: "ACTIVE",
        "finishing-type-definitions": new DevisModels.FinishingTypeDefinition({
            "finishing-level": "C",
            "covering-type": "MINCE",
            "finishing-aspect": ["MATE"],
            "template-category": PRODUCT_CATEGORIES.find(c => c.id === "cat-paint")
        }),
        "quote-operations": [
            new DevisModels.QuoteOperation({
                "operation-id": "OP-PREPARATION-C",
                name: "Préparation Simplifiée (Finition C)",
                "is-mandatory": true,
                "is-process": true,
                "quote-operation": [
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-NETTOYAGE-C",
                        name: "Nettoyage Simple",
                        "is-mandatory": true,
                        "is-process": false,
                        tasks: {
                            "product-task": "PROC-NETTOYAGE",
                            "linked-products": ["DETERGENT-MULTI"]
                        }
                    })
                ]
            }),
            new DevisModels.QuoteOperation({
                "operation-id": "OP-PEINTURE-C",
                name: "Peinture Finition Courante",
                "is-mandatory": true,
                "is-process": true,
                "quote-operation": [
                    new DevisModels.QuoteOperation({
                        "operation-id": "TASK-PEINTURE-C",
                        name: "Application Peinture Mate",
                        "is-mandatory": true,
                        "is-process": false,
                        tasks: {
                            "product-task": "PROC-PEINTURE-FINITION",
                            "linked-products": ["PEINTURE-MATE-MULTI"]
                        }
                    })
                ]
            })
        ]
    })
];

// === Exemples de devis existants ===
const SAMPLE_QUOTATIONS = [
    new DevisModels.Quotation({
        id: "DEV-2024-001",
        name: "TA-PAUL-1-2024",
        "quote-template-id": "quote-template-a-mince",
        "finishing-type-definition": new DevisModels.FinishingTypeDefinition({
            "finishing-level": "A",
            "covering-type": "MINCE",
            "finishing-aspect": ["MATE", "SATINEE_BRILLANTE"]
        }),
        chantier: CHANTIERS_DATA[0],
        "objet-devis": "Rénovation peinture salon : murs en mat et boiseries en satiné",
        "quotation-items": [
            new DevisModels.QuotationItem({
                "quote-operation-id": "OP-PREPARATION",
                name: "Préparation du Support",
                "is-active": true,
                tasks: [
                    new DevisModels.QuotationTask({
                        "product-task": PRODUCTS_DATA.find(p => p.code === "PROC-EGRENAGE"),
                        name: "Égrenage et Époussetage",
                        superficie: 55,
                        uom: "m2", 
                        "base-price": 100,
                        "effective-price": 100,
                        "technician-price": 90,
                        "laborer-price": 90,
                        "nombre-tacherons": 1,
                        "linked-products": [
                            new DevisModels.LinkedProduct({
                                product: PRODUCTS_DATA.find(p => p.code === "PAPIER-ABRASIF"),
                                "base-price": 500,
                                "effective-price": 500,
                                "technician-price": 400,
                                "ordered-quantity": 3
                            })
                        ]
                    }),
                    new DevisModels.QuotationTask({
                        "product-task": PRODUCTS_DATA.find(p => p.code === "PROC-ENDUIT-COLORE"),
                        name: "Application Enduit Coloré",
                        superficie: 55,
                        uom: "m2",
                        "base-price": 850,
                        "effective-price": 850,
                        "technician-price": 750,
                        "laborer-price": 600,
                        "nombre-tacherons": 1,
                        "linked-products": [
                            new DevisModels.LinkedProduct({
                                product: PRODUCTS_DATA.find(p => p.code === "EM-1500-MULTICOAT-30"),
                                "base-price": 8500,
                                "effective-price": 8000, // Prix négocié
                                "technician-price": 7500,
                                "ordered-quantity": 5
                            })
                        ]
                    })
                ]
            }),
            new DevisModels.QuotationItem({
                "quote-operation-id": "OP-REVETEMENT",
                name: "Revêtement",
                "is-active": true,
                tasks: [
                    new DevisModels.QuotationTask({
                        "product-task": PRODUCTS_DATA.find(p => p.code === "PROC-FINITION-MI300"),
                        name: "Couche de finition en MI 300 (Mat)",
                        superficie: 45,
                        uom: "m2",
                        "base-price": 650,
                        "effective-price": 650,
                        "technician-price": 550,
                        "laborer-price": 450,
                        "nombre-tacherons": 2,
                        "linked-products": [
                            new DevisModels.LinkedProduct({
                                product: PRODUCTS_DATA.find(p => p.code === "MI-300-30"),
                                "base-price": 15000,
                                "effective-price": 15000,
                                "technician-price": 13500,
                                "ordered-quantity": 3
                            }),
                            new DevisModels.LinkedProduct({
                                product: PRODUCTS_DATA.find(p => p.code === "MI-300-5"),
                                "base-price": 3000,
                                "effective-price": 3000,
                                "technician-price": 2700,
                                "ordered-quantity": 2
                            })
                        ]
                    })
                ]
            })
        ],
        planning: new DevisModels.Planning({
            "estimated-executions": 12,
            unit: "day",
            "projected-start-date": "2024-07-15",
            "estimated-lead-time-days": 15
        }),
        "financial-details": new DevisModels.FinancialDetails({
            "total-price-ht": 145750,
            "global-discount": 25000,
            "final-price": 120750
        }),
        status: new DevisModels.QuoteStatus({
            "emission-date": "2024-06-25",
            status: "SENT",
            "expiration-date": "2024-07-12",
            "sent-date": "2024-06-25"
        }),
        createdBy: "TECH-001",
        createdAt: "2024-06-25T10:30:00Z"
    }),

    new DevisModels.Quotation({
        id: "DEV-2024-002",
        name: "TA-PAUL-2-2024", 
        "quote-template-id": "quote-template-a-mince",
        chantier: CHANTIERS_DATA[1],
        "objet-devis": "Peinture villa moderne - Extérieur et intérieur",
        "quotation-items": [],
        planning: new DevisModels.Planning({
            "estimated-executions": 0,
            unit: "day"
        }),
        "financial-details": new DevisModels.FinancialDetails({
            "total-price-ht": 0,
            "final-price": 0
        }),
        status: new DevisModels.QuoteStatus({
            "emission-date": "2024-06-26",
            status: "DRAFT",
            "expiration-date": "2024-07-26"
        }),
        createdBy: "TECH-001",
        createdAt: "2024-06-26T14:15:00Z"
    }),

    new DevisModels.Quotation({
        id: "DEV-2024-003",
        name: "TA-PAUL-3-2024",
        "quote-template-id": "quote-template-a-mince",
        chantier: CHANTIERS_DATA[0],
        "objet-devis": "Devis test - Finition A Mate",
        "quotation-items": [],
        planning: new DevisModels.Planning({
            "estimated-executions": 8,
            unit: "day"
        }),
        "financial-details": new DevisModels.FinancialDetails({
            "total-price-ht": 85000,
            "global-discount": 5000,
            "final-price": 80000
        }),
        status: new DevisModels.QuoteStatus({
            "emission-date": "2024-06-20",
            status: "ACCEPTED",
            "expiration-date": "2024-07-20",
            "sent-date": "2024-06-20",
            "accepted-date": "2024-06-22"
        }),
        createdBy: "TECH-001",
        createdAt: "2024-06-20T09:00:00Z"
    }),

    new DevisModels.Quotation({
        id: "DEV-2024-004",
        name: "TA-PAUL-4-2024",
        "quote-template-id": "quote-template-a-mince",
        chantier: CHANTIERS_DATA[2],
        "objet-devis": "Bureaux CAMTEL - Peinture intérieure",
        "quotation-items": [],
        planning: new DevisModels.Planning({
            "estimated-executions": 20,
            unit: "day"
        }),
        "financial-details": new DevisModels.FinancialDetails({
            "total-price-ht": 275000,
            "global-discount": 15000,
            "final-price": 260000
        }),
        status: new DevisModels.QuoteStatus({
            "emission-date": "2024-06-18",
            status: "REFUSED",
            "expiration-date": "2024-07-18",
            "sent-date": "2024-06-18"
        }),
        createdBy: "TECH-001", 
        createdAt: "2024-06-18T16:45:00Z"
    }),

    new DevisModels.Quotation({
        id: "DEV-2024-005",
        name: "TA-PAUL-5-2024",
        "quote-template-id": "quote-template-a-mince",
        chantier: CHANTIERS_DATA[1],
        "objet-devis": "Villa Bonanjo - Phase 1 Intérieur",
        "quotation-items": [],
        planning: new DevisModels.Planning({
            "estimated-executions": 25,
            unit: "day"
        }),
        "financial-details": new DevisModels.FinancialDetails({
            "total-price-ht": 450000,
            "global-discount": 50000,
            "final-price": 400000
        }),
        status: new DevisModels.QuoteStatus({
            "emission-date": "2024-06-27",
            status: "PENDING_VALIDATION",
            "expiration-date": "2024-07-27"
        }),
        createdBy: "TECH-001",
        createdAt: "2024-06-27T11:20:00Z"
    })
];

// Calculer les totaux et marges pour les devis existants
SAMPLE_QUOTATIONS.forEach(quotation => {
    quotation.calculateTotalHT();
    quotation.calculateFinalPrice();
});

// === Export des données ===
window.MockData = {
    CURRENT_TECHNICIAN,
    UOM_DATA,
    PRODUCT_CATEGORIES,
    PRODUCTS_DATA,
    CHANTIERS_DATA,
    QUOTE_TEMPLATES,
    SAMPLE_QUOTATIONS
}; 