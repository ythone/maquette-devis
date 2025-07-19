/**
 * MODÈLE COMPLET : FINITION A - REVÊTEMENT MINCE - MATE/VELOURS/SATINÉE
 * Basé sur les données réelles de devis-data.js
 * 
 * Ce modèle inclut toutes les opérations, tâches, procédés et produits 
 * nécessaires pour une finition parfaite (A) avec revêtement mince.
 */

const QUOTE_TEMPLATE_A_MINCE_COMPLETE = new DevisModels.QuoteModel({
    id: "quote-template-a-mince-complete",
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
                        }),
                        // PROCÉDÉ: Casser le support
                        new DevisModels.QuoteOperation({
                            "operation-id": "PROC-HUMID-CASSER",
                            name: "Casser le Support",
                            "is-mandatory": false,
                            tasks: {
                                "product-task": "PROC-HUMID-CASSER",
                                "linked-products": ["PROC-HUMID-CASSER"]
                            }
                        }),
                        // PROCÉDÉ: Réparer la fuite
                        new DevisModels.QuoteOperation({
                            "operation-id": "PROC-HUMID-REPARER-FUITE",
                            name: "Réparer la Fuite",
                            "is-mandatory": false,
                            tasks: {
                                "product-task": "PROC-HUMID-REPARER-FUITE",
                                "linked-products": ["PROC-HUMID-REPARER-FUITE"]
                            }
                        }),
                        // PROCÉDÉ: Refermer le support
                        new DevisModels.QuoteOperation({
                            "operation-id": "PROC-HUMID-REFERMER",
                            name: "Refermer le Support",
                            "is-mandatory": false,
                            tasks: {
                                "product-task": "PROC-HUMID-REFERMER",
                                "linked-products": ["PROC-HUMID-REFERMER"]
                            }
                        })
                    ]
                }),
                
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
                                "linked-products": ["PROC-SAIGNEE-COUPER"]
                            }
                        }),
                        // PROCÉDÉ: Pose polyane + mortier étanche
                        new DevisModels.QuoteOperation({
                            "operation-id": "PROC-SAIGNEE-POLYANE",
                            name: "Pose Polyane + Mortier Étanche",
                            "is-mandatory": true,
                            tasks: {
                                "product-task": "PROC-SAIGNEE-POLYANE",
                                "linked-products": ["PROC-SAIGNEE-POLYANE"]
                            }
                        }),
                        // PROCÉDÉ: Maçonner pour refermer
                        new DevisModels.QuoteOperation({
                            "operation-id": "PROC-SAIGNEE-MACONNER",
                            name: "Maçonner pour Refermer les Murs",
                            "is-mandatory": true,
                            tasks: {
                                "product-task": "PROC-SAIGNEE-MACONNER",
                                "linked-products": ["PROC-SAIGNEE-MACONNER"]
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
                        })
                    ]
                }),
                
                // TÂCHE: ASSAINISSEMENT DU SUPPORT
                new DevisModels.QuoteOperation({
                    "operation-id": "TASK-ASSAINISSEMENT",
                    name: "Assainissement du Support",
                    "is-mandatory": false,
                    "quote-operation": [
                        // PROCÉDÉ: Appliquer le liquide 940 antifongique
                        new DevisModels.QuoteOperation({
                            "operation-id": "PROC-ASSAIN-940",
                            name: "Appliquer le Liquide 940 Antifongique",
                            "is-mandatory": true,
                            tasks: {
                                "product-task": "PROC-ASSAIN-940",
                                "linked-products": ["PROC-ASSAIN-940"]
                            }
                        }),
                        // PROCÉDÉ: Pulvériser le liquide 1240
                        new DevisModels.QuoteOperation({
                            "operation-id": "PROC-ASSAIN-1240",
                            name: "Pulvériser le Liquide 1240 sur le Support",
                            "is-mandatory": true,
                            tasks: {
                                "product-task": "PROC-ASSAIN-1240",
                                "linked-products": ["PROC-ASSAIN-1240"]
                            }
                        }),
                        // PROCÉDÉ: Rincer le support
                        new DevisModels.QuoteOperation({
                            "operation-id": "PROC-ASSAIN-RINCER",
                            name: "Rincer le Support",
                            "is-mandatory": true,
                            tasks: {
                                "product-task": "PROC-ASSAIN-RINCER",
                                "linked-products": ["PROC-ASSAIN-RINCER"]
                            }
                        }),
                        // PROCÉDÉ: Appliquer le liquide 940 final
                        new DevisModels.QuoteOperation({
                            "operation-id": "PROC-ASSAIN-940-FINAL",
                            name: "Appliquer le Liquide 940 sur le Support",
                            "is-mandatory": true,
                            tasks: {
                                "product-task": "PROC-ASSAIN-940-FINAL",
                                "linked-products": ["PROC-ASSAIN-940-FINAL"]
                            }
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
        // OPÉRATION 3: REGARNISSAGE DES JOINTS
        // =====================================
        new DevisModels.QuoteOperation({
            "operation-id": "OP-JOINTS",
            name: "Regarnissage des Joints",
            "is-mandatory": false,
            "quote-operation": [
                // PROCÉDÉ: Dégarnissage des joints
                new DevisModels.QuoteOperation({
                    "operation-id": "PROC-JOINTS-DEGARNIS",
                    name: "Dégarnissage des Joints",
                    "is-mandatory": true,
                    tasks: {
                        "product-task": "PROC-JOINTS-DEGARNIS",
                        "linked-products": ["PROC-JOINTS-DEGARNIS"]
                    }
                }),
                // PROCÉDÉ: Regarnissage des joints
                new DevisModels.QuoteOperation({
                    "operation-id": "PROC-JOINTS-REGARNIS",
                    name: "Regarnissage des Joints",
                    "is-mandatory": true,
                    tasks: {
                        "product-task": "PROC-JOINTS-REGARNIS",
                        "linked-products": ["PROC-JOINTS-REGARNIS"]
                    }
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
});

/**
 * PRODUITS RÉFÉRENCES DANS CE MODÈLE
 * 
 * Les codes produits suivants de devis-data.js sont utilisés :
 * 
 * PEINTURES:
 * - MI-300-30 : Peinture acrylique mate premium intérieure 30kg (290.00 FCFA, rendement 195m²)
 * - ME-1900-25 : Peinture velours haut de gamme 25kg (690.00 FCFA, rendement 225m²)
 * - ME-6000-25 : Peinture satinée 25kg (790.00 FCFA, rendement 250m²)
 * 
 * IMPRESSION:
 * - IM-2000-25 : Impression universelle 25kg (590.00 FCFA, rendement 250m²)
 * 
 * ENDUITS:
 * - EM-1500-25 : Enduit de lissage prêt à l'emploi 25kg (350.00 FCFA, rendement 40m²)
 * - CC-BLANC-20 : Ciment colle blanc 20kg (55.00 FCFA, rendement 5m²)
 * 
 * OUTILLAGE:
 * - ROULEAU-180-1 : Rouleau laqueur professionnel 180mm (30.00 FCFA, rendement 50m²)
 * 
 * PROCÉDÉS (avec codes variants de devis-data.js):
 * - Tous les procédés de pathologie (PROC-HUMID-*, PROC-SAIGNEE-*, PROC-INJECTION-*, PROC-ASSAIN-*)
 * - Tous les procédés de fissures (PROC-FISSURE-*)
 * - Tous les procédés de joints (PROC-JOINTS-*)
 * - Tous les procédés de préparation (PROC-PREP-*, PROC-ENDUIT-*)
 * - Tous les procédés de revêtement (PROC-REV-*)
 * 
 * PRIX ESTIMÉS POUR FINITION A MINCE (50m²):
 * - Impression: 590 FCFA + main d'œuvre ~25,000 FCFA
 * - Couche intermédiaire: 290 FCFA + main d'œuvre ~25,000 FCFA  
 * - Finition (selon aspect): 290-790 FCFA + main d'œuvre ~25,000 FCFA
 * - Enduit repassé: 350 FCFA + main d'œuvre ~30,000 FCFA
 * - Procédés optionnels: variable selon besoins
 * 
 * TOTAL ESTIMÉ (hors procédés optionnels): ~120,000 - 150,000 FCFA pour 50m²
 */ 