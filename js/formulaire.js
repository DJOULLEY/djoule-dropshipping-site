// DJOULE DROPSHIPPING - Fichier JavaScript pour les Formulaires
// Gestion des formulaires de contact et de demande de devis

document.addEventListener('DOMContentLoaded', function() {
    
    // Configuration
    const config = {
        whatsappNumber: '+8615044025106',
        emailRecipient: 'ibrahim.saleh0300@gmail.com',
        formEndpoint: 'https://formspree.io/f/xjvqdqwy', // Remplacer par le vrai endpoint
        requiredFields: {
            contact: ['name', 'email'],
            quote: ['name', 'email', 'phone', 'products', 'country']
        }
    };
    
    // Initialiser les formulaires
    initContactForm();
    initQuoteForm();
    initQuickContactForm();
    
    /**
     * Formulaire de contact principal
     */
    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm(contactForm, config.requiredFields.contact)) {
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                // Show loading state
                setFormLoading(contactForm, true);
                submitBtn.textContent = 'Envoi en cours...';
                
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                // Add timestamp and page info
                data.timestamp = new Date().toISOString();
                data.page = window.location.href;
                data.userAgent = navigator.userAgent;
                
                // Send to Formspree (ou autre service)
                const response = await fetch(config.formEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    showSuccess(contactForm, 'Votre message a été envoyé avec succès! Nous vous contacterons dans les plus brefs délais.');
                    trackFormSubmission('contact', data);
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Send to WhatsApp as backup
                    sendToWhatsApp(buildWhatsAppMessage('contact', data));
                } else {
                    throw new Error('Erreur lors de l\'envoi du formulaire');
                }
                
            } catch (error) {
                console.error('Contact form error:', error);
                showError(contactForm, 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement via WhatsApp.');
            } finally {
                setFormLoading(contactForm, false);
                submitBtn.textContent = originalText;
            }
        });
    }
    
    /**
     * Formulaire de demande de devis
     */
    function initQuoteForm() {
        const quoteForm = document.getElementById('quote-form');
        if (!quoteForm) return;
        
        quoteForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm(quoteForm, config.requiredFields.quote)) {
                return;
            }
            
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                setFormLoading(quoteForm, true);
                submitBtn.textContent = 'Analyse en cours...';
                
                const formData = new FormData(quoteForm);
                const data = Object.fromEntries(formData);
                
                // Calculate estimated costs (simulation)
                const estimatedCost = calculateEstimatedCost(data);
                data.estimatedCost = estimatedCost;
                
                // Add additional info
                data.timestamp = new Date().toISOString();
                data.page = window.location.href;
                data.userAgent = navigator.userAgent;
                
                // Send to Formspree
                const response = await fetch(config.formEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    showQuoteResult(quoteForm, data, estimatedCost);
                    trackFormSubmission('quote', data);
                    
                    // Send to WhatsApp for immediate attention
                    sendToWhatsApp(buildWhatsAppMessage('quote', data));
                    
                    // Reset form after delay
                    setTimeout(() => {
                        quoteForm.reset();
                    }, 5000);
                } else {
                    throw new Error('Erreur lors de l\'envoi du formulaire');
                }
                
            } catch (error) {
                console.error('Quote form error:', error);
                showError(quoteForm, 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement via WhatsApp.');
            } finally {
                setFormLoading(quoteForm, false);
                submitBtn.textContent = originalText;
            }
        });
    }
    
    /**
     * Formulaire de contact rapide (sidebar)
     */
    function initQuickContactForm() {
        const quickForm = document.getElementById('quick-contact-form');
        if (!quickForm) return;
        
        quickForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm(quickForm, ['name', 'phone', 'message'])) {
                return;
            }
            
            const submitBtn = quickForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                setFormLoading(quickForm, true);
                submitBtn.textContent = 'Envoi...';
                
                const formData = new FormData(quickForm);
                const data = Object.fromEntries(formData);
                
                // Send directly to WhatsApp
                const message = buildWhatsAppMessage('quick', data);
                sendToWhatsApp(message);
                
                showSuccess(quickForm, 'Message envoyé via WhatsApp! Vous recevrez une réponse rapidement.');
                trackFormSubmission('quick_contact', data);
                
                quickForm.reset();
                
            } catch (error) {
                console.error('Quick contact form error:', error);
                showError(quickForm, 'Une erreur est survenue.');
            } finally {
                setFormLoading(quickForm, false);
                submitBtn.textContent = originalText;
            }
        });
    }
    
    /**
     * Validation de formulaire
     */
    function validateForm(form, requiredFields) {
        let isValid = true;
        const errors = [];
        
        // Clear previous errors
        clearFormErrors(form);
        
        // Check required fields
        requiredFields.forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!field || !field.value.trim()) {
                showFieldError(field, 'Ce champ est obligatoire');
                isValid = false;
                errors.push(fieldName);
            }
        });
        
        // Validate email format
        const emailField = form.querySelector('[name="email"]');
        if (emailField && emailField.value && !DjouleUtils.isValidEmail(emailField.value)) {
            showFieldError(emailField, 'Veuillez entrer une adresse email valide');
            isValid = false;
        }
        
        // Validate phone format
        const phoneField = form.querySelector('[name="phone"]');
        if (phoneField && phoneField.value && phoneField.value.replace(/\D/g, '').length < 8) {
            showFieldError(phoneField, 'Veuillez entrer un numéro de téléphone valide');
            isValid = false;
        }
        
        // Validate message length
        const messageField = form.querySelector('[name="message"]');
        if (messageField && messageField.value && messageField.value.length < 10) {
            showFieldError(messageField, 'Veuillez entrer au moins 10 caractères');
            isValid = false;
        }
        
        if (!isValid) {
            DjouleUtils.showToast('Veuillez corriger les erreurs dans le formulaire', 'error');
        }
        
        return isValid;
    }
    
    /**
     * Afficher une erreur de champ
     */
    function showFieldError(field, message) {
        if (!field) return;
        
        // Add error class
        field.classList.add('is-invalid');
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        
        // Insert error message after field
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
        
        // Add shake animation
        field.style.animation = 'shake 0.5s';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }
    
    /**
     * Effacer les erreurs de formulaire
     */
    function clearFormErrors(form) {
        const invalidFields = form.querySelectorAll('.is-invalid');
        const errorMessages = form.querySelectorAll('.invalid-feedback');
        
        invalidFields.forEach(field => field.classList.remove('is-invalid'));
        errorMessages.forEach(msg => msg.remove());
    }
    
    /**
     * Mettre le formulaire en état de chargement
     */
    function setFormLoading(form, isLoading) {
        const fields = form.querySelectorAll('input, textarea, button, select');
        
        fields.forEach(field => {
            if (isLoading) {
                field.disabled = true;
                field.style.opacity = '0.6';
            } else {
                field.disabled = false;
                field.style.opacity = '1';
            }
        });
        
        form.classList.toggle('loading', isLoading);
    }
    
    /**
     * Afficher un message de succès
     */
    function showSuccess(form, message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i> ${message}
        `;
        
        form.parentNode.insertBefore(successDiv, form);
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            successDiv.style.transition = 'opacity 0.5s';
            successDiv.style.opacity = '0';
            setTimeout(() => successDiv.remove(), 500);
        }, 10000);
    }
    
    /**
     * Afficher un message d'erreur
     */
    function showError(form, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i> ${message}
        `;
        
        form.parentNode.insertBefore(errorDiv, form);
        
        // Scroll to error message
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            errorDiv.style.transition = 'opacity 0.5s';
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 500);
        }, 10000);
    }
    
    /**
     * Afficher le résultat du devis
     */
    function showQuoteResult(form, data, estimatedCost) {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'quote-result';
        resultDiv.innerHTML = `
            <div class="card border-success">
                <div class="card-body text-center">
                    <i class="fas fa-calculator text-success mb-3" style="font-size: 3rem;"></i>
                    <h4 class="card-title text-success">Analyse Complète!</h4>
                    <p class="card-text">
                        Votre demande de devis a été analysée et envoyée à notre équipe.<br>
                        <strong>Estimation préliminaire:</strong> ${estimatedCost.estimated} USD<br>
                        <strong>Délai estimé:</strong> ${estimatedCost.timeline}
                    </p>
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i>
                        Vous recevrez un devis détaillé dans les 24h par email et WhatsApp.
                    </div>
                    <div class="d-grid gap-2">
                        <a href="https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}?text=Suivi%20devis%20${data.name}" 
                           class="btn btn-success" target="_blank">
                            <i class="fab fa-whatsapp"></i> Suivre via WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Replace form with result
        form.parentNode.insertBefore(resultDiv, form.nextSibling);
        form.style.display = 'none';
        
        // Scroll to result
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    /**
     * Calculer le coût estimé
     */
    function calculateEstimatedCost(data) {
        // This is a simplified estimation - in real case, this would be more complex
        const baseCost = 1000; // Base cost in USD
        const productMultiplier = data.productCategory ? 1.5 : 1;
        const quantityFactor = Math.min(data.quantity / 100, 2);
        const urgencyFactor = data.urgency === 'express' ? 1.5 : 1;
        
        const estimated = Math.round(baseCost * productMultiplier * (1 + quantityFactor) * urgencyFactor);
        const timeline = data.urgency === 'express' ? '7-10 jours' : '15-20 jours';
        
        return {
            estimated: estimated.toLocaleString(),
            currency: 'USD',
            timeline: timeline
        };
    }
    
    /**
     * Construire le message WhatsApp
     */
    function buildWhatsAppMessage(type, data) {
        let message = '';
        
        switch (type) {
            case 'contact':
                message = `*Nouveau Message de Contact*\n\n`;
                message += `*Nom:* ${data.name}\n`;
                message += `*Email:* ${data.email}\n`;
                message += `*Téléphone:* ${data.phone || 'Non spécifié'}\n`;
                message += `*Message:* ${data.message}\n`;
                break;
                
            case 'quote':
                message = `*Nouvelle Demande de Devis*\n\n`;
                message += `*Nom:* ${data.name}\n`;
                message += `*Email:* ${data.email}\n`;
                message += `*Téléphone:* ${data.phone}\n`;
                message += `*Pays:* ${data.country}\n`;
                message += `*Produits:* ${data.products}\n`;
                message += `*Quantité:* ${data.quantity}\n`;
                message += `*Budget:* ${data.budget || 'Non spécifié'}\n`;
                if (data.estimatedCost) {
                    message += `*Coût estimé:* ${data.estimatedCost.estimated} ${data.estimatedCost.currency}\n`;
                }
                break;
                
            case 'quick':
                message = `*Message Rapide*\n\n`;
                message += `*Nom:* ${data.name}\n`;
                message += `*Téléphone:* ${data.phone}\n`;
                message += `*Message:* ${data.message}\n`;
                break;
        }
        
        message += `\n*Page:* ${data.page || 'N/A'}\n`;
        message += `*Date:* ${new Date().toLocaleString('fr-FR')}`;
        
        return encodeURIComponent(message);
    }
    
    /**
     * Envoyer à WhatsApp
     */
    function sendToWhatsApp(message) {
        const whatsappUrl = `https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}?text=${message}`;
        window.open(whatsappUrl, '_blank', 'width=600,height=600');
    }
    
    /**
     * Tracker les soumissions de formulaires
     */
    function trackFormSubmission(formType, data) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submission', {
                event_category: 'Forms',
                event_label: formType,
                custom_parameter_1: data.country || 'unknown'
            });
        }
        
        // Custom tracking for analytics
        console.log(`Form submission tracked: ${formType}`, data);
    }
    
    // Auto-fill country based on browser locale
    function autoFillCountry() {
        const countryField = document.querySelector('[name="country"]');
        if (!countryField || countryField.value) return;
        
        const locale = navigator.language || navigator.userLanguage;
        const countryMap = {
            'fr': 'France',
            'fr-FR': 'France',
            'en-US': 'United States',
            'en-GB': 'United Kingdom',
            'es': 'Spain',
            'it': 'Italy',
            'de': 'Germany',
            'pt': 'Portugal',
            'nl': 'Netherlands'
        };
        
        if (countryMap[locale]) {
            countryField.value = countryMap[locale];
        }
    }
    
    // Initialize auto-fill
    autoFillCountry();
    
    // Add shake animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .form-control.is-invalid {
            border-color: var(--danger-red);
            box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.25);
        }
        
        .invalid-feedback {
            display: block;
            width: 100%;
            margin-top: 0.25rem;
            font-size: 0.875em;
            color: var(--danger-red);
        }
        
        .loading .form-control,
        .loading .btn {
            cursor: not-allowed;
        }
        
        .quote-result {
            margin-top: 20px;
            animation: fadeInUp 0.6s ease;
        }
        
        .alert {
            border: none;
            border-radius: 10px;
            margin-bottom: 20px;
            animation: slideInRight 0.5s ease;
        }
        
        .alert-success {
            background: rgba(16, 185, 129, 0.1);
            color: var(--success-green);
            border-left: 4px solid var(--success-green);
        }
        
        .alert-danger {
            background: rgba(239, 68, 68, 0.1);
            color: var(--danger-red);
            border-left: 4px solid var(--danger-red);
        }
        
        .alert-info {
            background: rgba(6, 182, 212, 0.1);
            color: var(--info-blue);
            border-left: 4px solid var(--info-blue);
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
});