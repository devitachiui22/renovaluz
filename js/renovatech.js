/**
 * ==========================================================================
 * RENOVALUZ - LÓGICA DA DIVISÃO RENOVATECH (SERVIÇOS, MODAIS, WHATSAPP)
 * Arquivo: renovatech.js
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    RenovatechController.init();
});

const RenovatechController = {
    // Número oficial da Renovatech
    WHATSAPP_NUMBER: "244926955286",

    init() {
        this.initThemeToggle();
        this.initMobileMenu();
        this.initHeroSlider();
        this.initServiceModals();
        this.initWhatsAppOrdering();
        this.initScrollReveals();
        this.setCurrentYear();
    },

    // ── DARK / LIGHT MODE ──
    initThemeToggle() {
        const themeBtn = document.getElementById('theme-button');
        const themeIcon = document.getElementById('theme-icon');
        
        const savedTheme = localStorage.getItem('renovaluz-theme');
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if(themeIcon) themeIcon.classList.replace('ri-sun-line', 'ri-moon-line');
        }

        if(themeBtn) {
            themeBtn.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if (currentTheme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'light');
                    if(themeIcon) themeIcon.classList.replace('ri-sun-line', 'ri-moon-line');
                    localStorage.setItem('renovaluz-theme', 'light');
                } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    if(themeIcon) themeIcon.classList.replace('ri-moon-line', 'ri-sun-line');
                    localStorage.setItem('renovaluz-theme', 'dark');
                }
            });
        }
    },

    // ── MENU HAMBÚRGUER & SCROLL ──
    initMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        const navClose = document.getElementById('nav-close');
        const navLinks = document.querySelectorAll('.nav__link');

        if(navToggle) navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
        if(navClose) navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));

        navLinks.forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('show-menu'));
        });

        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if(header) {
                if (window.scrollY >= 50) header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.3)';
                else header.style.boxShadow = 'none';
            }
        });
    },

    // ── HERO SLIDER (CROSSFADE PARA BACKGROUND TECH) ──
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
            slideInterval = setInterval(nextSlide, 6000); 
        };

        resetInterval();
    },

    // ── MODAIS DE SERVIÇOS (VER DETALHES) ──
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
                    document.body.style.overflow = 'hidden'; // Evita scroll do body
                }
            });
        });

        const closeModal = () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restaura o scroll
            setTimeout(() => { modalContentArea.innerHTML = ""; }, 300);
        };
        
        if(closeBtn) closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if(e.target === modalOverlay) closeModal();
        });
    },

    // ── LÓGICA DE PEDIDO VIA WHATSAPP (BOTÃO SOLICITAR) ──
    initWhatsAppOrdering() {
        const requestBtns = document.querySelectorAll('.btn-request');
        
        requestBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const serviceName = btn.getAttribute('data-service');
                const message = `Olá equipa Renovatech! Gostaria de solicitar informações e avançar com o serviço de *${serviceName}*. Podem ajudar-me?`;
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodedMessage}`;
                
                window.open(whatsappUrl, '_blank');
            });
        });
    },

    // ── SCROLL REVEAL BLINDADO ──
    initScrollReveals() {
        const reveals = document.querySelectorAll('.reveal');
        
        if('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(e => {
                    if(e.isIntersecting) { 
                        e.target.classList.add('revealed'); 
                        obs.unobserve(e.target); 
                    }
                });
            }, { threshold: 0.05 });
            
            reveals.forEach(r => observer.observe(r));
        } else {
            reveals.forEach(r => r.classList.add('revealed'));
        }
    },

    // ── FOOTER ANO DINÂMICO ──
    setCurrentYear() {
        const yearEl = document.getElementById('current-year');
        if(yearEl) yearEl.innerText = new Date().getFullYear();
    }
};