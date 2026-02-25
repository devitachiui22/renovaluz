/**
 * ==========================================================================
 * RENOVALUZ - CORE SCRIPT FINAL (Sem Sidebar, Crossfade Hero, Lightbox Full)
 * Arquivo: main.js
 * Objetivo: Lidar com UI/UX, Animações Robustas, Lightbox e Dinamismo.
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    // Inicialização Principal
    AppController.init();
    BackendService.init();
});

/* ── 1. MÓDULO FRONTEND (UI/UX) ── */
const AppController = {
    init() {
        this.initThemeToggle();
        this.initMobileMenu();
        this.initHeroSliderFullBackground();
        this.initCarousels();
        this.initGalleryLoadMore();
        this.initGalleryLightbox();
        this.initAccordion();
        this.initModals();
        this.initContactToggles();
        
        // Timeout para estabilização do DOM antes de animar observadores
        setTimeout(() => {
            this.initCounters();
            this.initScrollReveals();
        }, 150);

        this.setCurrentYear();
        this.bindDossierActionButtons();
    },

    // ── DARK / LIGHT MODE ──
    initThemeToggle() {
        const themeBtn = document.getElementById('theme-button');
        const themeIcon = document.getElementById('theme-icon');
        
        const savedTheme = localStorage.getItem('renovaluz-theme');
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if(themeIcon) {
                themeIcon.classList.replace('ri-sun-line', 'ri-moon-line');
            }
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

    // ── MENU HAMBÚRGUER & SCROLL HEADER ──
    initMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        const navClose = document.getElementById('nav-close');
        const navLinks = document.querySelectorAll('.nav__link');

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
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show-menu');
            });
        });

        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if(header) {
                if (window.scrollY >= 50) {
                    header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.3)';
                } else {
                    header.style.boxShadow = 'none';
                }
            }
        });
    },

    // ── HERO SLIDER (CROSSFADE BACKGROUND DE PONTA A PONTA) ──
    initHeroSliderFullBackground() {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slider-dot');
        const layer1 = document.getElementById('hero-bg-1');
        const layer2 = document.getElementById('hero-bg-2');
        
        if(!slides.length || !layer1 || !layer2 || !dots.length) return;

        let currentSlide = 0;
        let slideInterval;
        let isLayer1Active = true;

        // Iniciar primeira imagem imediatamente
        layer1.style.backgroundImage = `url('${slides[0].getAttribute('data-image')}')`;
        layer1.classList.add('active-bg');

        const goToSlide = (index) => {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            
            const newImage = `url('${slides[index].getAttribute('data-image')}')`;

            // Sistema Profissional de Crossfade usando duas Divs Absolutas
            if (isLayer1Active) {
                layer2.style.backgroundImage = newImage;
                layer2.classList.add('active-bg');
                layer1.classList.remove('active-bg');
            } else {
                layer1.style.backgroundImage = newImage;
                layer1.classList.add('active-bg');
                layer2.classList.remove('active-bg');
            }

            isLayer1Active = !isLayer1Active;
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
            slideInterval = setInterval(nextSlide, 7000); // 7 Segundos para leitura da Proposta
        };

        resetInterval();
    },

    // ── CAROUSELS (JQUERY SLICK) ──
    initCarousels() {
        if(window.jQuery && typeof $.fn.slick !== 'undefined') {
            $('.parceiros-carousel').slick({
                slidesToShow: 5,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 2000,
                arrows: false,
                dots: false,
                responsive: [
                    { breakpoint: 1024, settings: { slidesToShow: 4 } },
                    { breakpoint: 768, settings: { slidesToShow: 3 } },
                    { breakpoint: 480, settings: { slidesToShow: 3 } } // Mantido 3 em mobile para matriz
                ]
            });

            $('.luisa-carousel').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 3000,
                arrows: false,
                dots: true,
                fade: true,
                cssEase: 'linear'
            });
        } else {
            console.warn("[Aviso] Slick Carousel não carregado. Verifique a importação do jQuery/Slick no HTML.");
        }
    },

    // ── GALERIA (LOAD MORE) ──
    initGalleryLoadMore() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if(!loadMoreBtn) return;

        loadMoreBtn.addEventListener('click', () => {
            const hiddenItems = document.querySelectorAll('.gallery-item.hidden');
            hiddenItems.forEach(item => {
                item.classList.remove('hidden');
                item.classList.add('reveal'); 
                void item.offsetWidth; // Force Reflow para animação
                item.classList.add('revealed');
            });
            loadMoreBtn.style.display = 'none'; 
        });
    },

    // ── GALERIA (LIGHTBOX / ABRIR IMAGEM FULLSCREEN) ──
    initGalleryLightbox() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightboxOverlay = document.getElementById('lightbox-modal');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.getElementById('lightbox-close');

        if(!lightboxOverlay || !lightboxImg) return;

        galleryItems.forEach(item => {
            // O click na div inteira (ou no overlay) ativa o lightbox
            item.addEventListener('click', () => {
                const imgElement = item.querySelector('img');
                if(imgElement) {
                    lightboxImg.src = imgElement.src;
                    lightboxOverlay.classList.add('active');
                }
            });
        });

        // Fechar pelo botão
        if(closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightboxOverlay.classList.remove('active');
                setTimeout(() => { lightboxImg.src = ""; }, 300); // Limpar src depois da animação
            });
        }

        // Fechar clicando fora da imagem
        lightboxOverlay.addEventListener('click', (e) => {
            if(e.target === lightboxOverlay) {
                lightboxOverlay.classList.remove('active');
                setTimeout(() => { lightboxImg.src = ""; }, 300);
            }
        });
    },

    // ── ACCORDION DA MASCOTE LUÍSA ──
    initAccordion() {
        const accordionItems = document.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            if(header) {
                header.addEventListener('click', () => {
                    accordionItems.forEach(i => {
                        if(i !== item) i.classList.remove('active');
                    });
                    item.classList.toggle('active');
                });
            }
        });
    },

    // ── CONTADORES ANIMADOS ROBUSTOS ──
    initCounters() {
        const counters = document.querySelectorAll('.metric-val');
        if(!counters.length) return;

        const speed = 200; 

        const animateCounter = (counter) => {
            const targetAttr = counter.getAttribute('data-target');
            if(!targetAttr) return;
            
            const target = +targetAttr;
            const count = +counter.innerText.replace(/[^0-9]/g, ''); 
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(() => animateCounter(counter), 15);
            } else {
                // Formatação final inteligente
                if(target === 50000) {
                    counter.innerText = "50K+";
                } else if(target === 100000) {
                    counter.innerText = "100K";
                } else if(target === 30000000) {
                    counter.innerText = "30M";
                } else {
                    counter.innerText = target + (target >= 1000 && target < 50000 && target !== 3000 ? '+' : '');
                }
            }
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    const visibleCounters = entry.target.querySelectorAll('.metric-val');
                    visibleCounters.forEach(c => {
                        c.innerText = '0';
                        animateCounter(c);
                    });
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.metrics, .cta-section').forEach(section => {
            observer.observe(section);
        });
    },

    // ── MODALS GLOBAIS DE SERVIÇOS ──
    initModals() {
        const modalOverlay = document.getElementById('global-modal');
        const modalContentArea = document.getElementById('modal-content-area');
        const closeBtn = document.querySelector('.modal-close');
        const triggers = document.querySelectorAll('[data-modal]');

        if(!modalOverlay || !modalContentArea) return;

        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const targetId = trigger.getAttribute('data-modal');
                const dataElement = document.getElementById('data-' + targetId);
                
                if(dataElement) {
                    modalContentArea.innerHTML = dataElement.innerHTML;
                    modalOverlay.classList.add('active');
                }
            });
        });

        const closeModal = () => {
            modalOverlay.classList.remove('active');
            setTimeout(() => { modalContentArea.innerHTML = ""; }, 300);
        };
        
        if(closeBtn) closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if(e.target === modalOverlay) closeModal();
        });
    },

    // ── TOGGLE BOTÕES DE CONTATO (Email / Whatsapp) ──
    initContactToggles() {
        const toggleBtns = document.querySelectorAll('.contact-toggle-buttons .btn');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleBtns.forEach(b => b.classList.remove('active', 'btn-solid'));
                btn.classList.add('active', 'btn-solid');
            });
        });
    },

    // ── SCROLL REVEAL BLINDADO (Sem Piscares) ──
    initScrollReveals() {
        const reveals = document.querySelectorAll('.reveal');
        
        if('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(e => {
                    if(e.isIntersecting) { 
                        e.target.classList.add('revealed'); 
                        obs.unobserve(e.target); // Para o observador após revelar para evitar o piscar contínuo
                    }
                });
            }, { threshold: 0.05 });
            
            reveals.forEach(r => observer.observe(r));
        } else {
            reveals.forEach(r => r.classList.add('revealed'));
        }
    },

    // ── AÇÕES EXCLUSIVAS DO DOSSIÊ EXECUTIVO ──
    bindDossierActionButtons() {
        const btnAssinar = document.getElementById('btn-assinar-protocolo');
        
        if(btnAssinar) {
            btnAssinar.addEventListener('click', (e) => {
                e.preventDefault();
                alert("[Sistema Seguro] Inicializando fluxo de Assinatura Eletrónica do Protocolo Multiministerial...");
            });
        }
    },

    // ── FOOTER ANO DINÂMICO ──
    setCurrentYear() {
        const yearEl = document.getElementById('current-year');
        if(yearEl) {
            yearEl.innerText = new Date().getFullYear();
        }
    }
};

/* ── MENSAGEM DE CONTATO GLOBAL NO WINDOW ── */
window.sendContactMessage = function() {
    const nomeEl = document.getElementById('contact-name');
    const emailEl = document.getElementById('contact-email');
    const phoneEl = document.getElementById('contact-phone');
    const messageEl = document.getElementById('contact-message');

    if(!nomeEl || !messageEl) return;

    const nome = nomeEl.value.trim();
    const email = emailEl ? emailEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const mensagem = messageEl.value.trim();
    
    const activeMethodBtn = document.querySelector('.contact-toggle-buttons .btn.active');
    const method = activeMethodBtn ? activeMethodBtn.getAttribute('data-method') : 'email';
    
    if(!nome || !mensagem) {
        alert("Por favor, preencha pelo menos o seu Nome e a Mensagem.");
        return;
    }

    let corpo = `NOVA MENSAGEM - RENOVALUZ PLATAFORMA%0A%0A`;
    corpo += `Nome: ${nome}%0A`;
    if(email) corpo += `Email: ${email}%0A`;
    if(phone) corpo += `Telefone: ${phone}%0A`;
    corpo += `%0AMensagem:%0A${mensagem}`;

    if(method === 'whatsapp') {
        const whatsappNumber = '244948504916';
        window.open(`https://wa.me/${whatsappNumber}?text=${corpo}`, '_blank');
    } else {
        const assunto = `Mensagem Institucional de ${nome} - Plataforma Renovaluz`;
        window.location.href = `mailto:geral@renovaluz.ao?subject=${encodeURIComponent(assunto)}&body=${corpo}`;
    }
};

/* ── 2. MÓDULO BACKEND E FORMULÁRIOS ── */
const BackendService = {
    init() {
        this.setupNewsletter();
        this.setupAppWaitlist();
    },

    setupNewsletter() {
        const newsletterForm = document.getElementById('newsletter-form');
        
        if(newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('newsletter-email').value;
                
                setTimeout(() => {
                    alert(`Inscrição Institucional confirmada para: ${emailInput}`);
                    newsletterForm.reset();
                }, 500);
            });
        }
    },

    setupAppWaitlist() {
        const appForm = document.getElementById('subscribe-form');
        
        if(appForm) {
            appForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = appForm.querySelector('input[type="email"]').value;
                
                setTimeout(() => {
                    alert(`O email ${emailInput} foi adicionado à Lista VIP do App RenovaLuz!`);
                    appForm.reset();
                }, 500);
            });
        }
    }
};