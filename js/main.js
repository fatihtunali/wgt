/**
 * Work in Germany Turk - Main JavaScript
 * Handles all interactive functionality across the website
 */

(function() {
    'use strict';

    // DOM Content Loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    /**
     * Initialize all app functionality
     */
    function initializeApp() {
        initMobileMenu();
        initSmoothScrolling();
        initScrollAnimations();
        initFAQAccordion();
        initContactForms();
        initHeaderScroll();
        initLanguageSwitcher();
        initStatCounters();
        initModalSystem();
        initTooltips();
        initBackToTop();
        console.log('🚀 Work in Germany Turk - App initialized successfully!');
    }

    /**
     * Mobile Menu Toggle
     */
    function initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav');
        
        if (mobileToggle && nav) {
            mobileToggle.addEventListener('click', function() {
                nav.classList.toggle('active');
                mobileToggle.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            // Close menu when clicking nav links
            const navLinks = nav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    nav.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
                    nav.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        }
    }

    /**
     * Smooth Scrolling for anchor links
     */
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Scroll Animations (Fade In, Slide In)
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * FAQ Accordion functionality
     */
    function initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const summary = item.querySelector('summary');
            if (summary) {
                summary.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Close other FAQ items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.hasAttribute('open')) {
                            otherItem.removeAttribute('open');
                        }
                    });
                    
                    // Toggle current item
                    if (item.hasAttribute('open')) {
                        item.removeAttribute('open');
                    } else {
                        item.setAttribute('open', '');
                    }
                });
            }
        });
    }

    /**
     * Contact Forms handling
     */
    function initContactForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                if (!validateForm(form)) {
                    e.preventDefault();
                    return false;
                }
                
                // Handle form submission
                handleFormSubmission(form, e);
            });
        });
    }

    /**
     * Form Validation
     */
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const errorElement = field.parentNode.querySelector('.form-error');
            
            // Remove existing error
            if (errorElement) {
                errorElement.remove();
            }
            
            // Check if field is empty
            if (!field.value.trim()) {
                showFieldError(field, 'Bu alan zorunludur');
                isValid = false;
            }
            // Email validation
            else if (field.type === 'email' && !isValidEmail(field.value)) {
                showFieldError(field, 'Geçerli bir e-posta adresi girin');
                isValid = false;
            }
            // Phone validation
            else if (field.type === 'tel' && !isValidPhone(field.value)) {
                showFieldError(field, 'Geçerli bir telefon numarası girin');
                isValid = false;
            }
        });
        
        return isValid;
    }

    /**
     * Show field error
     */
    function showFieldError(field, message) {
        field.style.borderColor = '#dc2626';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    /**
     * Email validation
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Phone validation
     */
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    /**
     * Handle Form Submission
     */
    function handleFormSubmission(form, e) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '⏳ Gönderiliyor...';
        submitButton.disabled = true;
        form.classList.add('loading');
        
        // If it's a contact form, use AJAX
        if (form.id === 'contact-form' || form.action.includes('contact.php')) {
            e.preventDefault();
            submitContactForm(form, submitButton, originalText);
        }
    }

    /**
     * Submit Contact Form via AJAX
     */
    function submitContactForm(form, submitButton, originalText) {
        const formData = new FormData(form);
        
        fetch('contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showAlert('success', data.message || 'Mesajınız başarıyla gönderildi! 24 saat içinde size dönüş yapacağız.');
                form.reset();
            } else {
                showAlert('error', data.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            showAlert('error', 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.');
        })
        .finally(() => {
            // Reset button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            form.classList.remove('loading');
        });
    }

    /**
     * Show Alert Messages
     */
    function showAlert(type, message) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-${type}`;
        alertElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span>${message}</span>
                <button type="button" onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
        `;
        
        // Insert alert at the top of the page
        const main = document.querySelector('main') || document.body;
        main.insertBefore(alertElement, main.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertElement.parentNode) {
                alertElement.remove();
            }
        }, 5000);
        
        // Scroll to alert
        alertElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Header Scroll Effect
     */
    function initHeaderScroll() {
        const header = document.querySelector('.site-header');
        if (!header) return;
        
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    /**
     * Language Switcher
     */
    function initLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active from all buttons
                langButtons.forEach(b => b.classList.remove('active'));
                
                // Add active to clicked button
                this.classList.add('active');
                
                const selectedLang = this.textContent.trim();
                console.log('Language changed to:', selectedLang);
                
                // Here you would implement actual language switching
                // For now, just show a message
                if (selectedLang !== 'TR') {
                    showAlert('info', `${selectedLang} dil desteği yakında eklenecek!`);
                }
            });
        });
    }

    /**
     * Animated Counters for Statistics
     */
    function initStatCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statNumbers.length === 0) return;
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    /**
     * Animate Counter
     */
    function animateCounter(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/[\d\s]/g, '');
        
        if (isNaN(number)) return;
        
        let current = 0;
        const increment = number / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 30);
    }

    /**
     * Modal System
     */
    function initModalSystem() {
        const modalTriggers = document.querySelectorAll('[data-modal]');
        const modals = document.querySelectorAll('.modal-overlay');
        
        // Open modals
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const modalId = this.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    openModal(modal);
                }
            });
        });
        
        // Close modals
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => closeModal(modal));
            }
            
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal-overlay.active');
                if (activeModal) {
                    closeModal(activeModal);
                }
            }
        });
    }

    /**
     * Open Modal
     */
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close Modal
     */
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Tooltip System
     */
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        });
    }

    /**
     * Show Tooltip
     */
    function showTooltip(e) {
        const element = e.target;
        const text = element.getAttribute('data-tooltip');
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-popup';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: #1f2937;
            color: white;
            padding: 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        element._tooltip = tooltip;
    }

    /**
     * Hide Tooltip
     */
    function hideTooltip(e) {
        const element = e.target;
        if (element._tooltip) {
            element._tooltip.remove();
            delete element._tooltip;
        }
    }

    /**
     * Back to Top Button
     */
    function initBackToTop() {
        // Create back to top button
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '↑';
        backToTop.className = 'back-to-top';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 140px;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
        `;
        
        document.body.appendChild(backToTop);
        
        // Show/hide based on scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });
        
        // Scroll to top
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Quick evaluation form handler (Hero section)
     */
    window.handleQuickEvaluation = function() {
        const education = document.querySelector('select').value;
        const profession = document.querySelectorAll('select')[1].value;
        const german = document.querySelectorAll('select')[2].value;
        
        if (!education || !profession || !german) {
            showAlert('warning', 'Lütfen tüm alanları doldurun');
            return;
        }
        
        // Simple evaluation logic
        let score = 0;
        let message = '';
        
        // Education scoring
        if (education === 'Yüksek Lisans' || education === 'Doktora') score += 30;
        else if (education === 'Lisans') score += 20;
        else score += 10;
        
        // Profession scoring  
        if (profession === 'IT/Yazılım') score += 30;
        else if (profession === 'Mühendislik' || profession === 'Sağlık') score += 25;
        else score += 15;
        
        // German level scoring
        if (german === 'C1-C2') score += 40;
        else if (german === 'B1-B2') score += 30;
        else if (german === 'A1-A2') score += 15;
        else score += 5;
        
        // Generate message based on score
        if (score >= 80) {
            message = '🎉 Mükemmel! Profil puanınız: ' + score + '/100. Almanya\'da iş bulma şansınız çok yüksek. Hemen başlayalım!';
        } else if (score >= 60) {
            message = '✅ Çok iyi! Profil puanınız: ' + score + '/100. Doğru stratejiye ihtiyacınız var. Size yardımcı olalım.';
        } else if (score >= 40) {
            message = '💪 Umut var! Profil puanınız: ' + score + '/100. Bazı geliştirmelerle başarılı olabilirsiniz.';
        } else {
            message = '🔄 Profil puanınız: ' + score + '/100. Dil ve nitelikleri geliştirmenizi öneririz. Birlikte plan yapalım.';
        }
        
        showAlert('success', message);
        
        // Track conversion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'quick_evaluation', {
                'event_category': 'engagement',
                'event_label': 'hero_form',
                'value': score
            });
        }
    };

    /**
     * Utility Functions
     */
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.site-header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };

    /**
     * WhatsApp helper function
     */
    window.openWhatsApp = function(message) {
        const defaultMessage = 'Merhaba! Almanya çalışma izni hakkında bilgi almak istiyorum.';
        const whatsappMessage = encodeURIComponent(message || defaultMessage);
        window.open(`https://wa.me/905325858786?text=${whatsappMessage}`, '_blank');
    };

    /**
     * Google Analytics Events
     */
    window.trackEvent = function(action, category, label, value) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label,
                'value': value
            });
        }
    };

    // Service worker registration (for PWA capabilities)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

})();