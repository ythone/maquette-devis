// ===============================================
// WIZARD STEP 4: Personnalisation et Conditions
// ===============================================

class WizardStep4Manager {
    constructor() {
        this.currentQuotation = null;
        this.selectedCertifications = [];
        this.selectedMedia = [];
        this.availableCertifications = [
            { id: 'cert_multiflex_n1', name: 'Applicateur Certifié Multiflex N1', verified: true },
            { id: 'cert_multiflex_n2', name: 'Applicateur Certifié Multiflex N2', verified: true },
            { id: 'cert_peinture_deco', name: 'Spécialiste Peinture Décorative', verified: true },
            { id: 'cert_artisan_qualifie', name: 'Artisan Qualifié BTP', verified: false },
            { id: 'cert_eco_responsable', name: 'Applicateur Éco-Responsable', verified: true }
        ];
        
        this.predefinedConditions = {
            access: {
                title: "Conditions d'accès au chantier",
                content: "• Accès libre au chantier aux heures ouvrables (7h-17h)\n• Place de parking disponible pour véhicule de service\n• Accès à un point d'eau et électricité\n• Protection des accès nécessaire"
            },
            preparation: {
                title: "Préparation du support",
                content: "• Nettoyage préalable des surfaces par le client\n• Protection des meubles et objets de valeur\n• Déplacement des éléments mobiles\n• Support sec et propre avant intervention"
            },
            weather: {
                title: "Conditions météorologiques",
                content: "• Report automatique en cas d'intempéries\n• Température entre 5°C et 30°C requise\n• Humidité relative < 85%\n• Absence de gel pendant 48h après application"
            }
        };
        
        this.init();
    }

    init() {
        this.loadQuotationData();
        this.setupEventListeners();
        this.renderInterface();
    }

    loadQuotationData() {
        const savedData = localStorage.getItem('currentQuotation');
        if (savedData) {
            this.currentQuotation = JSON.parse(savedData);
            console.log('Données chargées pour étape 4:', this.currentQuotation);
        } else {
            console.error('Aucune donnée de devis trouvée');
            alert('Erreur: Aucune donnée de devis. Retour à l\'étape précédente.');
            window.location.href = 'create-step3.html';
            return;
        }

        // Initialiser les sections si nécessaire
        if (!this.currentQuotation.warranty) {
            this.currentQuotation.warranty = {
                type: 'TRIENNALE',
                duration: 36,
                description: ''
            };
        }
        if (!this.currentQuotation.conditions) {
            this.currentQuotation.conditions = {
                contractualNotes: '',
                clientResponsibilities: ''
            };
        }
        if (!this.currentQuotation.media) {
            this.currentQuotation.media = [];
        }
        if (!this.currentQuotation.certifications) {
            this.currentQuotation.certifications = [];
        }
    }

    setupEventListeners() {
        // Sauvegarde automatique
        setInterval(() => {
            this.saveProgress();
        }, 30000);

        // Écouter les changements dans les champs de texte
        document.getElementById('warrantyDescription').addEventListener('input', () => {
            this.currentQuotation.warranty.description = document.getElementById('warrantyDescription').value;
            this.updatePreview();
        });

        document.getElementById('contractualNotes').addEventListener('input', () => {
            this.currentQuotation.conditions.contractualNotes = document.getElementById('contractualNotes').value;
            this.updatePreview();
        });

        document.getElementById('clientResponsibilities').addEventListener('input', () => {
            this.currentQuotation.conditions.clientResponsibilities = document.getElementById('clientResponsibilities').value;
            this.updatePreview();
        });
    }

    renderInterface() {
        this.setupWarranty();
        this.loadExistingData();
        this.renderCertifications();
        this.renderMediaList();
        this.updatePreview();
    }

    setupWarranty() {
        const criteria = this.currentQuotation.technicalCriteria;
        const warrantySelect = document.getElementById('warrantyType');
        
        // Déterminer la garantie automatique selon la finition
        if (criteria && criteria.niveauFinition === 'A') {
            warrantySelect.value = 'TRIENNALE';
            this.currentQuotation.warranty.type = 'TRIENNALE';
            this.currentQuotation.warranty.duration = 36;
            document.getElementById('warrantyText').textContent = 
                'Finition A détectée : Garantie Triennale (3 ans) recommandée et pré-sélectionnée.';
        } else if (criteria && criteria.niveauFinition === 'B') {
            warrantySelect.value = 'BIENNALE';
            this.currentQuotation.warranty.type = 'BIENNALE';
            this.currentQuotation.warranty.duration = 24;
            document.getElementById('warrantyText').textContent = 
                'Finition B détectée : Garantie Biennale (2 ans) recommandée et pré-sélectionnée.';
        } else {
            warrantySelect.value = 'ANNUELLE';
            this.currentQuotation.warranty.type = 'ANNUELLE';
            this.currentQuotation.warranty.duration = 12;
            document.getElementById('warrantyText').textContent = 
                'Finition C ou autre : Garantie Annuelle (1 an) pré-sélectionnée.';
        }
    }

    loadExistingData() {
        // Charger les données existantes dans les champs
        document.getElementById('warrantyType').value = this.currentQuotation.warranty.type || 'TRIENNALE';
        document.getElementById('warrantyDescription').value = this.currentQuotation.warranty.description || '';
        document.getElementById('contractualNotes').value = this.currentQuotation.conditions.contractualNotes || '';
        document.getElementById('clientResponsibilities').value = this.currentQuotation.conditions.clientResponsibilities || '';
        
        this.updateWarrantyType();
    }

    updateWarrantyType() {
        const warrantyType = document.getElementById('warrantyType').value;
        const customSection = document.getElementById('customWarrantySection');
        
        if (warrantyType === 'CUSTOM') {
            customSection.classList.remove('hidden');
            const customDuration = parseInt(document.getElementById('customWarrantyDuration').value) || 12;
            this.currentQuotation.warranty.duration = customDuration;
        } else {
            customSection.classList.add('hidden');
            
            const durations = {
                'TRIENNALE': 36,
                'BIENNALE': 24,
                'ANNUELLE': 12
            };
            this.currentQuotation.warranty.duration = durations[warrantyType] || 12;
        }
        
        this.currentQuotation.warranty.type = warrantyType;
        this.updatePreview();
    }

    renderCertifications() {
        const container = document.getElementById('certificationsList');
        container.innerHTML = '';
        
        this.availableCertifications.forEach(cert => {
            const certDiv = document.createElement('div');
            certDiv.className = 'flex items-center justify-between p-3 border border-gray-200 rounded-lg';
            
            const isSelected = this.currentQuotation.certifications.includes(cert.id);
            
            certDiv.innerHTML = `
                <div class="flex items-center space-x-3">
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" ${isSelected ? 'checked' : ''} 
                               ${!cert.verified ? 'disabled' : ''}
                               onchange="wizardManager.toggleCertification('${cert.id}')" 
                               class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                                    ${cert.verified ? 'peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary' : 'opacity-50'}"></div>
                    </label>
                    <div>
                        <div class="font-medium text-gray-900">${cert.name}</div>
                        <div class="text-sm ${cert.verified ? 'text-green-600' : 'text-red-600'}">
                            <i class="fas ${cert.verified ? 'fa-check-circle' : 'fa-times-circle'} mr-1"></i>
                            ${cert.verified ? 'Vérifiée' : 'En attente de validation'}
                        </div>
                    </div>
                </div>
                ${cert.verified ? '' : `
                    <div class="text-xs text-gray-500">
                        Non disponible
                    </div>
                `}
            `;
            
            container.appendChild(certDiv);
        });
    }

    toggleCertification(certId) {
        const index = this.currentQuotation.certifications.indexOf(certId);
        if (index > -1) {
            this.currentQuotation.certifications.splice(index, 1);
        } else {
            this.currentQuotation.certifications.push(certId);
        }
        this.updatePreview();
    }

    addPredefinedCondition(type) {
        const condition = this.predefinedConditions[type];
        if (!condition) return;
        
        const currentNotes = document.getElementById('contractualNotes').value;
        const separator = currentNotes ? '\n\n' : '';
        const newContent = currentNotes + separator + condition.title + ':\n' + condition.content;
        
        document.getElementById('contractualNotes').value = newContent;
        this.currentQuotation.conditions.contractualNotes = newContent;
        this.updatePreview();
    }

    addMediaFromGallery() {
        // Simuler la sélection depuis la galerie du chantier
        const demoImages = [
            { id: 'demo_1', name: 'État initial mur salon', type: 'image', source: 'gallery' },
            { id: 'demo_2', name: 'Préparation surface', type: 'image', source: 'gallery' },
            { id: 'demo_3', name: 'Test couleur', type: 'image', source: 'gallery' }
        ];
        
        this.showMediaSelector(demoImages, 'Galerie du Chantier');
    }

    addMediaFromDevice() {
        // Simuler l'accès à l'appareil
        alert('Fonctionnalité disponible sur mobile : Accès à la caméra/galerie de l\'appareil');
        
        // Pour la démo, ajouter une image simulée
        const newMedia = {
            id: 'device_' + Date.now(),
            name: 'Photo depuis appareil',
            type: 'image',
            source: 'device',
            url: 'https://via.placeholder.com/400x300/6db74c/FFFFFF?text=Photo+Appareil'
        };
        
        this.selectedMedia.push(newMedia);
        this.currentQuotation.media = this.selectedMedia;
        this.renderMediaList();
    }

    generateAIImage() {
        document.getElementById('aiImageModal').classList.remove('hidden');
    }

    closeAIModal() {
        document.getElementById('aiImageModal').classList.add('hidden');
    }

    generateImage() {
        const prompt = document.getElementById('aiPrompt').value.trim();
        if (!prompt) {
            alert('Veuillez saisir une description pour générer l\'image.');
            return;
        }
        
        this.closeAIModal();
        
        // Simuler la génération IA
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        loadingDiv.innerHTML = `
            <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span class="text-gray-700 font-medium">Génération en cours...</span>
            </div>
        `;
        document.body.appendChild(loadingDiv);
        
        setTimeout(() => {
            document.body.removeChild(loadingDiv);
            
            const newMedia = {
                id: 'ai_' + Date.now(),
                name: 'Image générée par IA',
                type: 'image',
                source: 'ai',
                prompt: prompt,
                url: 'https://via.placeholder.com/400x300/263c89/FFFFFF?text=Image+IA'
            };
            
            this.selectedMedia.push(newMedia);
            this.currentQuotation.media = this.selectedMedia;
            this.renderMediaList();
            
            document.getElementById('aiPrompt').value = '';
        }, 2000);
    }

    showMediaSelector(mediaList, title) {
        // Créer une modale de sélection simple pour la démo
        const selectedItems = mediaList.slice(0, 2); // Simuler sélection de 2 items
        
        selectedItems.forEach((item, index) => {
            const newMedia = {
                ...item,
                url: `https://via.placeholder.com/400x300/6db74c/FFFFFF?text=${encodeURIComponent(item.name)}`
            };
            this.selectedMedia.push(newMedia);
        });
        
        this.currentQuotation.media = this.selectedMedia;
        this.renderMediaList();
    }

    renderMediaList() {
        const container = document.getElementById('mediaList');
        container.innerHTML = '';
        
        if (this.selectedMedia.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <i class="fas fa-images text-4xl mb-3"></i>
                    <p>Aucun média ajouté</p>
                    <p class="text-sm">Ajoutez des images pour illustrer votre devis</p>
                </div>
            `;
            return;
        }
        
        this.selectedMedia.forEach((media, index) => {
            const mediaDiv = document.createElement('div');
            mediaDiv.className = 'flex items-center space-x-4 p-4 border border-gray-200 rounded-lg';
            
            const sourceIcons = {
                gallery: 'fa-folder-open text-blue-500',
                device: 'fa-camera text-green-500',
                ai: 'fa-magic text-purple-500'
            };
            
            mediaDiv.innerHTML = `
                <div class="flex-shrink-0">
                    <img src="${media.url}" alt="${media.name}" 
                         class="w-16 h-16 object-cover rounded-lg cursor-pointer"
                         onclick="wizardManager.previewMedia('${media.url}', '${media.name}')">
                </div>
                <div class="flex-1">
                    <div class="font-medium text-gray-900">${media.name}</div>
                    <div class="text-sm text-gray-500 flex items-center">
                        <i class="fas ${sourceIcons[media.source]} mr-2"></i>
                        ${media.source === 'ai' ? `IA: ${media.prompt?.substring(0, 50)}...` : 
                          media.source === 'gallery' ? 'Galerie chantier' : 'Mon appareil'}
                    </div>
                </div>
                <button onclick="wizardManager.removeMedia(${index})" 
                        class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            container.appendChild(mediaDiv);
        });
    }

    previewMedia(url, name) {
        document.getElementById('mediaPreviewImage').src = url;
        document.getElementById('mediaPreviewImage').alt = name;
        document.getElementById('mediaPreviewModal').classList.remove('hidden');
    }

    closeMediaPreview() {
        document.getElementById('mediaPreviewModal').classList.add('hidden');
    }

    removeMedia(index) {
        if (confirm('Supprimer ce média ?')) {
            this.selectedMedia.splice(index, 1);
            this.currentQuotation.media = this.selectedMedia;
            this.renderMediaList();
        }
    }

    updatePreview() {
        const preview = document.getElementById('conditionsPreview');
        let content = '';
        
        // Garantie
        const warrantyDuration = this.currentQuotation.warranty.duration;
        const warrantyText = warrantyDuration > 12 ? 
            `${Math.floor(warrantyDuration / 12)} an${warrantyDuration > 24 ? 's' : ''}` :
            `${warrantyDuration} mois`;
            
        content += `<div class="mb-4">
            <h4 class="font-bold text-gray-900 mb-2">GARANTIE</h4>
            <p class="text-sm">Garantie de ${warrantyText} sur les travaux de peinture.</p>`;
            
        if (this.currentQuotation.warranty.description) {
            content += `<p class="text-sm mt-2">${this.currentQuotation.warranty.description}</p>`;
        }
        content += '</div>';
        
        // Notes contractuelles
        if (this.currentQuotation.conditions.contractualNotes) {
            content += `<div class="mb-4">
                <h4 class="font-bold text-gray-900 mb-2">CONDITIONS PARTICULIÈRES</h4>
                <p class="text-sm whitespace-pre-line">${this.currentQuotation.conditions.contractualNotes}</p>
            </div>`;
        }
        
        // Prestations client
        if (this.currentQuotation.conditions.clientResponsibilities) {
            content += `<div class="mb-4">
                <h4 class="font-bold text-gray-900 mb-2">À LA CHARGE DU CLIENT</h4>
                <p class="text-sm whitespace-pre-line">${this.currentQuotation.conditions.clientResponsibilities}</p>
            </div>`;
        }
        
        // Certifications
        if (this.currentQuotation.certifications.length > 0) {
            content += `<div class="mb-4">
                <h4 class="font-bold text-gray-900 mb-2">CERTIFICATIONS</h4>
                <div class="flex flex-wrap gap-2">`;
                
            this.currentQuotation.certifications.forEach(certId => {
                const cert = this.availableCertifications.find(c => c.id === certId);
                if (cert) {
                    content += `<span class="inline-flex items-center px-2 py-1 bg-primary text-white text-xs rounded">
                        <i class="fas fa-award mr-1"></i>${cert.name}
                    </span>`;
                }
            });
            
            content += '</div></div>';
        }
        
        if (!content) {
            content = '<p class="text-gray-500 italic">Aucune condition spécifique ajoutée</p>';
        }
        
        preview.innerHTML = content;
    }

    refreshPreview() {
        this.updatePreview();
    }

    saveProgress() {
        localStorage.setItem('currentQuotation', JSON.stringify(this.currentQuotation));
        console.log('Étape 4 - Progression sauvegardée');
    }

    validateStep() {
        // Validation basique
        if (!this.currentQuotation.warranty.type) {
            alert('Erreur: Veuillez sélectionner un type de garantie.');
            return false;
        }
        
        if (this.currentQuotation.warranty.type === 'CUSTOM') {
            const duration = parseInt(document.getElementById('customWarrantyDuration').value);
            if (!duration || duration < 1 || duration > 60) {
                alert('Erreur: La durée de garantie personnalisée doit être entre 1 et 60 mois.');
                return false;
            }
            this.currentQuotation.warranty.duration = duration;
        }
        
        return true;
    }

    goToStep5() {
        if (!this.validateStep()) {
            return;
        }
        
        this.saveProgress();
        window.location.href = 'create-step5.html';
    }

    goBack() {
        if (confirm('Êtes-vous sûr de vouloir revenir à l\'étape précédente ? Vos modifications seront sauvegardées.')) {
            this.saveProgress();
            window.location.href = 'create-step3.html';
        }
    }

    showHelp() {
        alert('Aide - Personnalisation et Conditions:\n\n' +
              '1. La garantie est automatiquement suggérée selon la finition\n' +
              '2. Ajoutez des notes contractuelles si nécessaire\n' +
              '3. Précisez les prestations à la charge du client\n' +
              '4. Ajoutez des médias pour illustrer le rendu attendu\n' +
              '5. Sélectionnez vos certifications validées\n' +
              '6. Prévisualisez le rendu final des conditions\n\n' +
              'Ces éléments renforceront la crédibilité de votre devis.');
    }
}

// Variables globales
let wizardManager;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    wizardManager = new WizardStep4Manager();
});

// Fonctions globales pour les handlers
function updateWarrantyType() {
    wizardManager.updateWarrantyType();
}

function addPredefinedCondition(type) {
    wizardManager.addPredefinedCondition(type);
}

function addMediaFromGallery() {
    wizardManager.addMediaFromGallery();
}

function addMediaFromDevice() {
    wizardManager.addMediaFromDevice();
}

function generateAIImage() {
    wizardManager.generateAIImage();
}

function closeAIModal() {
    wizardManager.closeAIModal();
}

function generateImage() {
    wizardManager.generateImage();
}

function closeMediaPreview() {
    wizardManager.closeMediaPreview();
}

function refreshPreview() {
    wizardManager.refreshPreview();
}

function goBack() {
    wizardManager.goBack();
}

function goToStep5() {
    wizardManager.goToStep5();
}

function showHelp() {
    wizardManager.showHelp();
} 