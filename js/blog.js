/**
 * ==========================================================================
 * RENOVALUZ - LÓGICA DO BLOG (PAGINAÇÃO, FILTROS, SLIDER, MODAIS)
 * Arquivo: blog.js
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    BlogController.init();
});

const BlogController = {
    articlesPerPage: 6,
    currentPage: 1,
    currentFilter: 'all',
    searchQuery: '',
    allArticles: [],
    filteredArticles: [],

    init() {
        this.initThemeToggle();
        this.initMobileMenu();
        this.initHeroSlider();
        this.initBlogSystem();
        this.initModals();
        this.setCurrentYear();
        this.initNewsletter();
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

    // ── MENU HAMBÚRGUER ──
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

    // ── HERO SLIDER (CROSSFADE EM VANILLA JS) ──
    initHeroSlider() {
        const slides = document.querySelectorAll('.blog-slide');
        const dots = document.querySelectorAll('.b-dot');
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

    // ── SISTEMA DE BLOG (FILTROS, PESQUISA E PAGINAÇÃO) ──
    initBlogSystem() {
        // Guardar todos os artigos em memória
        const cards = document.querySelectorAll('.article-card');
        this.allArticles = Array.from(cards);
        
        // Listeners de Filtros Topo
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.currentFilter = e.target.getAttribute('data-filter');
                this.currentPage = 1; // Reseta a página
                this.processArticles();
            });
        });

        // Listeners de Filtros na Sidebar (Categorias)
        const sidebarFilters = document.querySelectorAll('.categories-list a');
        sidebarFilters.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = link.getAttribute('data-filter');
                
                // Simula clique no botão principal para sincronia visual
                const targetBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
                if(targetBtn) targetBtn.click();
            });
        });

        // Listener de Pesquisa
        const searchInput = document.getElementById('blog-search');
        if(searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.currentPage = 1;
                this.processArticles();
            });
        }

        // Listener Botoes de Paginação Anterior/Próximo
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        if(prevBtn) {
            prevBtn.addEventListener('click', () => {
                if(this.currentPage > 1) {
                    this.currentPage--;
                    this.processArticles();
                    this.scrollToTopGrid();
                }
            });
        }

        if(nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
                if(this.currentPage < totalPages) {
                    this.currentPage++;
                    this.processArticles();
                    this.scrollToTopGrid();
                }
            });
        }

        // Arranque Inicial
        this.processArticles();
    },

    processArticles() {
        // 1. Filtrar
        this.filteredArticles = this.allArticles.filter(article => {
            const matchFilter = this.currentFilter === 'all' || article.getAttribute('data-category') === this.currentFilter;
            const title = article.querySelector('h3').innerText.toLowerCase();
            const matchSearch = title.includes(this.searchQuery);
            return matchFilter && matchSearch;
        });

        // 2. Paginar
        const start = (this.currentPage - 1) * this.articlesPerPage;
        const end = start + this.articlesPerPage;
        const articlesToShow = this.filteredArticles.slice(start, end);

        // 3. Renderizar DOM
        const container = document.getElementById('articles-container');
        container.innerHTML = '';

        if(articlesToShow.length === 0) {
            container.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 40px;">Nenhum artigo encontrado para a pesquisa.</p>`;
        } else {
            articlesToShow.forEach(art => {
                container.appendChild(art);
                // Força reflow para animação rodar suavemente a cada mudança de página
                art.classList.remove('revealed');
                void art.offsetWidth; 
                art.classList.add('revealed');
            });
        }

        this.renderPaginationControls();
    },

    renderPaginationControls() {
        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
        const numbersContainer = document.getElementById('pagination-numbers');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        if(!numbersContainer) return;
        numbersContainer.innerHTML = '';

        // Oculta tudo se só houver 1 página
        const paginationBlock = document.getElementById('pagination-controls');
        if(totalPages <= 1) {
            paginationBlock.style.display = 'none';
            return;
        } else {
            paginationBlock.style.display = 'flex';
        }

        for(let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-num ${i === this.currentPage ? 'active' : ''}`;
            btn.innerText = i;
            btn.addEventListener('click', () => {
                this.currentPage = i;
                this.processArticles();
                this.scrollToTopGrid();
            });
            numbersContainer.appendChild(btn);
        }

        if(prevBtn) prevBtn.disabled = this.currentPage === 1;
        if(nextBtn) nextBtn.disabled = this.currentPage === totalPages;
    },

    scrollToTopGrid() {
        const container = document.getElementById('artigos');
        if(container) {
            window.scrollTo({
                top: container.offsetTop - 100, // Dá uma margem de segurança do cabeçalho
                behavior: 'smooth'
            });
        }
    },

    // ── SISTEMA DE MODAIS (ABRIR ARTIGOS COMPLETOS) ──
    initModals() {
        const modalOverlay = document.getElementById('global-blog-modal');
        const modalContentArea = document.getElementById('blog-modal-content-area');
        const closeBtn = document.querySelector('.modal-close');
        
        if(!modalOverlay || !modalContentArea) return;

        // Delegação de eventos no document para capturar cliques nos botões recém renderizados pela paginação
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-modal]');
            if(trigger) {
                const targetId = trigger.getAttribute('data-modal');
                const dataElement = document.getElementById('data-' + targetId);
                
                if(dataElement) {
                    modalContentArea.innerHTML = dataElement.innerHTML;
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Evita scroll do body por tras do modal
                }
            }
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

    initNewsletter() {
        const nForm = document.getElementById('blog-newsletter');
        if(nForm) {
            nForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert("Obrigado por subscrever a Newsletter da Renovaluz!");
                nForm.reset();
            });
        }
    },

    setCurrentYear() {
        const yearEl = document.getElementById('current-year');
        if(yearEl) yearEl.innerText = new Date().getFullYear();
    }
};