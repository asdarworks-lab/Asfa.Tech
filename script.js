document.addEventListener("DOMContentLoaded", function() {
    
    // =========================================
    // 1. SISTEM ANIMASI SCROLL (INTERSECTION OBSERVER)
    // =========================================
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); 
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    elementsToAnimate.forEach(el => observer.observe(el));


    // =========================================
    // 2. SISTEM GALERI FOTO BERGANTI OTOMATIS
    // =========================================
    const stokFoto = [
        "img-1.jpeg", "img-5.jpeg", "img-6.jpeg", 
        "img-3.jpeg", "img-4.jpeg", "img-2.jpeg", "img-7.jpeg"
    ];

    const daftarGambarGaleri = document.querySelectorAll('.galeri-dinamis');
    if (daftarGambarGaleri.length > 0 && stokFoto.length > 0) {
        setInterval(() => {
            const kotakAcak = Math.floor(Math.random() * daftarGambarGaleri.length);
            const gambarTarget = daftarGambarGaleri[kotakAcak];
            const fotoBaruAcak = Math.floor(Math.random() * stokFoto.length);
            const namaFotoBaru = stokFoto[fotoBaruAcak];

            gambarTarget.style.opacity = "0.2";
            setTimeout(() => {
                gambarTarget.src = namaFotoBaru;
                gambarTarget.style.opacity = "1";
            }, 500); 
        }, 3000); 
    }


    // =========================================
    // 3. SISTEM MENU MOBILE (HAMBURGER)
    // =========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        });
    }


    // =========================================
    // 4. SISTEM PORTFOLIO DINAMIS (PURE GOOGLE SHEETS)
    // =========================================
    const portfolioContainer = document.getElementById('portfolioContainer');
    
    if (portfolioContainer) {
        
        // Tautan CSV Google Sheets terbaru yang Anda berikan
        const targetSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR24DB4yvanSVzQRdIvcaIbLWoKEB_Y0IwOEajChly1rvloYnYvS4_HeE-owA8AsXctNOwW6Hcuk1a/pub?gid=0&single=true&output=csv';
        const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(targetSheetUrl);

        let allPortfolioData = [];
        let currentFilter = 'all';
        let searchQuery = '';

        function loadPortfolio() {
            if (typeof Papa === 'undefined') {
                console.error('PapaParse belum termuat.');
                showErrorMsg('Library PapaParse belum termuat.');
                return;
            }

            fetch(proxyUrl)
                .then(response => {
                    if (!response.ok) throw new Error('Gagal merespons server.');
                    return response.json();
                })
                .then(data => {
                    const csvText = data.contents;
                    Papa.parse(csvText, {
                        header: true,
                        skipEmptyLines: true,
                        complete: function(results) {
                            const loadingMessage = document.getElementById('loadingMessage');
                            if (loadingMessage) loadingMessage.style.display = 'none';
                            
                            if (results.data && results.data.length > 0) {
                                allPortfolioData = results.data;
                                filterAndRender();
                            } else {
                                portfolioContainer.innerHTML = '<p class="text-center text-orange-500 font-semibold col-span-3">Data di Google Sheets Anda kosong.</p>';
                            }
                        },
                        error: function(err) {
                            console.error('Gagal parse CSV:', err);
                            showErrorMsg('Gagal memproses data dari Google Sheets.');
                        }
                    });
                })
                .catch(err => {
                    console.error('Gagal koneksi:', err);
                    showErrorMsg('Gagal memuat portofolio. Periksa kembali tautan Publish to web Google Sheets Anda.');
                });
        }

        function showErrorMsg(msg) {
            const loadingMessage = document.getElementById('loadingMessage');
            if (loadingMessage) {
                loadingMessage.innerHTML = `<p class="text-red-500 font-bold">${msg}</p>`;
            }
        }

        function filterAndRender() {
            const filteredData = allPortfolioData.filter(item => {
                const category = item.category ? item.category.toLowerCase().trim() : '';
                const title = item.title ? item.title.toLowerCase() : '';
                const techStack = item.tech_stack ? item.tech_stack.toLowerCase() : '';

                const matchesCategory = currentFilter === 'all' || category.includes(currentFilter);
                const matchesSearch = title.includes(searchQuery) || techStack.includes(searchQuery);

                return matchesCategory && matchesSearch;
            });

            renderPortfolio(filteredData);
        }

        function renderPortfolio(portfolioItems) {
            portfolioContainer.innerHTML = '';
            const noResultsMessage = document.getElementById('noResultsMessage');

            if (portfolioItems.length === 0) {
                if (noResultsMessage) noResultsMessage.classList.remove('hidden');
                return;
            } else {
                if (noResultsMessage) noResultsMessage.classList.add('hidden');
            }

            portfolioItems.forEach((item, index) => {
                let mediaElement = '';
                const mediaType = item.media_type ? item.media_type.toLowerCase().trim() : 'image';
                const revealClass = index % 2 === 0 ? 'reveal-left' : 'reveal-right';

                if (mediaType === 'mp4') {
                    mediaElement = `
                        <video class="portfolio-media transition-transform duration-500 group-hover:scale-105" autoplay loop muted playsinline>
                            <source src="${item.media_url}" type="video/mp4">
                        </video>`;
                } else if (mediaType === 'youtube') {
                    mediaElement = `
                        <iframe class="portfolio-media" src="${item.media_url}" allowfullscreen></iframe>`;
                } else {
                    mediaElement = `<img src="${item.media_url}" alt="${item.title || 'Portfolio'}" class="portfolio-media transition-transform duration-500 group-hover:scale-105" loading="lazy">`;
                }

                const cardHTML = `
                    <div class="relative group overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-blue/30 transition-all ${revealClass}">
                        <div class="h-56 bg-slate-200 overflow-hidden relative">
                            ${mediaElement}
                        </div>
                        <div class="p-6 flex flex-col h-[220px]">
                            <span class="inline-block text-[10px] md:text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">${item.category || 'General'}</span>
                            <h3 class="font-bold text-brand-dark text-xl mb-3 line-clamp-2">${item.title || 'Untitled Project'}</h3>
                            <p class="text-slate-500 text-sm mb-4 flex-grow"><i class="fas fa-code mr-1"></i> ${item.tech_stack || '-'}</p>
                            <a href="${item.project_link || '#'}" target="_blank" class="block w-full text-center bg-brand-light hover:bg-brand-blue text-brand-dark hover:text-white border border-slate-200 py-2.5 rounded-xl font-bold text-sm transition-colors">
                                View Project <i class="fas fa-external-link-alt ml-1 text-[10px]"></i>
                            </a>
                        </div>
                    </div>
                `;
                
                portfolioContainer.innerHTML += cardHTML;
            });
            
            setTimeout(() => {
                const newElements = document.querySelectorAll('.reveal-left:not(.active), .reveal-right:not(.active)');
                newElements.forEach(el => observer.observe(el));
            }, 100);
        }

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase().trim();
                filterAndRender();
            });
        }

        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => {
                    b.classList.remove('bg-brand-blue', 'text-white', 'shadow-sm');
                    b.classList.add('bg-white', 'text-slate-600', 'border', 'border-slate-200');
                });

                e.target.classList.remove('bg-white', 'text-slate-600', 'border', 'border-slate-200');
                e.target.classList.add('bg-brand-blue', 'text-white', 'shadow-sm');

                currentFilter = e.target.getAttribute('data-filter');
                filterAndRender();
            });
        });

        loadPortfolio();
    }
});
