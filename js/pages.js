/**
 * ==========================================================================
 * RENOVALUZ - SCRIPTS DAS PÁGINAS INTERNAS (SOBRE, CONTACTOS E APP)
 * Arquivo: pages.js
 * Objetivo: Lógica isolada para garantir que as páginas secundárias funcionem.
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    PagesController.init();
});

const PagesController = {
    init() {
        this.initThemeToggle();
        this.initMobileMenu();
        this.initScrollReveals();
        this.initAppCarousel();
        this.setCurrentYear();
        this.initAdvancedContactForm();
    },

    // ── DARK / LIGHT MODE DA PÁGINA ──
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

    // ── MENU HAMBÚRGUER (Idêntico ao Principal) ──
    initMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        const navClose = document.getElementById('nav-close');

        if(navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.add('show-menu');
            });
        }

        if(navClose) {
            navClose.addEventListener('click', () => {
                navMenu.classList.remove('show-menu');
            });
        }

        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if(header) {
                if (window.scrollY >= 50) header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.3)';
                else header.style.boxShadow = 'none';
            }
        });
    },

    // ── SLICK CAROUSEL DO APP (Apenas para a página Download) ──
    initAppCarousel() {
        if(window.jQuery && typeof $.fn.slick !== 'undefined') {
            const appSlider = $('.app-screenshot-slider');
            
            if(appSlider.length) {
                appSlider.slick({
                    centerMode: true,
                    centerPadding: '0px',
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    autoplay: true,
                    autoplaySpeed: 3000,
                    arrows: false,
                    dots: true,
                    responsive: [
                        { breakpoint: 1024, settings: { slidesToShow: 3 } },
                        { breakpoint: 768, settings: { slidesToShow: 1, centerPadding: '60px' } },
                        { breakpoint: 480, settings: { slidesToShow: 1, centerPadding: '40px' } }
                    ]
                });
            }
        } else {
            console.warn("[Aviso] Slick Carousel não carregado. Verifique a importação do jQuery/Slick no HTML da página App.");
        }
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
    },

    // ── PROCESSAMENTO DO FORMULÁRIO AVANÇADO (PÁGINA CONTACTOS) ──
    initAdvancedContactForm() {
        const advForm = document.getElementById('advancedContactForm');
        
        if(advForm) {
            advForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const nome = document.getElementById('adv-name').value;
                const email = document.getElementById('adv-email').value;
                const assunto = document.getElementById('adv-subject').value;
                
                // Mudar texto do botão para dar feedback visual
                const btnSubmit = advForm.querySelector('button[type="submit"]');
                const originalText = btnSubmit.innerHTML;
                btnSubmit.innerHTML = `<i class="ri-loader-4-line animate-spin"></i> A enviar...`;
                btnSubmit.disabled = true;

                // Simulação de envio via API / EmailJS
                setTimeout(() => {
                    alert(`✅ Mensagem enviada com sucesso, ${nome}!\nA nossa equipa do departamento de "${assunto}" responderá para o email: ${email} no prazo máximo de 24 horas.`);
                    
                    advForm.reset();
                    btnSubmit.innerHTML = originalText;
                    btnSubmit.disabled = false;
                }, 1500);
            });
        }
    }
};