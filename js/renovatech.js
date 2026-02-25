/**
 * ==========================================================================
 * RENOVALUZ - LÓGICA DA DIVISÃO RENOVATECH (TECNOLOGIA SAAS)
 * Arquivo: renovatech.js
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    RenovatechController.init();
});

const RenovatechController = {
    WHATSAPP_NUMBER: "244926955286",

    init() {
        this.initThemeToggle();
        this.initMobileMenu();
        this.initHeroSlider();
        this.initServiceModals();
        this.initWhatsAppOrdering();
        this.initScrollReveals();
    },

    // ── DARK / LIGHT MODE ──
    initThemeToggle() {
        const themeBtn = document.getElementById('theme-button');
        const themeIcon = document.getElementById('theme-icon');
        
        const savedTheme = localStorage.getItem('renovatech-theme');
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if(themeIcon) themeIcon.classList.replace('ri-sun-line', 'ri-moon-clear-fill');
        }

        if(themeBtn) {
            themeBtn.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if (currentTheme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'light');
                    if(themeIcon) themeIcon.classList.replace('ri-sun-line', 'ri-moon-clear-fill');
                    localStorage.setItem('renovatech-theme', 'light');
                } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    if(themeIcon) themeIcon.classList.replace('ri-moon-clear-fill', 'ri-sun-line');
                    localStorage.setItem('renovatech-theme', 'dark');
                }
            });
        }
    },

    // ── MENU HAMBÚRGUER MODERNO ──
    initMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        const navLinks = document.querySelectorAll('.nav__link');

        if(navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('show-menu');
                const icon = navToggle.querySelector('i');
                
                if(navMenu.classList.contains('show-menu')) {
                    icon.classList.replace('ri-menu-4-line', 'ri-close-large-line');
                    document.body.style.overflow = 'hidden'; 
                } else {
                    icon.classList.replace('ri-close-large-line', 'ri-menu-4-line');
                    document.body.style.overflow = 'auto';
                }
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show-menu');
                document.body.style.overflow = 'auto';
                const icon = navToggle.querySelector('i');
                if(icon) icon.classList.replace('ri-close-large-line', 'ri-menu-4-line');
            });
        });

        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if(header) {
                if (window.scrollY >= 50) {
                    header.style.background = 'rgba(var(--bg-rgb), 0.8)';
                    header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                    header.style.borderBottom = '1px solid transparent';
                } else {
                    header.style.background = 'rgba(var(--bg-rgb), 0.5)';
                    header.style.boxShadow = 'none';
                    header.style.borderBottom = '1px solid var(--card-border)';
                }
            }
        });
    },

    // ── HERO SLIDER CROSSFADE ──
    initHeroSlider() {
        const slides = document.querySelectorAll('.tech-slide');
        const dots = document.querySelectorAll('.t-dot');
        if(!slides.length || !dots.length) return;

        let currentSlide = 0;
        let slideInterval;

        const goToSlide = (index) => {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });
        });

        const nextSlide = () => {
            let next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        };

        const resetInterval = () => {
            if(slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000); 
        };

        resetInterval();
    },

    // ── MODAIS DE SERVIÇOS ──
    initServiceModals() {
        const modalOverlay = document.getElementById('global-tech-modal');
        const modalContentArea = document.getElementById('tech-modal-content');
        const closeBtn = document.getElementById('close-tech-modal');
        const triggers = document.querySelectorAll('[data-modal]');

        if(!modalOverlay || !modalContentArea) return;

        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const targetId = trigger.getAttribute('data-modal');
                const dataElement = document.getElementById('data-' + targetId);
                
                if(dataElement) {
                    modalContentArea.innerHTML = dataElement.innerHTML;
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; 
                } else {
                    console.error("ERRO: Div com ID data-" + targetId + " não encontrada no HTML.");
                }
            });
        });

        const closeModal = () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto'; 
            setTimeout(() => { modalContentArea.innerHTML = ""; }, 400); 
        };
        
        if(closeBtn) closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if(e.target === modalOverlay) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
        });
    },

    // ── LÓGICA WHATSAPP CTA ──
    initWhatsAppOrdering() {
        const requestBtns = document.querySelectorAll('.btn-request');
        
        requestBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const serviceName = btn.getAttribute('data-service');
                const message = `🚀 Olá equipa Renovatech! Gostaria de obter uma cotação e mais detalhes para o serviço de *${serviceName}*. Podem ajudar-me a escalar o meu negócio?`;
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodedMessage}`;
                
                window.open(whatsappUrl, '_blank');
            });
        });
    },

    // ── SCROLL REVEAL (ANIMAÇÕES SUAVES) ──
    initScrollReveals() {
        const reveals = document.querySelectorAll('.reveal');
        
        if('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(e => {
                    if(e.isIntersecting) { 
                        setTimeout(() => { e.target.classList.add('revealed'); }, 100);
                        obs.unobserve(e.target); 
                    }
                });
            }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
            
            reveals.forEach(r => observer.observe(r));
        } else {
            reveals.forEach(r => r.classList.add('revealed'));
        }
    }
};